<?php
/**
 * @file
 * Default maps.
 */

/**
 * Implements hook_default_maps().
 */
function openlayers_geofield_default_openlayers_maps() {
  $export = array();

  $ol_map = new stdClass();
  $ol_map->disabled = FALSE; /* Edit this to true to make a default map disabled initially */
  $ol_map->api_version = 1;
  $ol_map->machine_name = 'openlayers_geofield_map_geofield';
  $ol_map->name = 'Geofield Map';
  $ol_map->description = '';
  $ol_map->factory_service = 'openlayers.map.internal.OLMap';
  $ol_map->options = array(
    'width' => 'auto',
    'height' => '300px',
    'contextualLinks' => 1,
    'provideBlock' => 1,
    'provideIframe' => 1,
    'view' => array(
      'center' => array(
        'lat' => '0',
        'lon' => '0',
      ),
      'rotation' => '0',
      'zoom' => '2',
    ),
    'layers' => array(
      0 => 'openlayers_geofield_layer_openstreetmap',
      1 => 'geofield_field_formatter_layer',
    ),
    'controls' => array(),
    'interactions' => array(
      0 => 'openlayers_interaction_doubleclickzoom',
      1 => 'openlayers_interaction_dragpan',
      2 => 'openlayers_interaction_mousewheelzoom',
    ),
    'components' => array(
      0 => 'openlayers_geofield_component_geofield',
    ),
    'sources' => array(
      0 => 'openlayers_geofield_source_openstreetmap',
      1 => 'geofield_field_formatter_source',
    ),
  );
  $export['openlayers_geofield_map_geofield'] = $ol_map;

  $ol_map = new stdClass();
  $ol_map->disabled = FALSE; /* Edit this to true to make a default ol_map disabled initially */
  $ol_map->api_version = 1;
  $ol_map->machine_name = 'openlayers_geofield_map_geofield_formatter';
  $ol_map->name = 'Geofield Map: Field Formatter';
  $ol_map->description = '';
  $ol_map->factory_service = 'openlayers.map.internal.OLMap';
  $ol_map->options = array(
    'width' => 'auto',
    'height' => '300px',
    'contextualLinks' => 1,
    'provideBlock' => 1,
    'provideIframe' => 1,
    'view' => array(
      'center' => array(
        'lat' => '0',
        'lon' => '0',
      ),
      'rotation' => '0',
      'zoom' => '2',
    ),
    'layers' => array(
      0 => 'openlayers_geofield_layer_openstreetmap',
      1 => 'geofield_field_formatter_layer',
    ),
    'controls' => array(),
    'interactions' => array(
      0 => 'openlayers_interaction_doubleclickzoom',
      1 => 'openlayers_interaction_dragpan',
      2 => 'openlayers_interaction_mousewheelzoom',
    ),
    'components' => array(
      0 => 'openlayers_geofield_component_zoom_to_source',
    ),
    'sources' => array(
      0 => 'openlayers_geofield_source_openstreetmap',
      1 => 'geofield_field_formatter_source',
    ),
  );
  $export['openlayers_geofield_map_geofield_formatter'] = $ol_map;

  return $export;
}
