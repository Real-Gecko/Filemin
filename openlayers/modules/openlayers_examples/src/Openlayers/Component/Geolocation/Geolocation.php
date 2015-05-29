<?php
/**
 * @file
 * Component: Geolocation.
 */

namespace Drupal\openlayers\Component;
use Drupal\openlayers\Types\Component;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Component\\Geolocation',
);

/**
 * Class Geolocation.
 */
class Geolocation extends Component {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['checkboxID'] = array(
      '#type' => 'textfield',
      '#title' => t('Checkbox HTML ID'),
      '#default_value' => $this->getOption('checkboxID', 'trackPosition'),
    );
    $form['options']['positionAccuracyID'] = array(
      '#type' => 'textfield',
      '#title' => t('Position accuracy HTML ID'),
      '#default_value' => $this->getOption('positionAccuracyID', 'positionAccuracy'),
    );
    $form['options']['altitudeID'] = array(
      '#type' => 'textfield',
      '#title' => t('Altitude HTML ID'),
      '#default_value' => $this->getOption('altitudeID', 'altitude'),
    );
    $form['options']['altitudeAccuracyID'] = array(
      '#type' => 'textfield',
      '#title' => t('Altitude accuracy HTML ID'),
      '#default_value' => $this->getOption('altitudeAccuracyID', 'altitudeAccuracy'),
    );
    $form['options']['headingID'] = array(
      '#type' => 'textfield',
      '#title' => t('Heading HTML ID'),
      '#default_value' => $this->getOption('headingID', 'heading'),
    );
    $form['options']['speedID'] = array(
      '#type' => 'textfield',
      '#title' => t('Speed HTML ID'),
      '#default_value' => $this->getOption('speedID', 'speed'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function postBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    $build = array(
      'map' => $build,
      'Geolocation' => array(
        '#type' => 'fieldset',
        '#title' => 'Example Geolocation component',
        'info' => array(
          '#markup' => '<div id="info"></div>',
        ),
        'trackPosition' => array(
          '#type' => 'checkbox',
          '#title' => 'Track position',
          '#attributes' => array(
            'id' => 'trackPosition',
          ),
        ),
        'positionAccuracy' => array(
          '#type' => 'textfield',
          '#title' => 'Position accuracy',
          '#attributes' => array(
            'id' => 'positionAccuracy',
          ),
        ),
        'altitude' => array(
          '#type' => 'textfield',
          '#title' => 'Altitude',
          '#attributes' => array(
            'id' => 'altitude',
          ),
        ),
        'altitudeAccuracy' => array(
          '#type' => 'textfield',
          '#title' => 'Altitude accuracy',
          '#attributes' => array(
            'id' => 'altitudeAccuracy',
          ),
        ),
        'heading' => array(
          '#type' => 'textfield',
          '#title' => 'Heading',
          '#attributes' => array(
            'id' => 'heading',
          ),
        ),
        'speed' => array(
          '#type' => 'textfield',
          '#title' => 'Speed',
          '#attributes' => array(
            'id' => 'speed',
          ),
        )
      )
    );
  }

}
