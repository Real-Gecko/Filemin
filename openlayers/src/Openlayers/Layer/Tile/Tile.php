<?php
/**
 * @file
 * Layer: Tile.
 */

namespace Drupal\openlayers\Layer;
use Drupal\openlayers\Types\Layer;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Layer\\Tile',
);

/**
 * Class Tile.
 */
class Tile extends Layer {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['opacity'] = array(
      '#type' => 'textfield',
      '#title' => t('Opacity'),
      '#default_value' => $this->getOption('opacity', 1),
      '#description' => t(''),
    );
    $form['options']['zoomOffset'] = array(
      '#type' => 'select',
      '#description' => t('Zoom offset.'),
      '#options' => array_combine(
        range(0, 21),
        range(0, 21)),
      '#title' => t('Zoom offset'),
      '#default_value' => $this->getOption('zoomOffset'),
    );
    $form['options']['wrapDateLine'] = array(
      '#type' => 'checkbox',
      '#title' => t('Wrap Date Line'),
      '#default_value' => $this->getOption('wrapDateLine'),
      '#description' => t('This allows the user to continually pan left and right as the tiles will repeat themselves.  Note that this option is known to not work well with the 2.10 OL library.'),
    );
  }

}
