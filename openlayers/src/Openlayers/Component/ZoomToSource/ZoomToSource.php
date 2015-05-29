<?php
/**
 * @file
 * Component: ZoomSource.
 */

namespace Drupal\openlayers\Component;
use Drupal\openlayers\Types\Component;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Component\\ZoomToSource',
);

/**
 * Class ZoomToSource.
 */
class ZoomToSource extends Component {

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {
    $form['options']['source'] = array(
      '#type' => 'select',
      '#title' => t('Source'),
      '#default_value' => isset($form_state['item']->options['source']) ? $form_state['item']->options['source'] : '',
      '#description' => t('Select the source.'),
      '#options' => openlayers_source_options(),
      '#required' => TRUE,
    );

    $form['options']['zoom'] = array(
      '#type' => 'textfield',
      '#title' => t('Zoom'),
      '#default_value' => isset($form_state['item']->options['zoom']) ? $form_state['item']->options['zoom'] : 10,
      '#description' => t('Integer or <em>auto</em>.'),
      '#required' => TRUE,
    );
    $form['options']['max_zoom'] = array(
      '#type' => 'textfield',
      '#title' => t('Max Zoom'),
      '#default_value' => isset($form_state['item']->options['max_zoom']) ? $form_state['item']->options['max_zoom'] : 0,
      '#description' => t('Define the max zoom for the autozoom. Disabled when <em>0</em>.'),
      '#states' => array(
        'visible' => array(
          'input[name="options[zoom]"' => array('value' => 'auto'),
        ),
      ),
    );

    $form['options']['enableAnimations'] = array(
      '#type' => 'checkbox',
      '#title' => t('Enable animations'),
      '#default_value' => isset($form_state['item']->options['enableAnimations']) ? $form_state['item']->options['enableAnimations'] : FALSE,
      '#description' => t('Enable pan and zoom animation.'),
    );

    $form['options']['animations'] = array(
      '#type' => 'fieldset',
      '#title' => 'Animations options',
      '#states' => array(
        'visible' => array(
          'input[name="options[enableAnimations]"' => array('checked' => TRUE),
        ),
      ),
    );

    $form['options']['animations']['pan'] = array(
      '#type' => 'textfield',
      '#title' => t('Pan animation duration'),
      '#default_value' => isset($form_state['item']->options['animations']['pan']) ? $form_state['item']->options['animations']['pan'] : '500',
      '#description' => t('Duration of the pan animation.'),
    );

    $form['options']['animations']['zoom'] = array(
      '#type' => 'textfield',
      '#title' => t('Zoom animation duration'),
      '#default_value' => isset($form_state['item']->options['animations']['zoom']) ? $form_state['item']->options['animations']['zoom'] : '500',
      '#description' => t('Duration of the zoom animation.'),
    );
  }
}
