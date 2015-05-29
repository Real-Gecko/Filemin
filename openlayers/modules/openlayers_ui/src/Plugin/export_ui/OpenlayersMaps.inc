<?php
/**
 * @file
 * CTools Export UI plugin definition for maps.
 */

/**
 * CTools Export UI plugin definition.
 */
function openlayers_ui_OpenlayersMaps_ctools_export_ui() {
  return array(
    'schema' => 'openlayers_maps',
    'access' => 'administer openlayers',
    'menu' => array(
      'menu prefix' => 'admin/structure/openlayers',
      'menu item' => 'maps',
      'menu title' => 'Maps',
      'menu description' => 'Administer OpenLayers maps presets.',
    ),

    'handler' => array(
      'class' => '\\Drupal\\openlayers\\UI\\OpenlayersMaps',
      'file' => 'OpenlayersMaps.php',
    ),

    'use wizard' => TRUE,
    'form info' => array(
      'order' => array(
        'start' => t('Administrative settings'),
        'settings' => t('Map settings'),
        'layers' => t('Layers and sources'),
        'controls' => t('Controls'),
        'interactions' => t('Interactions'),
        'components' => t('Components'),
        'styles' => t('Styles'),
        'preview' => t('Preview'),
      ),
      'forms' => array(
        'start' => array(
          'form id' => 'openlayers_map_form_start',
        ),
        'settings' => array(
          'form id' => 'openlayers_map_form_settings',
        ),
        'layers' => array(
          'form id' => 'openlayers_map_form_layers',
        ),
        'controls' => array(
          'form id' => 'openlayers_map_form_controls',
        ),
        'interactions' => array(
          'form id' => 'openlayers_map_form_interactions',
        ),
        'components' => array(
          'form id' => 'openlayers_map_form_components',
        ),
        'styles' => array(
          'form id' => 'openlayers_map_form_styles',
        ),
        'preview' => array(
          'form id' => 'openlayers_map_form_preview',
        ),
      ),
      'wrapper' => 'openlayers_objects_ui_form_wrapper',
    ),

    'export' => array(
      'admin_title' => 'name',
      'admin_description' => 'description',
    ),

    'title singular' => t('map'),
    'title plural' => t('maps'),
    'title singular proper' => t('OpenLayers map preset'),
    'title plural proper' => t('OpenLayers maps presets'),

    'strings' => array(
      'confirmation' => array(
        'add' => array(
          'success' => t('Map saved.'),
        ),
        'delete' => array(
          'success' => t('Map was deleted.'),
        ),
      ),
    ),
  );
}

/**
 * Map base config form handler.
 */
function openlayers_map_form_start($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersMaps();
  $class->init($form_state['plugin']);
  $class->edit_form($form, $form_state);
  return $form;
}

/**
 * Map base config form validation handler.
 */
function openlayers_map_form_start_validate($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersMaps();
  $class->init($form_state['plugin']);
  $class->edit_form_validate($form, $form_state);
}

/**
 * Map base config form submit handler.
 */
function openlayers_map_form_start_submit($form, &$form_state) {
  $class = new Drupal\openlayers\UI\OpenlayersMaps();
  $class->init($form_state['plugin']);
  $class->edit_form_submit($form, $form_state);
}

/**
 * Map settings config form handler.
 */
function openlayers_map_form_settings($form, &$form_state) {
  if (!isset($form_state['item']->factory_service)) {
    $form_state['item']->factory_service = 'openlayers.map.internal.OLMap';
  }
  $map = openlayers_object_load('Map', $form_state['item']);
  $map->optionsForm($form, $form_state);
  $form['options']['#tree'] = TRUE;

  return $form;
}

/**
 * Map settings config form validation handler.
 */
function openlayers_map_form_settings_validate($form, &$form_state) {
  $item = $form_state['item'];
  if (empty($item->factory_service)) {
    $item->factory_service = 'openlayers.map.internal.OLMap';
  }
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }

  $map = openlayers_object_load('Map', $item);
  $map->optionsFormValidate($form, $form_state);
}

/**
 * Map settings config form submit handler.
 */
function openlayers_map_form_settings_submit($form, &$form_state) {
  // todo: fix.
  if (empty($form_state['item']->factory_service)) {
    $form_state['item']->factory_service = 'openlayers.map.internal.OLMap';
  }
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }

  $map = openlayers_object_load('Map', $form_state['item']);
  $map->optionsFormSubmit($form, $form_state);
}

