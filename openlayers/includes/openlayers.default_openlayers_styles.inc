<?php
/**
 * @file
 * Provide default styles.
 */

/**
 * Implements hook_default_styles().
 */
function openlayers_default_openlayers_styles() {
  $export = array();

  $ol_style = new stdClass();
  $ol_style->api_version = 1;
  $ol_style->machine_name = 'openlayers_style_default';
  $ol_style->name = 'OpenLayers default style';
  $ol_style->description = '';
  $ol_style->factory_service = 'openlayers.style.internal.OLStyle';
  $ol_style->options = array();
  $export['openlayers_style_default'] = $ol_style;

  return $export;
}
