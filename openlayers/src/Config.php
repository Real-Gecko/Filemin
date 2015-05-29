<?php
/**
 * @file
 * Class openlayers_config.
 */

namespace Drupal\openlayers;

/**
 * Class openlayers_config.
 */
class Config {

  static protected function defaults($key = NULL) {
    $defaults = array(
      'openlayers.js_css.group' => 'openlayers',
      'openlayers.js_css.weight' => 20,
      'openlayers.edit_view_map' => 'openlayers_map_view_edit_form',
      'openlayers.default_ui_map' => 'openlayers_map_ui_default',
      'openlayers.debug' => TRUE
    );
    if ($key == NULL) {
      return $defaults;
    }

    return isset($defaults[$key]) ? $defaults[$key] : NULL;
  }

  static public function get($parents, $default_value = NULL) {
    $options = \Drupal::service('variable')->get('openlayers_config');

    if (is_string($parents)) {
      $parents = explode('.', $parents);
    }

    if (is_array($parents)) {
      $notfound = FALSE;
      foreach ($parents as $parent) {
        if (isset($options[$parent])) {
          $options = $options[$parent];
        }
        else {
          $notfound = TRUE;
          break;
        }
      }
      if (!$notfound) {
        return $options;
      }
    }

    if ($value = Config::defaults(implode('.', $parents))) {
      return $value;
    }

    if (is_null($default_value)) {
      return FALSE;
    }

    return $default_value;
  }

  static public function set($parents, $value) {
    $config = \Drupal::service('variable')->get('openlayers_config', array());

    if (is_string($parents)) {
      $parents = explode('.', $parents);
    }

    $ref = &$config;
    foreach ($parents as $parent) {
      if (isset($ref) && !is_array($ref)) {
        $ref = array();
      }
      $ref = &$ref[$parent];
    }
    $ref = $value;

    \Drupal::service('variable')->set('openlayers_config', $config);
    return $config;
  }

  static public function clear($parents) {
    $config = \Drupal::service('variable')->get('openlayers_config', array());
    $ref = &$config;

    if (is_string($parents)) {
      $parents = explode('.', $parents);
    }

    $last = end($parents);
    reset($parents);
    foreach ($parents as $parent) {
      if (isset($ref) && !is_array($ref)) {
        $ref = array();
      }
      if ($last == $parent) {
        unset($ref[$parent]);
      }
      else {
        if (isset($ref[$parent])) {
          $ref = &$ref[$parent];
        }
        else {
          break;
        }
      }
    }
    \Drupal::service('variable')->set('openlayers_config', $config);
    return $config;
  }

}
