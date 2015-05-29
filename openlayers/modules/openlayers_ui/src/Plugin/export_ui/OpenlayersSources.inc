<?php
/**
 * @file
 * CTools Export UI plugin definition for sources.
 */

/**
 * CTools Export UI plugin definition.
 */
function openlayers_ui_OpenlayersSources_ctools_export_ui() {
  return array(
    'schema' => 'openlayers_sources',
    'access' => 'administer openlayers',
    'menu' => array(
      'menu prefix' => 'admin/structure/openlayers',
      'menu item' => 'sources',
      'menu title' => 'Sources',
      'menu description' => 'Administer OpenLayers sources.',
    ),

    'handler' => array(
      'class' => '\\Drupal\\openlayers\\UI\\OpenlayersSources',
      'file' => 'OpenlayersSources.php',
    ),

    'export' => array(
      'admin_title' => 'name',
      'admin_description' => 'description',
    ),

    'use wizard' => TRUE,
    'form info' => array(
      'order' => array(
        'start' => t('Administrative settings'),
        'type' => t('Source type'),
        'options' => t('Source type options'),
      ),
      'forms' => array(
        'start' => array(
          'form id' => 'openlayers_source_form_start',
        ),
        'type' => array(
          'form id' => 'openlayers_source_form_type',
        ),
        'options' => array(
          'form id' => 'openlayers_source_form_options',
        ),
      ),
      'wrapper' => 'openlayers_objects_ui_form_wrapper',
    ),

    'title singular' => t('source'),
    'title plural' => t('sources'),
    'title singular proper' => t('OpenLayers source preset'),
    'title plural proper' => t('OpenLayers sources presets'),

    'strings' => array(
      'confirmation' => array(
        'add' => array(
          'success' => t('Source saved.'),
        ),
        'delete' => array(
          'success' => t('Source was deleted.'),
        ),
      ),
    ),
  );
}

/**
 * Source base config form handler.
 */
function openlayers_source_form_start($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersSources();
  $class->init($form_state['plugin']);
  $class->edit_form($form, $form_state);

  $layers = ctools_export_crud_load_all('openlayers_layers');
  $options = array('' => 'Dont attach');
  foreach ($layers as $machine_name => $data) {
    $layer = openlayers_object_load('Layer', $machine_name);
    if (property_exists($layer, 'disabled') && ($layer->disabled == 1 || $layer->disabled == TRUE)) {
      continue;
    }
    $options[$machine_name] = $data->name;
  }

  $form['attachToLayer'] = array(
    '#type' => 'select',
    '#title' => 'Add this to a layer ?',
    '#description' => 'Select the layer to add this object to.',
    '#options' => $options,
  );

  return $form;
}

/**
 * Source base config form validation handler.
 */
function openlayers_source_form_start_validate($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersSources();
  $class->init($form_state['plugin']);
  $class->edit_form_validate($form, $form_state);
}

/**
 * Source base config form submit handler.
 */
function openlayers_source_form_start_submit($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersSources();
  $class->init($form_state['plugin']);
  $class->edit_form_submit($form, $form_state);

  if ($form_state['values']['attachToLayer']) {
    $layer = ctools_export_crud_load('openlayers_layers', $form_state['values']['attachToLayer']);
    $layer->options['source'] = $form_state['item']->machine_name;
    ctools_export_crud_save('openlayers_layers', $layer);
  }
}

/**
 * Source type config form handler.
 */
function openlayers_source_form_type($form, &$form_state) {
  $form['factory_service'] = array(
    '#type' => 'select',
    '#title' => t('Source Type'),
    '#default_value' => isset($form_state['item']->factory_service) ? $form_state['item']->factory_service : '',
    '#description' => t('Select the type of source.'),
    '#options' => Openlayers::getOLObjectsOptions('Source'),
    '#required' => TRUE,
  );

  $form['options'] = array(
    '#tree' => TRUE,
  );

  $form['options']['attributions'] = array(
    '#type' => 'textfield',
    '#title' => t('Attributions'),
    '#default_value' => isset($form_state['item']->options['attributions']) ? $form_state['item']->options['attributions'] : '',
    '#description' => t('Attributions HTML text. Empty to disable.'),
  );

  return $form;
}

/**
 * Source type config form submit handler.
 */
function openlayers_source_form_type_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }

  if (empty($form_state['values']['options']['attributions'])) {
    unset($form_state['item']->options['attributions']);
  }

  $form_state['item']->factory_service = $form_state['values']['factory_service'];
}

/**
 * Source options config form handler.
 */
function openlayers_source_form_options($form, &$form_state) {
  $source = openlayers_object_load('Source', $form_state['item']);
  $source->optionsForm($form, $form_state);
  $form['options']['#tree'] = TRUE;

  return $form;
}

/**
 * Source options config form validation handler.
 */
function openlayers_source_form_options_validate($form, &$form_state) {
  $source = openlayers_object_load('Source', $form_state['item']);
  $source->optionsFormValidate($form, $form_state);
}

/**
 * Source options config form submit handler.
 */
function openlayers_source_form_options_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }
  $source = openlayers_object_load('Source', $form_state['item']);
  $source->optionsFormSubmit($form, $form_state);
}
