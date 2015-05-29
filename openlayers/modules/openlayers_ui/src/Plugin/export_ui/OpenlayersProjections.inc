<?php
/**
 * @file
 * CTools Export UI plugin definition for projections.
 */

/**
 * CTools Export UI plugin definition.
 */
function openlayers_ui_OpenlayersProjections_ctools_export_ui() {
  return array(
    'schema' => 'openlayers_projections',
    'access' => 'administer projections',
    'menu' => array(
      'menu prefix' => 'admin/structure/openlayers',
      'menu item' => 'projections',
      'menu title' => 'Projections',
      'menu description' => 'Administer OpenLayers projections.',
    ),

    'handler' => array(
      'class' => '\\Drupal\\openlayers\\UI\\OpenlayersProjections',
      'file' => 'OpenlayersProjections.php',
    ),

    'export' => array(
      'admin_title' => 'name',
      'admin_description' => 'description',
    ),

    'use wizard' => TRUE,
    'form info' => array(
      'order' => array(
        'start' => t('Administrative settings'),
      ),
      'forms' => array(
        'start' => array(
          'form id' => 'openlayers_projection_form_start',
        ),
      ),
      'wrapper' => 'openlayers_objects_ui_form_wrapper',
    ),

    'title singular' => t('projection'),
    'title plural' => t('projections'),
    'title singular proper' => t('OpenLayers projection preset'),
    'title plural proper' => t('OpenLayers projection presets'),

    'strings' => array(
      'confirmation' => array(
        'add' => array(
          'success' => t('Projection saved.'),
        ),
        'delete' => array(
          'success' => t('Projection was deleted.'),
        ),
      ),
    ),
  );
}

/**
 * Projection base config form handler.
 */
function openlayers_projection_form_start($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersProjections();
  $class->init($form_state['plugin']);
  $class->edit_form($form, $form_state);

  $form['definition'] = array(
    '#type' => 'textarea',
    '#title' => t('Projection definition'),
    '#rows' => '10',
    '#default_value' => isset($form_state['item']->definition) ? $form_state['item']->definition : '',
  );

  return $form;
}

/**
 * Projection base config form validation handler.
 */
function openlayers_projection_form_start_validate($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersProjections();
  $class->init($form_state['plugin']);
  $class->edit_form_validate($form, $form_state);
}

/**
 * Projection base config form submit handler.
 */
function openlayers_projection_form_start_submit($form, &$form_state) {
  $class = new \Drupal\openlayers\UI\OpenlayersProjections();
  $class->init($form_state['plugin']);
  $class->edit_form_submit($form, $form_state);
}
