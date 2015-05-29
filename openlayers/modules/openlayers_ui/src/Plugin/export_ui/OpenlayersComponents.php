<?php
/**
 * @file
 * Class openlayers_components_ui.
 */

namespace Drupal\openlayers\UI;

/**
 * Class openlayers_components_ui.
 */
class OpenlayersComponents extends \OpenlayersObjects {

  /**
   * {@inheritdoc}
   */
  public function hook_menu(&$items) {
    parent::hook_menu($items);
    $items['admin/structure/openlayers/components']['type'] = MENU_LOCAL_TASK;
    $items['admin/structure/openlayers/components']['weight'] = 3;
  }

}
