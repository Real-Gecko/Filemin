<?php
/**
 * @file
 * This file holds the functions for the main openlayers Admin settings.
 *
 * @ingroup openlayers
 */

/**
 * Menu callback; displays the openlayers module settings page.
 *
 * @see system_settings_form()
 */
function openlayers_ui_admin_settings($form, &$form_state) {
  ctools_include('export');
  $maps = ctools_export_crud_load_all('openlayers_maps');
  $options = array();
  foreach ($maps as $machine_name => $data) {
    // Todo: Rewrite properly and create a generic function to load all objects.
    if (property_exists($data, 'disabled') && ($data->disabled == 1 || $data->disabled == TRUE)) {
      continue;
    }
    $options[$data->machine_name] = $data->name;
  }

  $map = \Drupal\openlayers\Config::get('openlayers.default_ui_map');
  if (isset($form_state['values']['openlayers_default_map'])) {
    $map = $form_state['values']['openlayers_default_map'];
  }

  // @todo: Is this setting really needed ?
  $form['openlayers_default_map'] = array(
    '#type' => 'select',
    '#title' => t('Default UI map'),
    '#options' => $options,
    '#default_value' => $map,
    '#ajax' => array(
      'callback' => '_openlayers_ajax_reload_default_map',
      'method' => 'replace',
      'wrapper' => 'default_map_ajax',
      'effect' => 'fade',
    ),
  );

  $form['default_ui_map'] = array(
    '#prefix' => '<div id="default_map_ajax">',
    '#suffix' => '</div>',
    '#type' => 'openlayers',
    '#map' => $map,
  );

  $form['debug'] = array(
    '#type' => 'checkbox',
    '#title' => t('Debug mode'),
    '#description' => t('Enable this option when creating objects. Hit F12 in Chrome or Firefox to see the debugging informations. Doesn\'t fully work in IE yet.'),
    '#default_value' => \Drupal\openlayers\Config::get('openlayers.debug'),
  );

  // This is for preventing 'system/ajax' as destination when using AJAX maps.
  // See: http://drupal.stackexchange.com/questions/86958/get-current-url-arguments-inside-ajax-callback
  $form['current_path'] = array('#type' => 'hidden', '#value' => current_path());

  $form['buttons'] = array(
    'submit' => array(
      '#type' => 'submit',
      '#value' => 'Save configuration'
    )
  );

  return $form;
}

/**
 * @TODO: Document.
 */
function _openlayers_ajax_reload_default_map($form, &$form_state) {
  // This is for preventing 'system/ajax' as destination when using AJAX maps.
  // See: http://drupal.stackexchange.com/questions/86958/get-current-url-arguments-inside-ajax-callback
  $_SESSION['current_path'] = $form_state['input']['current_path'];
  return $form['default_ui_map'];
}

function openlayers_ui_admin_settings_submit($form, &$form_state) {
  $values = $form_state['values'];
  \Drupal\openlayers\Config::set('openlayers.debug', $values['debug']);
  drupal_set_message(t('The configuration options have been saved.'));
}
