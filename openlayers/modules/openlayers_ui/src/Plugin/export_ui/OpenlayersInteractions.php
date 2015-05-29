<?php
/**
 * @file
 * Class Interactions.
 */

namespace Drupal\openlayers\UI;

/**
 * Class Interactions.
 * @package Drupal\openlayers\UI
 */
class OpenlayersInteractions extends \OpenlayersObjects {

  /**
   * {@inheritdoc}
   */
  public function hook_menu(&$items) {
    parent::hook_menu($items);
    $items['admin/structure/openlayers/interactions']['type'] = MENU_LOCAL_TASK;
    $items['admin/structure/openlayers/interactions']['weight'] = 2;
  }

}
