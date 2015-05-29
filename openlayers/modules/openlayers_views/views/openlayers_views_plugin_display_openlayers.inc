<?php
/**
 * @file
 * Display plugin for OpenLayers Data
 *
 * @ingroup openlayers
 */

/**
 * Class openlayers_views_plugin_display_openlayers.
 */
class openlayers_views_plugin_display_openlayers extends views_plugin_display {
  /**
   * {@inheritdoc}
   */
  public function uses_breadcrumb() {
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function get_style_type() {
    return 'openlayers';
  }

  /**
   * OpenLayers data features are used directly in the map object.
   */
  public function execute() {
    return $this->view->render();
  }

  /**
   * {@inheritdoc}
   */
  public function preview() {
    return '<pre>' . check_plain($this->view->render()) . '</pre>';
  }

  /**
   * {@inheritdoc}
   */
  public function render() {
    return $this->view->style_plugin->render($this->view->result);
  }

  /**
   * {@inheritdoc}
   */
  public function option_definition() {
    $options = parent::option_definition();
    $options['title']['translatable'] = 0;
    $options['displays'] = array('default' => array());
    $options['style_plugin']['default'] = 'openlayers_source_vector';
    $options['row_plugin']['default'] = 'fields';
    $options['defaults']['default']['row_plugin'] = FALSE;
    return $options;
  }

  /**
   * {@inheritdoc}
   */
  public function options_summary(&$categories, &$options) {
    parent::options_summary($categories, $options);
    unset($options['header']);
    unset($options['footer']);
    unset($options['empty']);
    unset($options['exposed_block']);
    unset($options['analyze-theme']);
  }
}
