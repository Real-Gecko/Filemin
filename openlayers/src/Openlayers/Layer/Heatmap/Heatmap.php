<?php
/**
 * @file
 * Layer: Heatmap.
 */

namespace Drupal\openlayers\Layer;
use Drupal\openlayers\Types\Layer;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Layer\\Heatmap',
);

/**
 * Class Heatmap.
 */
class Heatmap extends Layer {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['opacity'] = array(
      '#type' => 'textfield',
      '#description' => 'Opacity (0, 1). Default is 1.',
      '#default_value' => $this->getOption('opacity', 1),
    );
    $form['options']['preload'] = array(
      '#type' => 'textfield',
      '#description' => 'Preload. Load low-resolution tiles up to preload levels. By default preload is 0, which means no preloading.',
      '#default_value' => $this->getOption('preload', 1),
    );
  }

}
