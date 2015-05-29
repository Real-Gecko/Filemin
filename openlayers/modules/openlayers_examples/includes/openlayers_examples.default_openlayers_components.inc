<?php
/**
 * @file
 * Default components.
 */

/**
 * Implements hook_default_components().
 */
function openlayers_examples_default_openlayers_components() {
  $export = array();

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_ajax_values';
  $ol_component->name = 'openlayers_examples_component_ajax_values';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.SetValues';
  $ol_component->options = array(
    'latitude' => 'lat',
    'longitude' => 'lon',
    'rotation' => 'rot',
    'zoom' => 'zoom',
  );
  $export['openlayers_examples_component_ajax_values'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_geolocation';
  $ol_component->name = 'Geolocation example';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Geolocation';
  $ol_component->options = array(
    'checkboxID' => 'trackPosition',
    'positionAccuracyID' => 'positionAccuracy',
    'altitudeID' => 'altitude',
    'altitudeAccuracyID' => 'altitudeAccuracy',
    'headingID' => 'heading',
    'speedID' => 'speed',
  );
  $export['openlayers_examples_component_geolocation'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_graticule';
  $ol_component->name = 'Graticule example';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Graticule';
  $ol_component->options = array(
    'rgba' => '0, 0, 0, 0.2',
    'width' => '2',
    'lineDash' => '0.5, 4',
  );
  $export['openlayers_examples_component_graticule'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_zoom_to_source';
  $ol_component->name = 'Zoom To Source Examples';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.ZoomToSource';
  $ol_component->options = array(
    'source' => 'views_geojson_openlayers_examples_geojson_feed_2',
    'animations' => array(
      'pan' => '500',
      'zoom' => '500',
    ),
    'zoom' => 'auto',
    'enableAnimations' => 1,
  );
  $export['openlayers_examples_component_zoom_to_source'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_autopopup';
  $ol_component->name = 'OpenLayers Examples Autopopup';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Autopopup';
  $ol_component->options = array(
    'source' => 'views_geojson_openlayers_examples_geojson_feed_2',
    'zoom' => 'auto',
    'enableAnimations' => 1,
    'animations' => array(
      'pan' => '500',
      'zoom' => '500',
    ),
    'positioning' => 'top-right',
  );
  $export['openlayers_examples_component_autopopup'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_tooltip_earthquakes';
  $ol_component->name = 'Earthquakes tooltip';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Tooltip';
  $ol_component->options = array(
    'layer' => 'openlayers_examples_layer_vector_kml_earthquakes_heatmap',
    'positioning' => 'top-right',
  );
  $export['openlayers_examples_component_tooltip_earthquakes'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_simple_popup';
  $ol_component->name = 'Simple popup';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Popup';
  $ol_component->options = array(
    'layers' => array(
      'openlayers_examples_layer_views_geojson_popup' => 'openlayers_examples_layer_views_geojson_popup',
    ),
  );
  $export['openlayers_examples_component_simple_popup'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_earthquake_style';
  $ol_component->name = 'Earthquake style';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.InlineJS';
  $ol_component->options = array(
    'javascript' => 'var map = data.map;

var styleCache = {};
var styleFunction = function(feature, resolution) {
  // 2012_Earthquakes_Mag5.kml stores the magnitude of each earthquake in a
  // standards-violating <magnitude> tag in each Placemark.  We extract it from
  // the Placemark\'s name instead.
  var name = feature.get(\'name\');
  var magnitude = parseFloat(name.substr(2));
  var radius = 5 + 20 * (magnitude - 5);
  var style = styleCache[radius];
  if (!style) {
    style = [new ol.style.Style({
      image: new ol.style.Circle({
        radius: radius,
        fill: new ol.style.Fill({
          color: \'rgba(255, 153, 0, 0.4)\'
        }),
        stroke: new ol.style.Stroke({
          color: \'rgba(255, 204, 0, 0.2)\',
          width: 1
        })
      })
    })];
    styleCache[radius] = style;
  }
  return style;
};

map.getLayers().forEach(function(layer){
   var source = layer.getSource();
   if (source.mn == \'openlayers_examples_source_kml_earthquakes\') {
       layer.setStyle(styleFunction);
   }
});',
  );
  $export['openlayers_examples_component_earthquake_style'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_simple_popup_earthquakes';
  $ol_component->name = 'Earthquakes popup';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.Popup';
  $ol_component->options = array(
    'layers' => array(
      'openlayers_examples_layer_vector_kml_earthquakes_heatmap' => 'openlayers_examples_layer_vector_kml_earthquakes_heatmap',
    ),
    'positioning' => 'top-right',
  );
  $export['openlayers_examples_component_simple_popup_earthquakes'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_blocklayerswitcher';
  $ol_component->name = 'Block Layer Switcher';
  $ol_component->description = '';
  $ol_component->factory_service = 'openlayers.component.internal.BlockLayerSwitcher';
  $export['openlayers_examples_component_blocklayerswitcher'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_bootstrapjs_popup';
  $ol_component->name = 'Bootstrap JS popup';
  $ol_component->description = 'Bootstrap JS popup component is a component who allows you to display popup when clicking on a feature. It requires the bootstrapjs module to work.';
  $ol_component->factory_service = 'openlayers.component.internal.BootstrapjsPopup';
  $ol_component->options = array();
  $export['openlayers_examples_component_bootstrapjs_popup'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_bootstrapjs_alert';
  $ol_component->name = 'Bootstrap JS alert';
  $ol_component->description = 'Display an alert on the top of the map.';
  $ol_component->factory_service = 'openlayers.component.internal.BootstrapjsAlert';
  $ol_component->options = array(
    'message' => '<strong>Success !</strong>The map has been loaded.',
  );
  $export['openlayers_examples_component_bootstrapjs_alert'] = $ol_component;

  $ol_component = new stdClass();
  $ol_component->disabled = FALSE; /* Edit this to true to make a default ol_component disabled initially */
  $ol_component->api_version = 1;
  $ol_component->machine_name = 'openlayers_examples_component_tileutfgrid';
  $ol_component->name = 'Component TileUTFGrid';
  $ol_component->description = 'Example based on http://openlayers.org/en/v3.1.0/examples/tileutfgrid.html.';
  $ol_component->factory_service = 'openlayers.component.internal.InlineJS';
  $ol_component->options = array(
    'javascript' => 'var map = data.map;

var gridSource = data.objects.sources[\'openlayers_examples_source_mapbox_geography_class_utfgrid\'];

var element1 = jQuery(\'<div/>\', {
  id: \'country-info\',
    }).appendTo(\'body\');
var element2 = jQuery(\'<div/>\', {
  id: \'country-name\',
}).appendTo(\'#country-info\');
var element3 = jQuery(\'<img/>\', {
  id: \'country-flag\'
}).appendTo(\'#country-info\');

var infoElement = document.getElementById(\'country-info\');
var flagElement = document.getElementById(\'country-flag\');
var nameElement = document.getElementById(\'country-name\');

var infoOverlay = new ol.Overlay({
  element: infoElement,
  offset: [15, 15],
  stopEvent: false
});
map.addOverlay(infoOverlay);

var displayCountryInfo = function(coordinate) {
  var viewResolution = /** @type {number} */ (map.getView().getResolution());
  gridSource.forDataAtCoordinateAndResolution(coordinate, viewResolution,
      function(data) {
        // If you want to use the template from the TileJSON,
        //  load the mustache.js library separately and call
        //  info.innerHTML = Mustache.render(gridSource.getTemplate(), data);
        if (data) {
          /* jshint -W069 */
          flagElement.src = \'data:image/png;base64,\' + data[\'flag_png\'];
          nameElement.innerHTML = data[\'admin\'];
          /* jshint +W069 */
        }
        infoOverlay.setPosition(data ? coordinate : undefined);
      });
};

jQuery(map.getViewport()).on(\'mousemove\', function(evt) {
  var coordinate = map.getEventCoordinate(evt.originalEvent);
  displayCountryInfo(coordinate);
});

map.on(\'click\', function(evt) {
  displayCountryInfo(evt.coordinate);
});',
  );
  $export['openlayers_examples_component_tileutfgrid'] = $ol_component;

  return $export;
}