/**
 * Map layers config form handler.
 */
function openlayers_map_form_layers($form, &$form_state) {
  $all_layers = ctools_export_crud_load_all('openlayers_layers');
  $map = openlayers_object_load('Map', $form_state['item']);

  $layers = array();
  foreach ($map->getLayers() as $layer) {
    if (isset($all_layers[$layer->machine_name])) {
      $layers[$layer->machine_name] = $all_layers[$layer->machine_name];
      $layers[$layer->machine_name]->enable = 1;
      unset($all_layers[$layer->machine_name]);
    }
  }

  $layers = array_merge($layers, $all_layers);

  $data = array();

  $i = 0;
  foreach ($layers as $machine_name => $layer) {
    $data[$machine_name] = array(
      'name' => $layer->name,
      'machine_name' => $layer->machine_name,
      'description' => $layer->description,
      'factory_service' => $layer->factory_service,
      'weight' => $i++,
      'enable' => isset($layer->enable) ? $layer->enable : 0,
      'default' => 1,
    );
  }

  $rows = array();
  $row_elements = array();
  foreach ($data as $id => $entry) {
    $rows[$id] = array(
      'data' => array(
        array('class', array('entry-cross')),
        array(
          'data' => array(
            '#type' => 'weight',
            '#title' => t('Weight'),
            '#title_display' => 'invisible',
            '#default_value' => $entry['weight'],
            '#parents' => array('layers', $id, 'weight'),
            '#attributes' => array(
              'class' => array('entry-order-weight'),
            ),
          )),
        array(
          'data' => array(
            '#type' => 'checkbox',
            '#title' => t('Enable'),
            '#title_display' => 'invisible',
            '#default_value' => $entry['enable'],
            '#parents' => array('layers', $id, 'enable'),
          )),
        check_plain($entry['name']),
        check_plain($entry['machine_name']),
        check_plain($entry['description']),
        check_plain($entry['factory_service']),
        l(t('Edit'), 'admin/structure/openlayers/layers/list/' . $entry['machine_name'] . '/edit/options',
          array(
            'query' => array(
              'destination' => current_path(),
            ),
          )
        ),
      ),
      'class' => array('draggable'),
    );
    // Build rows of the form elements in the table.
    $row_elements[$id] = array(
      'weight' => &$rows[$id]['data'][1]['data'],
      'enabled' => &$rows[$id]['data'][2]['data'],
    );
  }

  $form['layers'] = array(
    '#type' => 'fieldset',
    '#title' => 'Layers',
    '#collapsible' => FALSE,
    '#collapsed' => FALSE,
  );

  // Add the table to the form.
  $form['layers']['table_layers'] = array(
    '#theme' => 'table',
    // The row form elements need to be processed and build,
    // therefore pass them as element children.
    'elements' => $row_elements,
    '#header' => array(
      // We need two empty columns for the weigth field and the cross.
      array('data' => NULL, 'colspan' => 2),
      t('Enabled'),
      t('Name'),
      t('Machine name'),
      t('Description'),
      t('Factory service'),
      t('Operations'),
    ),
    '#rows' => $rows,
    '#empty' => t('There are no entries available.'),
    '#attributes' => array('id' => 'entry-order-layers'),
  );
  drupal_add_tabledrag('entry-order-layers', 'order', 'sibling', 'entry-order-weight');

  $all_sources = ctools_export_crud_load_all('openlayers_sources');
  $map = openlayers_object_load('Map', $form_state['item']);

  $sources = array();
  foreach ($map->getSources() as $index => $source) {
    if (isset($all_sources[$source->machine_name])) {
      $sources[$source->machine_name] = $all_sources[$source->machine_name];
      $sources[$source->machine_name]->enable = 1;
      unset($all_sources[$source->machine_name]);
    }
  }

  $sources = array_merge($sources, $all_sources);

  $data = array();

  $i = 0;
  foreach ($sources as $machine_name => $source) {
    $data[$machine_name] = array(
      'name' => $source->name,
      'machine_name' => $source->machine_name,
      'description' => $source->description,
      'factory_service' => $source->factory_service,
      'weight' => $i++,
      'enable' => isset($source->enable) ? $source->enable : 0,
      'default' => 1,
    );
  }

  $rows = array();
  foreach ($data as $id => $entry) {
    $rows[$id] = array(
      'data' => array(
        array('class', array('entry-cross')),
        array(
          'data' => array(
            '#type' => 'weight',
            '#title' => t('Weight'),
            '#title_display' => 'invisible',
            '#default_value' => $entry['weight'],
            '#parents' => array('sources', $id, 'weight'),
            '#attributes' => array(
              'class' => array('entry-order-weight'),
            ),
          )),
        array(
          'data' => array(
            '#type' => 'checkbox',
            '#title' => t('Enable'),
            '#title_display' => 'invisible',
            '#default_value' => $entry['enable'],
            '#parents' => array('sources', $id, 'enable'),
          )),
        check_plain($entry['name']),
        check_plain($entry['machine_name']),
        check_plain($entry['description']),
        check_plain($entry['factory_service']),
        l(t('Edit'), 'admin/structure/openlayers/sources/list/' . $entry['machine_name'] . '/edit/options',
          array(
            'query' => array(
              'destination' => current_path(),
            ),
          )
        ),
      ),
      'class' => array('draggable'),
    );
    // Build rows of the form elements in the table.
    $row_elements[$id] = array(
      'weight' => &$rows[$id]['data'][1]['data'],
      'enabled' => &$rows[$id]['data'][2]['data'],
    );
  }

  $form['sources'] = array(
    '#type' => 'fieldset',
    '#title' => 'Sources',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  );

  // Add the table to the form.
  $form['sources']['table_sources'] = array(
    '#theme' => 'table',
    // The row form elements need to be processed and build,
    // therefore pass them as element children.
    'elements' => $row_elements,
    '#header' => array(
      // We need two empty columns for the weigth field and the cross.
      array('data' => NULL, 'colspan' => 2),
      t('Enabled'),
      t('Name'),
      t('Machine name'),
      t('Description'),
      t('Class'),
      t('Operations'),
    ),
    '#rows' => $rows,
    '#empty' => t('There are no entries available.'),
    '#attributes' => array('id' => 'entry-order-sources'),
  );
  drupal_add_tabledrag('entry-order-sources', 'order', 'sibling', 'entry-order-weight');

  return $form;
}

