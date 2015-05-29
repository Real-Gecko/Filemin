<?php
/**
 * @file
 * Source: XYZ.
 */

namespace Drupal\openlayers\Source;
use Drupal\openlayers\Types\Source;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Source\\XYZ',
);

/**
 * Class XYZ.
 */
class XYZ extends Source {
  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['url'] = array(
      '#title' => t('URL(s)'),
      '#type' => 'textarea',
      '#default_value' => $this->getOption('url') ? $this->getOption('url') : '',
    );
  }
}
