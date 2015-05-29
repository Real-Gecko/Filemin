<?php
/**
 * @file
 * Provide default sources.
 */

/**
 * Implements hook_default_sources().
 */
function openlayers_default_openlayers_sources() {
  $export = array();

  $ol_source = new stdClass();
  $ol_source->disabled = FALSE; /* Edit this to true to make a default source disabled initially */
  $ol_source->api_version = 1;
  $ol_source->machine_name = 'openlayers_source_mapquest_osm';
  $ol_source->name = 'MapQuest OpenStreetMap';
  $ol_source->description = 'Source MapQuest OpenStreetMap description';
  $ol_source->factory_service = 'openlayers.source.internal.MapQuest';
  $ol_source->options = array(
    'layer' => 'osm',
  );
  $export['openlayers_source_mapquest_osm'] = $ol_source;

  return $export;
}

