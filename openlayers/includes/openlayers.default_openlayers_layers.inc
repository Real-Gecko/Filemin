<?php
/**
 * @file
 * Provide default layers.
 */

/**
 * Implements hook_default_layers().
 */
function openlayers_default_openlayers_layers() {
  $export = array();

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_layer_tile_mapquest_osm';
  $ol_layer->name = 'MapQuest OpenStreetMap';
  $ol_layer->description = 'Layer MapQuest OpenStreetMap description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_source_mapquest_osm',
  );
  $export['openlayers_layer_tile_mapquest_osm'] = $ol_layer;

  return $export;
}
