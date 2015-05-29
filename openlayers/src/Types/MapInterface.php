<?php
/**
 * @file
 * Interface openlayers_map_interface.
 */

namespace Drupal\openlayers\Types;

/**
 * Interface openlayers_map_interface.
 */
interface MapInterface {
  /**
   * Returns the id of this map.
   *
   * @return string
   *   The id of this map.
   */
  public function getId();

  /**
   * Returns the layer objects assigned to this map.
   *
   * @return array
   *   List of layer objects assigned to this map.
   */
  public function getLayers();

  /**
   * Returns the source objects assigned to this map.
   *
   * @return array
   *   List of source objects assigned to this map.
   */
  public function getSources();

  /**
   * Returns the control objects assigned to this map.
   *
   * @return array
   *   List of control objects assigned to this map.
   */
  public function getControls();

  /**
   * Returns the interaction objects assigned to this map.
   *
   * @return array
   *   List of interaction objects assigned to this map.
   */
  public function getInteractions();

  /**
   * Returns the component objects assigned to this map.
   *
   * @return array
   *   List of component objects assigned to this map.
   */
  public function getComponents();

  /**
   * Build render array of a map.
   *
   * @return array
   *   The render array.
   */
  public function build();
}
