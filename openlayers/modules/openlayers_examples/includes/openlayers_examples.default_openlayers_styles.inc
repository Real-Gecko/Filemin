<?php
/**
 * @file
 * Default styles.
 */

/**
 * Implements hook_default_styles().
 */
function openlayers_examples_default_openlayers_styles() {
  $export = array();

  $ol_style = new stdClass();
  $ol_style->disabled = FALSE; /* Edit this to true to make a default style disabled initially */
  $ol_style->api_version = 1;
  $ol_style->machine_name = 'openlayers_examples_style_blue_marker';
  $ol_style->name = 'OpenLayers blue marker';
  $ol_style->description = '';
  $ol_style->factory_service = 'openlayers.style.internal.InlineJS';
  $ol_style->options = array(
    'javascript' => 'var style = new ol.style.Style({
                        image: new ol.style.Icon(({
                            scale: 1,
                            anchor: [0.5, 1],
                            anchorXUnits: \'fraction\',
                            anchorYUnits: \'fraction\',
                            src: \'/sites/all/modules/openlayers/modules/openlayers_examples/assets/marker-icon.png\'
                        }))
                    });',
  );
  $export['openlayers_examples_style_blue_marker'] = $ol_style;

  $ol_style = new stdClass();
  $ol_style->disabled = FALSE; /* Edit this to true to make a default style disabled initially */
  $ol_style->api_version = 1;
  $ol_style->machine_name = 'openlayers_examples_style_green';
  $ol_style->name = 'OpenLayers green style';
  $ol_style->description = '';
  $ol_style->factory_service = 'openlayers.style.internal.InlineJS';
  $ol_style->options = array(
    'javascript' => 'var fill = new ol.style.Fill({
   color: \'rgba(0, 255, 0, 0.7)\'
 });
 var stroke = new ol.style.Stroke({
   color: \'#FFFFFF\',
   width: 1
 });
 var style = [
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 2
     }),
     fill: fill,
     stroke: stroke
   })
 ];',
  );
  $export['openlayers_examples_style_green'] = $ol_style;

  $ol_style = new stdClass();
  $ol_style->disabled = FALSE; /* Edit this to true to make a default style disabled initially */
  $ol_style->api_version = 1;
  $ol_style->machine_name = 'openlayers_examples_style_red';
  $ol_style->name = 'OpenLayers red style';
  $ol_style->description = '';
  $ol_style->factory_service = 'openlayers.style.internal.InlineJS';
  $ol_style->options = array(
    'javascript' => 'var fill = new ol.style.Fill({
   color: \'rgba(255, 0, 0, 0.7)\'
 });
 var stroke = new ol.style.Stroke({
   color: \'#FFFFFF\',
   width: 1
 });
 var style = [
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 2
     }),
     fill: fill,
     stroke: stroke
   })
 ];',
  );
  $export['openlayers_examples_style_red'] = $ol_style;

  $ol_style = new stdClass();
  $ol_style->disabled = FALSE; /* Edit this to true to make a default style disabled initially */
  $ol_style->api_version = 1;
  $ol_style->machine_name = 'openlayers_examples_style_blue';
  $ol_style->name = 'OpenLayers blue style';
  $ol_style->description = '';
  $ol_style->factory_service = 'openlayers.style.internal.InlineJS';
  $ol_style->options = array(
    'javascript' => 'var fill = new ol.style.Fill({
   color: \'rgba(0, 0, 255, 0.7)\'
 });
 var stroke = new ol.style.Stroke({
   color: \'#FFFFFF\',
   width: 1
 });
 var style = [
   new ol.style.Style({
     image: new ol.style.Circle({
       fill: fill,
       stroke: stroke,
       radius: 2
     }),
     fill: fill,
     stroke: stroke
   })
 ];',
  );
  $export['openlayers_examples_style_blue'] = $ol_style;

  return $export;
}
