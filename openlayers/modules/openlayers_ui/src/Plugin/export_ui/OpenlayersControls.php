<?php
/**
 * @file
 * Class Controls.
 */

namespace Drupal\openlayers\UI;

/**
 * Class Controls.
 * @package Drupal\openlayers\UI
 */
class OpenlayersControls extends \OpenlayersObjects {

  /**
   * {@inheritdoc}
   */
  public function hook_menu(&$items) {
    parent::hook_menu($items);
    $items['admin/structure/openlayers/controls']['type'] = MENU_LOCAL_TASK;
    $items['admin/structure/openlayers/controls']['weight'] = 1;
  }

}
