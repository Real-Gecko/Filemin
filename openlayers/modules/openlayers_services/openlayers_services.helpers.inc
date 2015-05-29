<?php
/**
 * @file
 * Helper functions
 */

function _openlayers_services_retrieve($name) {
  $map = openlayers_object_load('Map', check_plain($name));
  $build = $map->build();
  $render = drupal_render($build);
  $js = drupal_get_js();
  $styles = drupal_get_css();

  return theme('openlayers_map_iframe', array(
    'page' => $render,
    'scripts' => $js,
    'styles' => $styles,
  ));
}

function _openlayers_services_access($operation, $map) {
  $map = openlayers_object_load('Map', check_plain($map[0]));
  return (bool) $map->getOption('provideIframe', FALSE);
}
