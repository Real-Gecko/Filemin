<?php
/**
 * @file
 * Class openlayers_layer.
 */

namespace Drupal\openlayers\Types;

/**
 * Class openlayers_layer.
 */
abstract class Layer extends Object implements LayerInterface {

  /**
   * {@inheritdoc}
   */
  public function buildCollection() {
    parent::buildCollection();

    foreach (array('source', 'style') as $type) {
      if ($data = $this->getOption($type, FALSE)) {
        // @TODO Throw proper exception if an object isn't available?
        if ($object = openlayers_object_load($type, $data)) {
          $this->getCollection()->merge($object->getCollection());
        }
      }
    }

    return $this->getCollection();
  }

  /**
   * Returns the source of this layer.
   *
   * @return openlayers_source_interface|FALSE
   *   The source assigned to this layer.
   */
  public function getSource() {
    $source = array_values($this->getCollection()->getObjects('source'));
    return ($source[0] instanceof SourceInterface) ? $source[0] : FALSE;
  }

  /**
   * Returns the style of this layer.
   *
   * @return openlayers_style_interface|FALSE
   *   The style assigned to this layer.
   */
  public function getStyle() {
    $style = array_values($this->getCollection()->getObjects('style'));
    return (isset($style[0]) && $style[0] instanceof StyleInterface) ? $style[0] : FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function getJS() {
    $options = $this->options;

    if ($source = $this->getSource()) {
      $options['source'] = $source->machine_name;
    }

    if ($style = $this->getStyle()) {
      $options['style'] = $style->machine_name;
    }

    return array(
      'mn' => $this->machine_name,
      'fs' => strtolower($this->factory_service),
      'opt' => $options,
    );
  }

}
