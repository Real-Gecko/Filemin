<?php
/**
 * @file
 * Default maps from views.
 */

/**
 * Implements hook_default_maps_alter().
 */
function openlayers_views_default_openlayers_maps_alter(&$maps) {
  $views = openalyers_views_get_views('openlayers_map_views');
  foreach ($views as $view_settings) {
    list($view_name, $display) = $view_settings;
    $machine_name = 'map_views_' . $view_name . '_' . $display;
    // Check if the configuration for this map was already defined or if it has
    // been modified. If so don't add it, to keep the map exportable.
    $custom_version = ctools_export_crud_load('openlayers_maps', $machine_name);
    if (!isset($maps[$machine_name]) && empty($custom_version)) {
      $ol_map = new stdClass();
      $ol_map->api_version = 1;
      $ol_map->machine_name = $machine_name;
      $ol_map->name = 'Views Map: ' . $view_name . ':' . $display;
      $ol_map->description = t('Map from !link views map', array('!link' => l(t('this'), 'admin/structure/views/view/' . $view_name . '/edit/' . $display)));
      $ol_map->factory_service = 'openlayers.map.internal.Views';
      $ol_map->options = array(
        'views_display' => $view_name . ':' . $display,
        'view' => array(
          'center' => array(
            'lat' => '',
            'lon' => '',
          ),
          'rotation' => '0',
          'zoom' => '2',
          'minZoom' => '',
          'maxZoom' => '',
        ),
        'sources' => array(
          'source_map_views_' . $view_name . '_' . $display,
        ),
        'layers' => array(
          'layer_map_views_' . $view_name . '_' . $display,
        ),
      );
      $maps[$ol_map->machine_name] = $ol_map;
    }
  }
}
