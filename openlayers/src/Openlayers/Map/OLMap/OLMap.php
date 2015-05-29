<?php
/**
 * @file
 * Map: Map.
 */

namespace Drupal\openlayers\Map;
use Drupal\openlayers\Config;
use Drupal\openlayers\Types\Map;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Map\\OLMap',
);

/**
 * Class OLMap.
 */
class OLMap extends Map {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['ui'] = array(
      '#type' => 'fieldset',
      '#title' => t('User interface'),
      'width' => array(
        '#type' => 'textfield',
        '#title' => 'Width of the map',
        '#default_value' => $this->getOption('width', 'auto'),
        '#parents' => array('options', 'width'),
      ),
      'height' => array(
        '#type' => 'textfield',
        '#title' => 'Height of the map',
        '#default_value' => $this->getOption('height', '300px'),
        '#parents' => array('options', 'height'),
      ),
    );

    $form['options']['view'] = array(
      '#type' => 'fieldset',
      '#title' => t('Center and rotation'),
      '#tree' => TRUE,
    );

    if ($this->machine_name != Config::get('openlayers.edit_view_map')) {
      $map = openlayers_object_load('Map', Config::get('openlayers.edit_view_map'));
      if ($view = $this->getOption('view')) {
        $map->setOption('view', $view);
      }

      $form['options']['view']['map'] = array(
        '#type' => 'openlayers',
        '#description' => $map->description,
        '#map' => $map,
      );
    }

    $form['options']['view']['center'] = array(
      '#tree' => TRUE,
      'lat' => array(
        '#type' => 'textfield',
        '#title' => 'Latitude',
        '#default_value' => $this->getOption(array('view', 'center', 'lat'), 0),
      ),
      'lon' => array(
        '#type' => 'textfield',
        '#title' => 'Longitude',
        '#default_value' => $this->getOption(array('view', 'center', 'lat'), 0),
      ),
    );
    $form['options']['view']['rotation'] = array(
      '#type' => 'textfield',
      '#title' => 'Rotation',
      '#default_value' => $this->getOption(array('view', 'rotation'), 0),
    );
    $form['options']['view']['zoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Zoom',
      '#default_value' => $this->getOption(array('view', 'zoom'), 0),
    );
    $form['options']['view']['minZoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Min zoom',
      '#default_value' => $this->getOption(array('view', 'minZoom'), 0),
    );
    $form['options']['view']['maxZoom'] = array(
      '#type' => 'textfield',
      '#title' => 'Max zoom',
      '#default_value' => $this->getOption(array('view', 'maxZoom'), 0),
    );

    $form['options']['misc'] = array(
      '#type' => 'fieldset',
      '#title' => 'Miscellaneous options',
    );
    $form['options']['misc']['renderer'] = array(
      '#type' => 'radios',
      '#title' => 'Renderer',
      '#description' => 'Renderer by default. Canvas, DOM and WebGL renderers are tested for support in that order. Note that at present only the Canvas renderer support vector data.',
      '#options' => array('canvas' => 'Canvas', 'dom' => 'DOM', 'webgl' => 'WebGL'),
      '#default_value' => $this->getOption('renderer', 'canvas'),
      '#parents' => array('options', 'renderer')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function attached() {
    $attached = parent::attached();
    $variant = NULL;
    if (Config::get('openlayers.debug', FALSE) == TRUE) {
      $variant = 'debug';
    };
    $attached['libraries_load']['openlayers3'] = array('openlayers3', $variant);
    return $attached;
  }
}
