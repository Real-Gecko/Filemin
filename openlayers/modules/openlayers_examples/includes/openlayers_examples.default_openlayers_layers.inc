<?php
/**
 * @file
 * Default layers.
 */

/**
 * Implements hook_default_layers().
 */
function openlayers_examples_default_openlayers_layers() {
  $export = array();

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_tile_mapbox_example1';
  $ol_layer->name = 'MapBox example 1';
  $ol_layer->description = 'Layer MapBox example 1';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_example1',
  );
  $export['openlayers_examples_layer_tile_mapbox_example1'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_tile_mapbox_example2';
  $ol_layer->name = 'MapBox example 2';
  $ol_layer->description = 'Layer MapBox example 2';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_example2',
  );
  $export['openlayers_examples_layer_tile_mapbox_example2'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_tile_mapbox_example3';
  $ol_layer->name = 'MapBox example 2';
  $ol_layer->description = 'Layer MapBox example 3';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_example3',
  );
  $export['openlayers_examples_layer_tile_mapbox_example3'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_mapbox_geography_class';
  $ol_layer->name = 'MapBox Geography Class';
  $ol_layer->description = 'Layer MapBox Geography Class description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_geography_class',
  );
  $export['openlayers_examples_layer_mapbox_geography_class'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_mapbox_geography_class_utfgrid';
  $ol_layer->name = 'MapBox Geography Class UTFGrid';
  $ol_layer->description = 'Layer MapBox Geography Class UTFGrid description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_geography_class_utfgrid',
  );
  $export['openlayers_examples_layer_mapbox_geography_class_utfgrid'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_mapbox_natural_earth_hypso_bathy';
  $ol_layer->name = 'MapBox Natural Earth Hypso Bathy';
  $ol_layer->description = 'Layer MapBox Natural Earth Hypso Bathy description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapbox_natural_earth_hypso_bathy',
  );
  $export['openlayers_examples_layer_mapbox_natural_earth_hypso_bathy'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_googlemaps';
  $ol_layer->name = 'Google Maps layer';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_googlemaps',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'url' => '',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
  );
  $export['openlayers_examples_layer_googlemaps'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openstreetmap_europa';
  $ol_layer->name = 'EC Europa Openstreetmap';
  $ol_layer->description = 'Layer Europa OpenStreetMap';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openstreetmap_europa',
  );
  $export['openlayers_examples_layer_openstreetmap_europa'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_vector_geojson_cities';
  $ol_layer->name = 'GeoJSON Cities';
  $ol_layer->description = 'GeoJSON Cities';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_geojson_file',
  );
  $export['openlayers_examples_layer_vector_geojson_cities'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_vector_geojson_cities_heatmap';
  $ol_layer->name = 'GeoJSON Cities heatmap';
  $ol_layer->description = 'GeoJSON Cities Heatmap';
  $ol_layer->factory_service = 'openlayers.layer.internal.Heatmap';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_geojson_file',
  );
  $export['openlayers_examples_layer_vector_geojson_cities_heatmap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_vector_kml_earthquakes';
  $ol_layer->name = 'Earthquakes 2012';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_kml_earthquakes',
  );
  $export['openlayers_examples_layer_vector_kml_earthquakes'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_vector_kml_earthquakes_heatmap';
  $ol_layer->name = 'Earthquakes 2012 Heatmap';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Heatmap';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_kml_earthquakes',
  );
  $export['openlayers_examples_layer_vector_kml_earthquakes_heatmap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_views_geojson';
  $ol_layer->name = 'Layer with source from Views GeoJSON';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'views_geojson_openlayers_examples_geojson_feed_1',
  );
  $export['openlayers_examples_layer_views_geojson'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_cluster_cities';
  $ol_layer->name = 'Layer cluster cities';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_cluster',
  );
  $export['openlayers_examples_layer_cluster_cities'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_views_geojson_popup';
  $ol_layer->name = 'Layer with source from Views GeoJSON for popup';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'views_geojson_openlayers_examples_geojson_feed_2',
    'style' => 'openlayers_examples_style_blue_marker',
  );
  $export['openlayers_examples_layer_views_geojson_popup'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_mapquest_sat';
  $ol_layer->name = 'MapQuest Satellite';
  $ol_layer->description = 'Layer MapQuest Satellite description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapquest_sat',
  );
  $export['openlayers_examples_layer_mapquest_sat'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_mapquest_hyb';
  $ol_layer->name = 'MapQuest Hybrid';
  $ol_layer->description = 'Layer MapQuest Hybrid description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_mapquest_hyb',
  );
  $export['openlayers_examples_layer_mapquest_hyb'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_image';
  $ol_layer->name = 'Drupal logo layer image';
  $ol_layer->description = 'Layer image description';
  $ol_layer->factory_service = 'openlayers.layer.internal.Image';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_imagestatic',
  );
  $export['openlayers_examples_layer_image'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openstreetmap_mapnik';
  $ol_layer->name = 'OpenStreetMap';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openstreetmap_mapnik',
  );
  $export['openlayers_examples_layer_openstreetmap_mapnik'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openstreetmap_bw';
  $ol_layer->name = 'OpenStreetMap black and white';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openstreetmap_bw',
  );
  $export['openlayers_examples_layer_openstreetmap_bw'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openstreetmap_de';
  $ol_layer->name = 'OpenStreetMap DE';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openstreetmap_de',
  );
  $export['openlayers_examples_layer_openstreetmap_de'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openstreetmap_hot';
  $ol_layer->name = 'OpenStreetMap Hot';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openstreetmap_hot',
  );
  $export['openlayers_examples_layer_openstreetmap_hot'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_opencyclemap';
  $ol_layer->name = 'OpenCycleMap';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_opencyclemap',
  );
  $export['openlayers_examples_layer_opencyclemap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_opencyclemap_transport';
  $ol_layer->name = 'OpenCycleMap Transport';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_opencyclemap_transport',
  );
  $export['openlayers_examples_layer_opencyclemap_transport'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_opencyclemap_thunderforest';
  $ol_layer->name = 'OpenCycleMap Thunderforest';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_opencyclemap_thunderforest',
  );
  $export['openlayers_examples_layer_opencyclemap_thunderforest'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_opencyclemap_landscape';
  $ol_layer->name = 'OpenCycleMap Landscape';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_opencyclemap_landscape',
  );
  $export['openlayers_examples_layer_opencyclemap_landscape'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_opencyclemap_outdoors';
  $ol_layer->name = 'OpenCycleMap Outdoors';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_opencyclemap_outdoors',
  );
  $export['openlayers_examples_layer_opencyclemap_outdoors'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openmapsurfer_roads';
  $ol_layer->name = 'OpenMapSurfer Roads';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openmapsurfer_roads',
  );
  $export['openlayers_examples_layer_openmapsurfer_roads'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openmapsurfer_roadsg';
  $ol_layer->name = 'OpenMapSurfer Roads grayscale';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openmapsurfer_roadsg',
  );
  $export['openlayers_examples_layer_openmapsurfer_roadsg'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openmapsurfer_adminb';
  $ol_layer->name = 'OpenMapSurfer admin borders';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openmapsurfer_adminb',
  );
  $export['openlayers_examples_layer_openmapsurfer_adminb'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_tiledebug';
  $ol_layer->name = 'Tile Debug';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_tiledebug',
  );
  $export['openlayers_examples_layer_tiledebug'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_stamen1';
  $ol_layer->name = 'Stamen terrain labels';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_stamen1',
  );
  $export['openlayers_examples_layer_stamen1'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_stamen2';
  $ol_layer->name = 'Stamen watercolor';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_stamen2',
  );
  $export['openlayers_examples_layer_stamen2'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_stamen3';
  $ol_layer->name = 'Stamen toner';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_stamen3',
  );
  $export['openlayers_examples_layer_stamen3'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_worldtopomap';
  $ol_layer->name = 'ESRI World Topo Map';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_worldtopomap',
  );
  $export['openlayers_examples_layer_esri_worldtopomap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_worldstreetmap';
  $ol_layer->name = 'ESRI World Street Map';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_worldstreetmap',
  );
  $export['openlayers_examples_layer_esri_worldstreetmap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_delorme';
  $ol_layer->name = 'ESRI Delorme';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_delorme',
  );
  $export['openlayers_examples_layer_esri_delorme'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_worldimagery';
  $ol_layer->name = 'ESRI World Imagery';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_worldimagery',
  );
  $export['openlayers_examples_layer_esri_worldimagery'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_worldterrainbase';
  $ol_layer->name = 'ESRI World Terrain Base';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_worldterrainbase',
  );
  $export['openlayers_examples_layer_esri_worldterrainbase'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_worldshadedrelief';
  $ol_layer->name = 'ESRI World Shaded Relief';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_worldshadedrelief',
  );
  $export['openlayers_examples_layer_esri_worldshadedrelief'] = $ol_layer;

  //
  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_oceanbasemap';
  $ol_layer->name = 'ESRI Ocean Base Map';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_oceanbasemap',
  );
  $export['openlayers_examples_layer_esri_oceanbasemap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_esri_natgeoworldmap';
  $ol_layer->name = 'ESRI National Geographic World Map';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_esri_natgeoworldmap',
  );
  $export['openlayers_examples_layer_esri_natgeoworldmap'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_atlas_webgl';
  $ol_layer->name = 'OpenLayers Examples Atlas WebGL Layer';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_atlas_webgl',
    'visible' => 1,
    'style' => 'openlayers_style_default',
  );
  $export['openlayers_examples_layer_atlas_webgl'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_icon_sprite';
  $ol_layer->name = 'OpenLayers Examples Layer Icon Sprite';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Vector';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_icon_sprite',
    'visible' => 1,
    'style' => 'openlayers_style_default',
  );
  $export['openlayers_examples_layer_icon_sprite'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_precipitation';
  $ol_layer->name = 'OpenWeather Precipitation Quantity';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_precipitation',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_precipitation'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_precipitation_cls';
  $ol_layer->name = 'OpenWeather Precipitation classic';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_precipitation_cls',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_precipitation_cls'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_clouds';
  $ol_layer->name = 'OpenWeather Clouds cover';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_clouds',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.5',
  );
  $export['openlayers_examples_layer_openweather_clouds'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_clouds_cls';
  $ol_layer->name = 'OpenWeather Clouds classic';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_clouds_cls',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.5',
  );
  $export['openlayers_examples_layer_openweather_clouds_cls'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_pressure';
  $ol_layer->name = 'OpenWeather Pressure';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_pressure',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_pressure'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_pressure_cntr';
  $ol_layer->name = 'OpenWeather Pressure contour';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_pressure_cntr',
    'visible' => 1,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_pressure_cntr'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_temp';
  $ol_layer->name = 'OpenWeather Temp';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_temp',
    'visible' => 0,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_temp'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_rain';
  $ol_layer->name = 'OpenWeather Rain';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_rain',
    'visible' => 0,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_rain'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_rain_cls';
  $ol_layer->name = 'OpenWeather Rain classic';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_rain_cls',
    'visible' => 0,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_rain_cls'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_snow';
  $ol_layer->name = 'OpenWeather Snow';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_snow',
    'visible' => 0,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_snow'] = $ol_layer;

  $ol_layer = new stdClass();
  $ol_layer->disabled = FALSE; /* Edit this to true to make a default ol_layer disabled initially */
  $ol_layer->api_version = 1;
  $ol_layer->machine_name = 'openlayers_examples_layer_openweather_wind';
  $ol_layer->name = 'OpenWeather Wind';
  $ol_layer->description = '';
  $ol_layer->factory_service = 'openlayers.layer.internal.Tile';
  $ol_layer->options = array(
    'source' => 'openlayers_examples_source_openweather_wind',
    'visible' => 0,
    'style' => 'openlayers_style_default',
    'zoomOffset' => '0',
    'wrapDateLine' => 0,
    'opacity' => '0.4',
  );
  $export['openlayers_examples_layer_openweather_wind'] = $ol_layer;

  return $export;
}
