<?php
/**
 * @file
 * Default sources from views.
 */

/**
 * Implements hook_default_sources_alter().
 */
function openlayers_views_default_openlayers_sources_alter(&$sources) {
  $views = openalyers_views_get_views('openlayers_source_vector');
  foreach ($views as $view_settings) {
    list($view_name, $display) = $view_settings;
    $machine_name = 'source_views_' . $view_name . '_' . $display;
    // Check if the configuration for this source was already defined or if it
    // has been modified. If so don't add it, to keep the source exportable.
    $custom_version = ctools_export_crud_load('openlayers_sources', $machine_name);
    if (!isset($sources[$machine_name]) && empty($custom_version)) {
      if ($view = views_get_view($view_name)) {
        $view->set_display($display);

        $ol_source = new stdClass();
        $ol_source->api_version = 1;
        $ol_source->machine_name = $machine_name;
        $ol_source->name = 'Views Source: ' . $view->name . '_' . $display;
        $ol_source->description = '';
        $ol_source->factory_service = 'openlayers.source.internal.Vector';
        $ol_source->options = array(
          'url' => url($view->display_handler->get_url(), array('absolute' => TRUE)),
        );
        $sources[$ol_source->machine_name] = $ol_source;
      }
    }
  }

  $views = openalyers_views_get_views('openlayers_map_views');
  foreach ($views as $view_settings) {
    list($view_name, $display) = $view_settings;
    $machine_name = 'source_map_views_' . $view_name . '_' . $display;
    // Check if the configuration for this source was already defined or if it
    // has been modified. If so don't add it, to keep the source exportable.
    $custom_version = ctools_export_crud_load('openlayers_sources', $machine_name);
    if (!isset($sources[$machine_name]) && empty($custom_version)) {
      $ol_source = new stdClass();
      $ol_source->api_version = 1;
      $ol_source->machine_name = $machine_name;
      $ol_source->name = 'Views Map: ' . $view_name . ':' . $display;
      $ol_source->description = t('Source for !link views map', array('!link' => l(t('this'), 'admin/structure/views/view/' . $view_name . '/edit/' . $display)));
      $ol_source->factory_service = 'openlayers.source.internal.Vector';
      $ol_source->options = array();
      $sources[$ol_source->machine_name] = $ol_source;
    }
  }
}
