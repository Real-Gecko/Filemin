<?php
/**
 * @file
 * Provide default maps.
 */

/**
 * Implements hook_default_maps().
 */
function openlayers_default_openlayers_maps() {
  $export = array();

  $ol_map = new stdClass();
  $ol_map->disabled = TRUE;
  $ol_map->api_version = 1;
  $ol_map->machine_name = 'openlayers_map_view_edit_form';
  $ol_map->name = 'Map view edit form';
  $ol_map->description = 'Map used in the the map edit form to get center and zoom. You can drag this map with your mouse, click to center and you can hold alt and shift key to rotate.';
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
    'layers' => array(
      0 => 'openlayers_layer_tile_mapquest_osm',
    ),
    'controls' => array(
      0 => 'openlayers_control_rotate',
      1 => 'openlayers_control_zoom',
      2 => 'openlayers_control_zoomslider',
      3 => 'openlayers_control_zoomtoextent',
    ),
    'interactions' => array(
      0 => 'openlayers_interaction_dragpan',
      1 => 'openlayers_interaction_dragrotate',
      2 => 'openlayers_interaction_mousewheelzoom',
    ),
    'components' => array(
      0 => 'openlayers_component_map_edit_form_values',
      1 => 'openlayers_component_map_edit_form_setcenter',
    ),
  );
  $export['openlayers_map_view_edit_form'] = $ol_map;

  return $export;
}
