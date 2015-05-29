<?php
/**
 * @file
 * Component: Geofield.
 */

namespace Drupal\openlayers\Component;
use Drupal\openlayers\Types\Component;
use \geoPHP;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Component\\Geofield',
);

/**
 * Class Geofield.
 */
class Geofield extends Component {

  /**
   * {@inheritdoc}
   */
  public function defaultProperties() {
    $defaults = parent::defaultProperties();
    $defaults['options'] = array(
      'dataType' => array('GeoJSON'),
      'dataProjection' => 'EPSG:4326',
      'typeOfFeature' => array(
        'Point',
        'LineString',
        'Polygon',
      ),
      'featureLimit' => 0,
      'showInputField' => 0,
      'inputFieldName' => 'geofield',
      'initialData' => '',
      'actionFeature' => array('draw' => 'draw', 'modify' => 'modify'),
      'source' => NULL,
    );
    return $defaults;
  }

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['dataType'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Data type'),
      '#description' => t('If more than one type is choosen a control to select the type to use is displayed when drawing.'),
      '#multiple' => TRUE,
      '#options' => array(
        'GeoJSON' => 'GeoJSON',
        'KML' => 'KML',
        'GPX' => 'GPX',
        'WKT' => 'WKT',
      ),
      '#default_value' => $this->getOption('dataType'),
      '#required' => TRUE,
    );
    $form['options']['dataProjection'] = array(
      '#type' => 'radios',
      '#title' => t('Data projection'),
      '#options' => array(
        'EPSG:4326' => 'EPSG:4326',
        'EPSG:3857' => 'EPSG:3857',
      ),
      '#description' => t('Defines in which projection the data are read and written.'),
      '#default_value' => $this->getOption('dataProjection', 'EPSG:4326'),
      '#required' => TRUE,
    );
    $form['options']['actionFeature'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Type of interaction allowed'),
      '#multiple' => TRUE,
      '#options' => array('draw' => t('Draw'), 'modify' => t('Modify')),
      '#default_value' => $this->getOption('actionFeature'),
      '#required' => TRUE,
    );
    $form['options']['typeOfFeature'] = array(
      '#type' => 'checkboxes',
      '#title' => t('Geometry type'),
      '#description' => t('If more than one type is choosen a control to select the type to use is displayed when drawing.'),
      '#multiple' => TRUE,
      '#options' => array(
        'Point' => t('Point'),
        'LineString' => t('LineString'),
        'Polygon' => t('Polygon'),
      ),
      '#default_value' => $this->getOption('typeOfFeature'),
      '#required' => TRUE,
    );
    $form['options']['featureLimit'] = array(
      '#type' => 'textfield',
      '#title' => t('Feature limit'),
      '#description' => t('Limits the number of features. Set to 0 for no limit.'),
      '#default_value' => $this->getOption('featureLimit'),
      '#required' => TRUE,
    );
    $form['options']['showInputField'] = array(
      '#type' => 'checkbox',
      '#title' => t('Show input field'),
      '#description' => t('Shows the data in a textarea.'),
      '#default_value' => (int) $this->getOption('showInputField'),
    );
    $form['options']['inputFieldName'] = array(
      '#type' => 'textfield',
      '#title' => t('Name of the input field'),
      '#description' => t('Define the name of the input field. You can use brackets to build structure: [geofield][component][data]'),
      '#default_value' => $this->getOption('inputFieldName'),
    );
    $form['options']['initialData'] = array(
      '#type' => 'textarea',
      '#title' => t('Initial data'),
      '#description' => t('Initial data to set. You can use any of the data types available as "Data type". Ensure the data have the same projection as defined in "Data projection".'),
      '#default_value' => $this->getOption('initialData'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function preBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    // Auto-detect the source to use for the features.
    if (empty($this->options['source'])) {
      foreach ($context->getCollection()->getObjects('source') as $source) {
        if ($source instanceof \Drupal\openlayers\Source\Geofield) {
          $this->setOption('source', $source->machine_name);
        }
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getJS() {
    // Ensure the options are properly set and clean.
    $this->options['dataType'] = array_filter($this->options['dataType']);
    $this->options['typeOfFeature'] = array_filter($this->options['typeOfFeature']);
    $this->options['actionFeature'] = array_filter($this->options['actionFeature']);

    // Process initial data. Ensure it's WKT.
    if (isset($this->options['initialData'])) {

      // Process strings and arrays likewise.
      geophp_load();
      if (!is_array($this->options['initialData'])) {
        $this->options['initialData'] = array($this->options['initialData']);
      }
      $geoms = array();
      foreach ($this->options['initialData'] as $delta => $item) {
        if (is_array($item) && array_key_exists('geom', $item)) {
          $geoms[] = geoPHP::load($item['geom']);
        }
        else {
          $geoms[] = geoPHP::load($item);
        }
      }
      $combined_geom = geoPHP::geometryReduce($geoms);
      // If we could parse the geom process further.
      if ($combined_geom && !$combined_geom->isEmpty()) {
        // We want to force the combined_geom into a geometryCollection.
        $geom_type = $combined_geom->geometryType();
        if ($geom_type == 'MultiPolygon' || $geom_type == 'MultiLineString' || $geom_type == 'MultiPoint') {
          $combined_geom = new \GeometryCollection($combined_geom->getComponents());
        }

        // Ensure proper initial data in the textarea / hidden field.
        $this->options['initialData'] = $combined_geom->out(strtolower(key($this->options['dataType'])));
        $this->options['initialDataType'] = key($this->options['dataType']);
      }
      else {
        // Set initial data to NULL if the data couldn't be evaluated.
        $this->options['initialData'] = NULL;
        $this->options['initialDataType'] = key($this->options['dataType']);
      }
    }
    return parent::getJS();
  }

  /**
   * {@inheritdoc}
   */
  public function postBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    $component = array(
      '#type' => 'fieldset',
      '#title' => 'Geofield component',
      '#attributes' => array(
        'id' => 'geofield-' . $context->getId(),
      ),
    );

    $action_feature = $type_of_feature = $this->getOption('actionFeature');
    if (count($action_feature) > 1) {
      $component['actionFeature'] = array(
        '#type' => 'select',
        '#title' => 'Type of interaction',
        '#options' => array_intersect_key(
          array('draw' => t('Draw'), 'modify' => t('Modify')),
          $action_feature
        ),
        '#attributes' => array(
          'class' => array('action-feature'),
        ),
      );
    }
    else {
      $component['actionFeature'] = array(
        '#type' => 'hidden',
        '#default_value' => reset($action_feature),
        '#attributes' => array(
          'class' => array('action-feature'),
        ),
      );
    }

    $data_type = $this->getOption('dataType');
    if (count($data_type) > 1) {
      $component['dataType'] = array(
        '#type' => 'select',
        '#title' => 'Data type',
        '#options' => array_intersect_key(
          array(
            'GeoJSON' => 'GeoJSON',
            'KML' => 'KML',
            'GPX' => 'GPX',
            'WKT' => 'WKT',
          ),
          $data_type
        ),
        '#attributes' => array(
          'class' => array('data-type'),
        ),
      );
    }
    else {
      $component['dataType'] = array(
        '#type' => 'hidden',
        '#default_value' => reset($data_type),
        '#value' => reset($data_type),
        '#attributes' => array(
          'class' => array('data-type'),
        ),
      );
    }

    $type_of_feature = $this->getOption('typeOfFeature');
    if (count($type_of_feature) > 1) {
      $component['typeOfFeature'] = array(
        '#type' => 'select',
        '#title' => 'Geometry type',
        '#options' => array_intersect_key(
          array(
            'Point' => t('Point'),
            'LineString' => t('LineString'),
            'Polygon' => t('Polygon'),
          ),
          $type_of_feature
        ),
        '#attributes' => array(
          'id' => 'typeOfFeature',
          'class' => array('type-of-feature'),
        ),
      );
    }
    else {
      $component['typeOfFeature'] = array(
        '#type' => 'hidden',
        '#default_value' => reset($type_of_feature),
        '#value' => reset($type_of_feature),
        '#attributes' => array(
          'class' => array('type-of-feature'),
        ),
      );
    }
    $component['clearmap'] = array(
      '#markup' => '<a href="#" class="clearmap">' . t('Clear the map') . '</a>',
    );

    $component['data'] = array(
      '#type' => ($this->getOption('showInputField')) ? 'textarea' : 'hidden',
      '#title' => 'Data',
      '#attributes' => array(
        'class' => array('openlayers-geofield-data'),
      ),
      '#default_value' => $this->getOption('initialData'),
      '#value' => $this->getOption('initialData'),
    );

    // Now add the component into the build array. This is a bit complex due
    // the fact that we want to support form nesting.
    $build = array('map' => $build);
    $parents = array('geofield', 'component');
    $data_input_field_name = $this->getOption('inputFieldName');
    if (!empty($data_input_field_name)) {
      $data_input_field_name = preg_replace('/(^\[|\]$)/', '', $data_input_field_name);
      $levels = explode('][', $data_input_field_name);
      $parents = array_slice(explode('][', $data_input_field_name), 0, count($levels) - 1);
      // Ensure the requested name for the input data field is set.
      $component[end($levels)] = $component['data'];
      unset($component['data']);
    }
    if (!empty($parents)) {
      drupal_array_set_nested_value($build, $parents, $component);
    }
    else {
      $build += $component;
    }
  }

}