/**
 * Map layers config form submit handler.
 */
function openlayers_map_form_layers_submit($form, &$form_state) {
  $layers = $form_state['values']['layers'];

  $layers_enabled = array();
  foreach ($layers as $id => $data) {
    if ($data['enable'] == 1) {
      $layers_enabled[$data['weight']] = $id;
    }
  }

  ksort($layers_enabled);

  $sources = $form_state['values']['sources'];

  $sources_enabled = array();
  foreach ($sources as $id => $data) {
    if ($data['enable'] == 1) {
      $sources_enabled[$data['weight']] = $id;
    }
  }

  ksort($sources_enabled);

  $form_state['item']->options['layers'] = array_values($layers_enabled);
  $form_state['item']->options['sources'] = array_values($sources_enabled);
}

/**
 * Map controls config form handler.
 */
function openlayers_map_form_controls($form, &$form_state) {
  $all_controls = ctools_export_crud_load_all('openlayers_controls');

  $header = array(
    'name' => t('Name'),
    'machine_name' => t('Machine name'),
    'description' => t('Description'),
    'operations' => t('Operations'),
  );

  ctools_include('modal');
  ctools_modal_add_js();

  $plugin_name = 'openlayers_controls';
  $plugin = ctools_get_export_ui($plugin_name);

  $rows = array();
  foreach ($all_controls as $machine_name => $control) {
    $rows[$machine_name] = array(
      'name' => $control->name,
      'machine_name' => $control->machine_name,
      'description' => $control->description,
      'operations' => l(
        t('Edit'),
        'admin/structure/openlayers/controls/list/' . $machine_name . '/edit',
        array(
          'query' => array(
            'destination' => current_path(),
          ),
          'attributes' => array(
            // Todo: Use CTools modal window ajax for this form.
            'class' => 'ctools-use-modall',
          ),
        )
      ),
    );
  }

  $form['options']['#tree'] = TRUE;

  if (!isset($form_state['item']->options['controls'])) {
    $form_state['item']->options['controls'] = array();
  }

  $form['options']['controls'] = array(
    '#type' => 'tableselect',
    '#header' => $header,
    '#options' => $rows,
    '#default_value' => drupal_map_assoc($form_state['item']->options['controls']),
  );

  return $form;
}

