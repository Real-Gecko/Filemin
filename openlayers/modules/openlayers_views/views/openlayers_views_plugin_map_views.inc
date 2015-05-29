<?php
/**
 * @file
 * Style handler that creates a map based on a view.
 */

/**
 * Class openlayers_views_plugin_map_views.
 */
class openlayers_views_plugin_map_views extends openlayers_views_plugin_style_source_vector {

  /**
   * Store the build map.
   *
   * @var openlayers_map_interface
   */
  protected $map;

  /**
   * Array that keeps the generated features.
   *
   * @var array
   */
  protected $features;

  /**
   * Used to skip map rendering when only needing the features.
   *
   * @see openlayers_views_plugin_map_views::getFeatures()
   *
   * @var bool
   */
  protected $skipMapRender = FALSE;

  /**
   * {@inheritdoc}
   */
  public function render() {

    // Fetch the features to use with the map.
    $live_preview = !empty($this->view->live_preview);
    $this->view->live_preview = FALSE;
    $this->features = parent::render();
    $this->view->live_preview = $live_preview;

    $output = NULL;
    $map_machine_name = 'map_views_' . $this->view->name . '_' . $this->view->current_display;
    if (empty($this->skipMapRender) && ($this->map = openlayers_object_load('Map', $map_machine_name)) && !($this->map instanceof \Drupal\openlayers\Types\Error)) {
      // Inject the features so that the map handler doesn't execute the view
      // again.
      $this->map->setFeatures($this->features);
      $output = $this->map->build();
    }
    return $output;
  }

  /**
   * Function to just fetch the features array without getting the map.
   *
   * @param bool $reset
   *   Once fetched the features are cached. Set to true to re-render.
   *
   * @return array
   *   Features array.
   */
  public function getFeatures($reset = FALSE) {
    if (!isset($this->features) || $reset) {
      // We use render to ensure the whole processing is done properly.
      $this->skipMapRender = TRUE;
      $this->view->render();
      $this->skipMapRender = FALSE;
    }
    return $this->features;
  }

}
