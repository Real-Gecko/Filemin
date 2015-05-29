<?php
/**
 * @file
 * Source: BingMaps.
 */

namespace Drupal\openlayers\Source;
use Drupal\openlayers\Types\Source;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Source\\BingMaps',
);

/**
 * Class BingMaps.
 */
class BingMaps extends Source {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $layer_types = array(
      'Road',
      'Aerial',
      'AerialWithLabels',
      'collinsBart',
      'ordnanceSurvey',
    );

    $form['options']['key'] = array(
      '#title' => t('Key'),
      '#type' => 'textfield',
      '#default_value' => $this->getOption('key', ''),
    );
    $form['options']['imagerySet'] = array(
      '#title' => t('Imagery set'),
      '#type' => 'select',
      '#default_value' => $this->getOption('imagerySet', 'Road'),
      '#options' => array_combine($layer_types, $layer_types),
    );
  }

}
