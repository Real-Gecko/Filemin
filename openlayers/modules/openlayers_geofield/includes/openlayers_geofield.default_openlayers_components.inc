<?php
/**
 * @file
 * Default components.
 */

/**
 * Implements hook_default_components().
 */
function openlayers_geofield_default_openlayers_components() {
  $export = array();

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_geofield_component_geofield';
  $ol_component->name = 'OpenLayers Geofield';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Geofield';
  $ol_component->options = array(
    'dataType' => array(
      'GeoJSON' => 'GeoJSON',
      'KML' => 'KML',
      'GPX' => 'GPX',
      'WKT' => 'WKT',
    ),
    'actionFeature' => array(
      'draw' => 'draw',
      'modify' => 'modify',
    ),
    'typeOfFeature' => array(
      'Point' => 'Point',
      'LineString' => 'LineString',
      'Polygon' => 'Polygon',
    ),
    'featureLimit' => 0,
    'showInputField' => 1,
    'inputFieldName' => 'geom',
    'initialData' => '',
    'dataProjection' => 'EPSG:4326',
  );
  $export['openlayers_geofield_component_geofield'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default ol_component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_geofield_component_zoom_to_source';
  $ol_component->name = 'OpenLayers Geofield Zoom to Source';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.ZoomToSource';
  $ol_component->options = array(
    'source' => 'geofield_field_formatter_source',
    'animations' => array(
      'pan' => '500',
      'zoom' => '500',
    ),
    'zoom' => 'auto',
    'enableAnimations' => 1,
  );
  $export['openlayers_geofield_component_zoom_to_source'] = $ol_component;

  return $export;
}