/**
 * Map controls config form submit handler.
 */
function openlayers_map_form_controls_submit($form, &$form_state) {
  $form_state['item']->options['controls'] = array_filter(array_values($form_state['values']['options']['controls']));
}

/**
 * Map interactions config form handler.
 */
function openlayers_map_form_interactions($form, &$form_state) {
  $all_interactions = ctools_export_crud_load_all('openlayers_interactions');

  $header = array(
    'name' => t('Name'),
    'machine_name' => t('Machine name'),
    'description' => t('Description'),
    'operations' => t('Operations'),
  );

  $rows = array();
  foreach ($all_interactions as $machine_name => $interaction) {
    $rows[$machine_name] = array(
      'name' => $interaction->name,
      'machine_name' => $interaction->machine_name,
      'description' => $interaction->description,
      'operations' => l(
        t('Edit'),
        'admin/structure/openlayers/interactions/list/' . $machine_name . '/edit/options',
        array(
          'query' => array(
            'destination' => current_path(),
          ),
          'attributes' => array(
            // Todo: Use CTools modal window ajax for this form.
            'class' => 'ctools-use-modall',
          ),
        )
      ),
    );
  }

  $form['options']['#tree'] = TRUE;

  if (!isset($form_state['item']->options['interactions'])) {
    $form_state['item']->options['interactions'] = array();
  }

  $form['options']['interactions'] = array(
    '#type' => 'tableselect',
    '#header' => $header,
    '#options' => $rows,
    '#default_value' => drupal_map_assoc($form_state['item']->options['interactions']),
  );

  return $form;
}

/**
 * Map interactions config form submit handler.
 */
function openlayers_map_form_interactions_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }
  $form_state['item']->options['interactions'] = array_filter(array_values($form_state['values']['options']['interactions']));
}

/**
 * Map components config form handler.
 */
function openlayers_map_form_components($form, &$form_state) {
  $all_components = ctools_export_crud_load_all('openlayers_components');

  $header = array(
    'name' => t('Name'),
    'machine_name' => t('Machine name'),
    'description' => t('Description'),
    'operations' => t('Operations'),
  );

  $rows = array();
  foreach ($all_components as $machine_name => $component) {
    $rows[$machine_name] = array(
      'name' => $component->name,
      'machine_name' => $component->machine_name,
      'description' => $component->description,
      'operations' => l(
        t('Edit'),
        'admin/structure/openlayers/components/list/' . $machine_name . '/edit/options',
        array(
          'query' => array(
            'destination' => current_path(),
          ),
          'attributes' => array(
            // Todo: Use CTools modal window ajax for this form.
            'class' => 'ctools-use-modall',
          ),
        )
      ),
    );
  }

  $form['options']['#tree'] = TRUE;

  if (!isset($form_state['item']->options['components'])) {
    $form_state['item']->options['components'] = array();
  }

  $form['options']['components'] = array(
    '#type' => 'tableselect',
    '#header' => $header,
    '#options' => $rows,
    '#default_value' => drupal_map_assoc($form_state['item']->options['components']),
  );

  return $form;
}

/**
 * Map components config form submit handler.
 */
function openlayers_map_form_components_submit($form, &$form_state) {
  if (isset($form_state['values']['options'])) {
    $form_state['item']->options = array_merge((array) $form_state['item']->options, (array) $form_state['values']['options']);
  }
  $form_state['item']->options['components'] = array_filter(array_values($form_state['values']['options']['components']));
}

/**
 * Map styles config form handler.
 */
function openlayers_map_form_styles($form, &$form_state) {
  return $form;
}

/**
 * Map styles config form submit handler.
 */
function openlayers_map_form_styles_submit($form, &$form_state) {
  // $form_state['item']->options = $form_state['item']->options, (array) $form_state['values']['options']);
}

/**
 * Map preview form handler.
 */
function openlayers_map_form_preview($form, &$form_state) {
  $map = openlayers_object_load('Map', $form_state['item']);
  $form['preview'] = $map->build();

  return $form;
}

/**
 * Map preview config form submit handler.
 */
function openlayers_map_form_preview_submit($form, &$form_state) {

}

/**
 * Helper function to sort an array by item weight.
 */
function _openlayers_maps_sort_by_weight($a, $b) {
  if (isset($a['weight']) && isset($b['weight'])) {
    return $a['weight'] < $b['weight'] ? -1 : 1;
  }
  return 0;
}
