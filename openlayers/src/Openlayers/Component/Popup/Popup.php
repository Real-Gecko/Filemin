<?php
/**
 * @file
 * Component: Popup.
 */

namespace Drupal\openlayers\Component;
use Drupal\openlayers\Types\Component;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Component\\Popup',
);

/**
 * Class Popup.
 */
class Popup extends Component {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['layers'] = array(
      '#type' => 'select',
      '#title' => t('Layers'),
      '#default_value' => isset($form_state['item']->options['layers']) ? $form_state['item']->options['layers'] : '',
      '#description' => t('Select the layers.'),
      '#options' => openlayers_layer_options(),
      '#required' => TRUE,
      '#multiple' => TRUE,
    );

    $form['options']['positioning'] = array(
      '#type' => 'select',
      '#title' => t('Positioning'),
      '#default_value' => isset($form_state['item']->options['positioning']) ? $form_state['item']->options['positioning'] : 'top-left',
      '#description' => t('Defines how the overlay is actually positioned. Default is top-left.'),
      '#options' => openlayers_positioning_options(),
      '#required' => TRUE,
    );
  }

  /**
   * {@inheritdoc}
   */
  public function preBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    $layers = $this->getOption('layers', array());
    $map_layers = $context->getLayers();
    // Only handle layers available in the map and configured in the control.
    // Ensures maximum performance on client side while having maximum
    // configuration flexibility.
    $frontend_layers = array();
    foreach ($map_layers as $map_layer) {
      if (isset($layers[$map_layer->machine_name])) {
        $frontend_layers[$map_layer->machine_name] = $map_layer->machine_name;
      }
    }
    $this->setOption('layers', $frontend_layers);
  }
}
