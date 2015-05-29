<?php
/**
 * @file
 * CTools Export UI plugin definition for interactions.
 */

/**
 * CTools Export UI plugin definition.
 */
function openlayers_ui_OpenlayersInteractions_ctools_export_ui() {
  return array(
    'schema' => 'openlayers_interactions',
    'access' => 'administer openlayers',
    'menu' => array(
      'menu prefix' => 'admin/structure/openlayers',
      'menu item' => 'interactions',
      'menu title' => 'Interactions',
      'menu description' => 'Administer OpenLayers interactions.',
    ),

    'handler' => array(
      'class' => '\\Drupal\\openlayers\\UI\\openlayersInteractions',
      'file' => 'OpenlayersInteractions.php',
    ),

    'export' => array(
      'admin_title' => 'name',
      'admin_description' => 'description',
    ),

    'use wizard' => TRUE,
    'form info' => array(
      'order' => array(
        'start' => t('Administrative settings'),
        'type' => t('Interaction type'),
        'options' => t('Interaction type options'),
      ),
      'forms' => array(
        'start' => array(
          'form id' => 'openlayers_interaction_form_start',
        ),
        'type' => array(
          'form id' => 'openlayers_interaction_form_type',
        ),
        'options' => array(
          'form id' => 'openlayers_interaction_form_options',
        ),
      ),
      'wrapper' => 'openlayers_objects_ui_form_wrapper',
    ),

    'title singular' => t('interaction'),
    'title plural' => t('interactions'),
    'title singular proper' => t('OpenLayers interaction preset'),
    'title plural proper' => t('OpenLayers interaction presets'),

    'strings' => array(
      'confirmation' => array(
        'add' => array(
          'success' => t('Interaction saved.'),
        ),
        'delete' => array(
          'success' => t('Interaction was deleted.'),
        ),
      ),
    ),
  );
}

/**
 * Interaction base config form handler.
 */
function openlayers_interaction_form_start($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersInteractions();
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
 * Interaction base config form validation handler.
 */
function openlayers_interaction_form_start_validate($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersInteractions();
  $class->init($form_state['plugin']);
  $class->edit_form_validate($form, $form_state);
}

/**
 * Interaction base config form submit handler.
 */
function openlayers_interaction_form_start_submit($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersInteractions();
  $class->init($form_state['plugin']);
  $class->edit_form_submit($form, $form_state);

  if ($form_state['values']['attachToMap']) {
    $map = ctools_export_crud_load('openlayers_maps', $form_state['values']['attachToMap']);
    $map->options['interactions'][] = $form_state['item']->machine_name;
    ctools_export_crud_save('openlayers_maps', $map);
  }
}

/**
 * Interaction type config form handler.
 */
function openlayers_interaction_form_type($form, &$form_state) {
  $form['factory_service'] = array(
    '#type' => 'select',
    '#title' => t('Interaction Type'),
    '#default_value' => isset($form_state['item']->factory_service) ? $form_state['item']->factory_service : '',
    '#description' => t('Select the type of interaction.'),
    '#options' => Openlayers::getOLObjectsOptions('Interaction'),
    '#required' => TRUE,
  );

  return $form;
}

/**
 * Interaction type config form submit handler.
 */
function openlayers_interaction_form_type_submit($form, &$form_state) {
  $form_state['item']->factory_service = $form_state['values']['factory_service'];
}

/**
 * Interaction options config form handler.
 */
function openlayers_interaction_form_options($form, &$form_state) {
  $interaction = openlayers_object_load('Interaction', $form_state['item']);
  $interaction->optionsForm($form, $form_state);
  $form['options']['#tree'] = TRUE;

  return $form;
}

/**
 * Interaction options config form validation handler.
 */
function openlayers_interaction_form_options_validate($form, &$form_state) {
  $interaction = openlayers_object_load('Interaction', $form_state['item']);
  $interaction->optionsFormValidate($form, $form_state);
}

/**
 * Interaction options config form submit handler.
 */
function openlayers_interaction_form_options_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }
  $interaction = openlayers_object_load('Interaction', $form_state['item']);
  $interaction->optionsFormSubmit($form, $form_state);
}
