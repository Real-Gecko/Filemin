<?php
/**
 * @file
 * Contains \Drupal\openlayers\RenderCache\ServiceProvider\RenderCacheServiceProvider
 */

namespace Drupal\openlayers\ServiceContainer\ServiceProvider;

use Drupal\service_container\ServiceContainer\ServiceProvider\ServiceContainerServiceProvider;

/**
 * Provides openlayers service definitions.
 */
class OpenlayersServiceProvider extends ServiceContainerServiceProvider {

  /**
   * {@inheritdoc}
   */
  public function getContainerDefinition() {
    $services = array();
    $parameters = array();

    $services['service_container'] = array(
      'class' => '\Drupal\service_container\DependencyInjection\Container',
    );

    $services['openlayers.manager'] = array(
      'class' => '\Drupal\service_container\Plugin\ContainerAwarePluginManager',
      'arguments' => array(
        'openlayers.manager.internal.'
      ),
      'calls' => array(
        array(
          'setContainer',
          array(
            '@service_container'
          )
        )
      )
    );

    $services['openlayers.manager.internal.error'] = array(
      'class' => '\Drupal\openlayers\Types\Error',
      'arguments' => array('@logger.channel.default')
    );

    $services['openlayers.manager.internal.collection'] = array(
      'class' => '\Drupal\openlayers\Types\Collection'
    );

    foreach(openlayers_ctools_plugin_type() as $plugin_type => $data) {
      $plugin_type = drupal_strtolower($plugin_type);
      $services['openlayers.' . $plugin_type] = array();
      $parameters['service_container.plugin_managers']['ctools']['openlayers.' . $plugin_type] = array(
        'owner' => 'openlayers',
        'type' => drupal_ucfirst($plugin_type)
      );
    }

    return array(
      'parameters' => $parameters,
      'services' => $services,
    );
  }
}
