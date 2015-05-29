<?php
/**
 * @file
 * Helper functions - some found on php.net.
 */

/**
 * @TODO describe what this does.
 *
 * @param callable $func
 *   Function to call.
 * @param array $arr
 *   The array to process.
 *
 * @return array
 *   The processed array-
 */
function array_map_recursive($func, array $arr) {
  /*
  // This is the PHP Version >= 5.5
  // $func must be a callable.
  array_walk_recursive($arr, function(&$v) use ($func) {
    $v = $func($v);
  });
  return $arr;
  */
  foreach ($arr as $key => $value) {
    if (is_array($arr[$key])) {
      $arr[$key] = array_map_recursive($func, $arr[$key]);
    }
    else {
      $arr[$key] = call_user_func($func, $arr[$key]);
    }
  }
  return $arr;
}

/**
 * Ensures a value is of type float if it is a numeric value.
 *
 * @param mixed $var
 *   The value to type cast if possible.
 *
 * @return float|mixed
 *   The variable - casted to type float if possible.
 */
function _floatval_if_numeric($var) {
  if (is_numeric($var)) {
    return floatval($var);
  }
  return $var;
}

/**
 * Recursively removes empty values from an array.
 *
 * Empty means empty($value) AND not 0.
 *
 * @TODO could we use array_walk_recursive($array, 'array_filter');?
 *
 * @param array $array
 *   The array to clean.
 *
 * @return array
 *   The cleaned array.
 */
function removeEmptyElements($array) {
  foreach ($array as $key => $value) {
    if (empty($value) && $value != 0) {
      unset($array[$key]);
    }
    elseif (is_array($value)) {
      $array[$key] = removeEmptyElements($value);
    }
  }
  return $array;
}

/**
 * Returns an array with positioning options.
 *
 * @return array
 *   Array with positioning options.
 */
function openlayers_positioning_options() {
  return array(
    'bottom-left' => t('bottom-left'),
    'bottom-center' => t('bottom-center'),
    'bottom-right' => t('bottom-right'),
    'center-left' => t('center-left'),
    'center-center' => t('center-center'),
    'center-right' => t('center-right'),
    'top-left' => t('top-left'),
    'top-center' => t('top-center'),
    'top-right' => t('top-right'),
  );
}

/**
 * Returns an array with available source options.
 *
 * @param bool $empty_option
 *   If disabled no empty option is added.
 *
 * @return array
 *   Array with source options.
 */
function openlayers_source_options($empty_option = TRUE) {
  $sources = ctools_export_crud_load_all('openlayers_sources');
  $options = array();
  if ($empty_option) {
    $options[''] = t('<Choose the source>');
  }
  foreach ($sources as $machine_name => $data) {
    $options[$machine_name] = $data->name;
  }
  return $options;
}

/**
 * Returns an array with available layer options.
 *
 * @param bool $empty_option
 *   If disabled no empty option is added.
 *
 * @return array
 *   Array with layer options.
 */
function openlayers_layer_options($empty_option = TRUE) {
  $layers = ctools_export_crud_load_all('openlayers_layers');
  $options = array();
  if ($empty_option) {
    $options[''] = t('<Choose the layer>');
  }
  foreach ($layers as $machine_name => $data) {
    $options[$machine_name] = $data->name;
  }
  return $options;
}
