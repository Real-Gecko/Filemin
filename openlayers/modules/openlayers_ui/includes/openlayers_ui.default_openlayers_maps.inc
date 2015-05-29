<?php
/**
 * @file
 * Provide default maps.
 */

/**
 * Implements hook_default_maps().
 */
function openlayers_ui_default_openlayers_maps() {
  $export = array();

  $ol_map = new stdClass();
  $ol_map->disabled = FALSE;
  $ol_map->api_version = 1;
  $ol_map->machine_name = 'openlayers_map_ui_default';
  $ol_map->name = 'Default UI Map';
  $ol_map->description = 'Map used if there are no other maps defined';
  $ol_map->factory_service = 'openlayers.map.internal.OLMap';
  $ol_map->options = array(
    'width' => 'auto',
    'height' => '400px',
    'view' => array(
      'center' => array(
        'lat' => '0',
        'lon' => '0',
      ),
      'rotation' => '0',
      'zoom' => '2',
    ),
    'contextualLinks' => 0,
    'provideBlock' => 0,
    'provideIframe' => 1,
    'layers' => array(
      0 => 'openlayers_layer_tile_mapquest_osm',
    ),
    'controls' => array(
      0 => 'openlayers_control_rotate',
      1 => 'openlayers_control_zoom',
      2 => 'openlayers_control_zoomslider',
      3 => 'openlayers_control_fullscreen',
    ),
    'interactions' => array(
      0 => 'openlayers_interaction_dragpan',
      1 => 'openlayers_interaction_dragrotate',
      2 => 'openlayers_interaction_mousewheelzoom',
    ),
    'components' => array(),
  );
  $export['openlayers_map_ui_default'] = $ol_map;

  return $export;
}
