<?php
/**
 * @file
 * Control: LayerSwitcher.
 *
 * Proof of concept based on http://geocre.github.io/ol3/layerswitcher.html
 */

namespace Drupal\openlayers\Control;
use Drupal\openlayers\Types\Control;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Control\\LayerSwitcher',
);

/**
 * Class LayerSwitcher
 *
 * @package Drupal\openlayers\Control
 */
class LayerSwitcher extends Control {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['label'] = array(
      '#type' => 'textfield',
      '#title' => t('Title of the control'),
      '#default_value' => $this->getOption('label', 'Layers'),
    );
    $form['options']['layers'] = array(
      '#type' => 'select',
      '#title' => t('Layers'),
      '#multiple' => TRUE,
      '#default_value' => $this->getOption('layers'),
      '#options' => openlayers_layer_options(FALSE),
    );
    $form['options']['multiselect'] = array(
      '#type' => 'checkbox',
      '#title' => t('Allow selecting multiple layers'),
      '#default_value' => $this->getOption('multiselect', FALSE),
    );
    // @TODO Add configuration to add labels for layers.
    // @TODO Add configuration for initial visibility. (Adjust JS accordingly)
    // @TODO Add configuration for ordering?
  }

  /**
   * {@inheritdoc}
   */
  public function preBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    $map_id = $context->getId();
    $layers = $this->getOption('layers', array());
    $items = array();
    $map_layers = $context->getLayers();

    $element_type = ($this->getOption('multiselect', FALSE)) ? 'checkbox' : 'radio';

    // Only handle layers available in the map and configured in the control.
    // @TODO: use Form API (with form_process_* and stuff)
    foreach ($map_layers as $i => $map_layer) {
      if (isset($layers[$map_layer->machine_name])) {
        $checked = '';
        if ($element_type == 'checkbox') {
          if ($map_layer->getOption('visible', 1)) {
            $checked = 'checked ';
          }
        }

        $items[] = array(
          'data' => '<label><input type="' . $element_type . '" name="layer" ' . $checked . 'value="' . $map_layer->machine_name . '">' . $map_layer->name . '</label>',
          'id' => $map_id . '-' . $map_layer->machine_name,
          'class' => array(drupal_html_class($map_layer->machine_name)),
        );
      }
    }

    // @TODO Do we need i18n integration?
    $layerswitcher = array(
      '#theme' => 'item_list',
      '#type' => 'ul',
      '#title' => t($this->getOption('label', 'Layers')),
      '#items' => $items,
      '#attributes' => array(
        'id' => drupal_html_id($this->machine_name),
      ),
    );
    $this->setOption('element', '<div id="' . drupal_html_id($this->machine_name) . '" class="layerswitcher">' . drupal_render($layerswitcher) . '</div>');
  }
}
