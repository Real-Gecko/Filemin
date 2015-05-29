<?php
/**
 * @file
 * Map: Views.
 */

namespace Drupal\openlayers\Map;
use Drupal\openlayers\Config;
use Drupal\openlayers\Map;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Map\\Views',
);

/**
 * Class Views.
 */
class Views extends OLMap {

  /**
   * The features to use as initial source.
   *
   * @var array
   */
  protected $features;

  /**
   * Set the features to use as initial source.
   *
   * @param array $features
   *   The features to us for the dynamic map source.
   */
  public function setFeatures($features) {
    $this->features = $features;
  }

  /**
   * Returns the features for the initial source.
   *
   * @return array|FALSE
   *   The features array or FALSE on failure.
   */
  public function getFeatures() {
    if (empty($this->features) && ($view_config = $this->getOption('views_display'))) {
      list($views_id, $display_id) = explode(':', $view_config);
      $view = views_get_view($views_id);
      if ($view && $view->access($display_id)) {
        $view->set_display($display_id);
        if (empty($view->current_display) || ((!empty($display_id)) && $view->current_display != $display_id)) {
          if (!$view->set_display($display_id)) {
            return FALSE;
          }
        }

        $view->pre_execute();
        $view->init_style();
        $this->features = $view->style_plugin->getFeatures();
        $view->post_execute();
      }
    }
    return $this->features;
  }

  /**
   * {@inheritdoc}
   */
  public function preBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    parent::preBuild($build, $this);

    // Inject the prepared features into the correct source.
    $sources = parent::getSources();
    $views_source_name = 'source_map_views_' . str_replace(':', '_', $this->getOption('views_display'));
    foreach ($sources as $source) {
      if ($source->machine_name == $views_source_name) {
        $source->setOption('features', $this->getFeatures());
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  public function buildCollection() {
    parent::buildCollection();
    $this->getSources();
    return $this->getCollection();
  }

  /**
   * {@inheritdoc}
   */
  public function optionsForm(&$form, &$form_state) {

    $options = array();
    $views = openalyers_views_get_views('openlayers_map_views');
    foreach ($views as $view_settings) {
      list($view_name, $display) = $view_settings;
      $view = views_get_view($view_name);
      $view->set_display($display);
      $options[$view_name . ':' . $display] = t('View: @view - Display: @display', array('@view' => $view->name, '@display' => $display));
    }
    $form['options']['views_display'] = array(
      '#type' => 'select',
      '#title' => t('Source View'),
      '#options' => $options,
      '#default_value' => $this->getOption('views_display'),
    );
    parent::optionsForm($form, $form_state);
  }
}
