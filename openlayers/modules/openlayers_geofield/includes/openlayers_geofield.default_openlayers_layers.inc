<?php
/**
 * @file
 * Default layers.
 */

/**
 * Implements hook_default_layers().
 */
function openlayers_geofield_default_openlayers_layers() {
  $export = array();


  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_geofield_layer_openstreetmap';
  $ol_layer->name = 'Geofield OpenStreetMap';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_geofield_source_openstreetmap',
  );
  $export['openlayers_geofield_layer_openstreetmap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'geofield_field_formatter_layer';
  $ol_layer->name = 'Geofield Field Formatter Layer';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'geofield_field_formatter_source',
  );
  $export['geofield_field_formatter_layer'] = $ol_layer;

  return $export;
}
