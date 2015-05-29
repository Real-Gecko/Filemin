<?php
/**
 * @file
 * Interface openlayers_layer_interface.
 */

namespace Drupal\openlayers\Types;

/**
 * Interface openlayers_layer_interface.
 */
interface LayerInterface {

  /**
   * Returns the source of this layer.
   *
   * @return openlayers_source_interface|FALSE
   *   The source assigned to this layer.
   */
  public function getSource();
}
