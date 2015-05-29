<?php
/**
 * @file
 * Default layers from views.
 */

/**
 * Implements hook_default_layers_alter().
 */
function openlayers_views_default_openlayers_layers_alter(&$layers) {
  $views = openalyers_views_get_views('openlayers_map_views');
  foreach ($views as $view_settings) {
    list($view_name, $display) = $view_settings;
    $machine_name = 'layer_map_views_' . $view_name . '_' . $display;
    // Check if the configuration for this layer was already defined or if it
    // has been modified. If so don't add it, to keep the layer exportable.
    $custom_version = ctools_export_crud_load('openlayers_layers', $machine_name);
    if (!isset($layers[$machine_name]) && empty($custom_version)) {
      $ol_layer = new stdClass();
      $ol_layer->api_version = 1;
      $ol_layer->machine_name = $machine_name;
      $ol_layer->name = 'Views Map:' . $view_name . ':' . $display;
      $ol_layer->description = t('Layer for !link views map', array('!link' => l(t('this'), 'admin/structure/views/view/' . $view_name . '/edit/' . $display)));
      $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
      $ol_layer->options = array(
        'source' => 'source_map_views_' . $view_name . '_' . $display,
      );
      $layers[$ol_layer->machine_name] = $ol_layer;
    }
  }
}
