<?php
/**
 * @file
 * Source: Geofield.
 */

namespace Drupal\openlayers\Source;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Source\\Geofield',
);

/**
 * Class Geofield.
 */
class Geofield extends Vector {

  /**
   * {@inheritdoc}
   */
  public function isCacheable() {
    // Since every instance can have other features this isn't cacheable.
    return FALSE;
  }
}
