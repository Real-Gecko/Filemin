<?php
/**
 * @file
 * CTools Export UI plugin definition for controls.
 */

/**
 * CTools Export UI plugin definition.
 */
function openlayers_ui_OpenlayersControls_ctools_export_ui() {
  return array(
    'schema' => 'openlayers_controls',
    'access' => 'administer openlayers',
    'menu' => array(
      'menu prefix' => 'admin/structure/openlayers',
      'menu item' => 'controls',
      'menu title' => 'Controls',
      'menu description' => 'Administer OpenLayers controls.',
    ),

    'handler' => array(
      'class' => '\\Drupal\\openlayers\\UI\\OpenlayersControls',
      'file' => 'OpenlayersControls.php',
    ),

    'export' => array(
      'admin_title' => 'name',
      'admin_description' => 'description',
    ),

    'use wizard' => TRUE,
    'form info' => array(
      'order' => array(
        'start' => t('Administrative settings'),
        'type' => t('Control type'),
        'options' => t('Control type options'),
      ),
      'forms' => array(
        'start' => array(
          'form id' => 'openlayers_control_form_start',
        ),
        'type' => array(
          'form id' => 'openlayers_control_form_type',
        ),
        'options' => array(
          'form id' => 'openlayers_control_form_options',
        ),
      ),
      'wrapper' => 'openlayers_objects_ui_form_wrapper',
    ),

    'title singular' => t('control'),
    'title plural' => t('controls'),
    'title singular proper' => t('OpenLayers control preset'),
    'title plural proper' => t('OpenLayers control presets'),

    'strings' => array(
      'confirmation' => array(
        'add' => array(
          'success' => t('Control saved.'),
        ),
        'delete' => array(
          'success' => t('Control was deleted.'),
        ),
      ),
    ),
  );
}

/**
 * Control base config form handler.
 */
function openlayers_control_form_start($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersControls();
  $class->init($form_state['plugin']);
  $class->edit_form($form, $form_state);

  $maps = ctools_export_crud_load_all('openlayers_maps');
  $options = array('' => 'Dont attach');
  foreach ($maps as $machine_name => $data) {
    $map = openlayers_object_load('Map', $machine_name);
    if (property_exists($map, 'disabled') && ($map->disabled == 1 || $map->disabled == TRUE)) {
      continue;
    }
    $options[$machine_name] = $data->name;
  }

  $form['attachToMap'] = array(
    '#type' => 'select',
    '#title' => 'Add this to a map ?',
    '#description' => 'Select the map to add this object to.',
    '#options' => $options,
  );

  return $form;
}

/**
 * Control base config form validation handler.
 */
function openlayers_control_form_start_validate($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersControls();
  $class->init($form_state['plugin']);
  $class->edit_form_validate($form, $form_state);
}

/**
 * Control base config form submit handler.
 */
function openlayers_control_form_start_submit($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersControls();
  $class->init($form_state['plugin']);
  $class->edit_form_submit($form, $form_state);

  if ($form_state['values']['attachToMap']) {
    $map = ctools_export_crud_load('openlayers_maps', $form_state['values']['attachToMap']);
    $map->options['controls'][] = $form_state['item']->machine_name;
    ctools_export_crud_save('openlayers_maps', $map);
  }
}

/**
 * Control type config form handler.
 */
function openlayers_control_form_type($form, &$form_state) {
  $form['factory_service'] = array(
    '#type' => 'select',
    '#title' => t('Control Type'),
    '#default_value' => isset($form_state['item']->factory_service) ? $form_state['item']->factory_service : '',
    '#description' => t('Select the type of control.'),
    '#options' => Openlayers::getOLObjectsOptions('Control'),
    '#required' => TRUE,
  );

  return $form;
}

/**
 * Control type config form submit handler.
 */
function openlayers_control_form_type_submit($form, &$form_state) {
  $form_state['item']->factory_service = $form_state['values']['factory_service'];
}

/**
 * Control options config form handler.
 */
function openlayers_control_form_options($form, &$form_state) {
  $control = openlayers_object_load('Control', $form_state['item']);
  $control->optionsForm($form, $form_state);
  $form['options']['#tree'] = TRUE;

  return $form;
}

/**
 * Control options config form validation handler.
 */
function openlayers_control_form_options_validate($form, &$form_state) {
  $control = openlayers_object_load('Control', $form_state['item']);
  $control->optionsFormValidate($form, $form_state);
}

/**
 * Control options config form submit handler.
 */
function openlayers_control_form_options_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }
  $control = openlayers_object_load('Control', $form_state['item']);
  $control->optionsFormSubmit($form, $form_state);
}
