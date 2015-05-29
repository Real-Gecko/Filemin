<?php
/**
 * @file
 * Provide default endpoint.
 */

/**
 * Implements hook_default_services_endpoint().
 */
function openlayers_services_default_services_endpoint() {
  $export = array();

  $endpoint = new stdClass();
  $endpoint->disabled = FALSE; /* Edit this to true to make a default endpoint disabled initially */
  $endpoint->api_version = 3;
  $endpoint->name = 'openlayers_services_map';
  $endpoint->server = 'rest_server';
  $endpoint->path = 'openlayers';
  $endpoint->authentication = array();
  $endpoint->server_settings = array(
    'formatters' => array(
      'raw' => TRUE,
      'bencode' => FALSE,
      'json' => FALSE,
      'jsonp' => FALSE,
      'php' => FALSE,
      'xml' => FALSE,
    ),
    'parsers' => array(
      'text/html' => TRUE,
      'application/json' => FALSE,
      'application/vnd.php.serialized' => FALSE,
      'application/x-www-form-urlencoded' => FALSE,
      'application/xml' => FALSE,
      'multipart/form-data' => FALSE,
      'text/xml' => FALSE,
    ),
  );
  $endpoint->resources = array(
    'openlayers_map' => array(
      'operations' => array(
        'retrieve' => array(
          'enabled' => '1',
        ),
      ),
    ),
  );
  $endpoint->debug = 0;
  $export['openlayers_map'] = $endpoint;

  return $export;
}
