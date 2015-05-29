<?php
/**
 * @file
 * Component: Block Layer Switcher.
 */

namespace Drupal\openlayers\Component;
use Drupal\openlayers\Types\Component;

$plugin = array(
  'class' => '\\Drupal\\openlayers\\Component\\BlockLayerSwitcher',
);

/**
 * Class BlockLayerSwitcher.
 */
class BlockLayerSwitcher extends Component {

  /**
   * {@inheritdoc}
   */
  public function postBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL) {
    if ($context instanceof \Drupal\openlayers\Types\MapInterface) {
      $olebs_blockswitcher_form = drupal_get_form('olebs_blockswitcher_form', $context);
      // This can rely in the id of the map instead of the css class.
      $olebs_blockswitcher_form['map']['#value'] = $context->getId();
      $build = array(
        'map' => $build,
        'BlockLayerSwitcher' => array(
          '#type' => 'fieldset',
          '#title' => 'Layer Switcher',
          '#collapsible' => TRUE,
          '#collapsed' => TRUE,
          'form' => $olebs_blockswitcher_form,
        ),
      );
    }
  }

}
