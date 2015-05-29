<?php
/**
 * @file
 * Contains Openlayers
 */

use Drupal\service_container\DependencyInjection\CachedContainerBuilder;
use Drupal\service_container\DependencyInjection\ServiceProviderPluginManager;

/**
 * Static Service Container wrapper.
 *
 * Generally, code in Drupal should accept its dependencies via either
 * constructor injection or setter method injection. However, there are cases,
 * particularly in legacy procedural code, where that is infeasible. This
 * class acts as a unified global accessor to arbitrary services within the
 * system in order to ease the transition from procedural code to injected OO
 * code.
 */
class Openlayers extends Drupal {

  /**
   * Initializes the container.
   *
   * This can be safely called from hook_boot() because the container will
   * only be build if we have reached the DRUPAL_BOOTSTRAP_FULL phase.
   *
   * @return bool
   *   TRUE when the container was initialized, FALSE otherwise.
   */
  public static function init() {

    // If this is set already, just return.
    if (isset(static::$container)) {
      return TRUE;
    }

    $service_provider_manager = new ServiceProviderPluginManager();
    // This is an internal API, but we need the cache object.
    $cache = _cache_get_object('cache');

    $container_builder = new CachedContainerBuilder($service_provider_manager, $cache);

    if ($container_builder->isCached()) {
      static::$container = $container_builder->compile();
      return TRUE;
    }

    // If we have not yet fully bootstrapped, we can't build the container.
    if (drupal_bootstrap(NULL, FALSE) != DRUPAL_BOOTSTRAP_FULL) {
      return FALSE;
    }

    // Rebuild the container.
    static::$container = $container_builder->compile();

    return (bool) static::$container;
  }

  /**
   * Returns the currently active global container.
   *
   * @deprecated This method is only useful for the testing environment. It
   * should not be used otherwise.
   *
   * @return \Drupal\service_container\DependencyInjection\ContainerInterface
   *   The currently active container object.
   */
  public static function getContainer() {
    return static::$container;
  }

  /**
   * Retrieves a service from the container.
   *
   * Use this method if the desired service is not one of those with a dedicated
   * accessor method below. If it is listed below, those methods are preferred
   * as they can return useful type hints.
   *
   * @param string $id
   *   The ID of the service to retrieve.
   *
   * @return mixed
   *   The specified service.
   */
  public static function service($id) {
    return static::$container->get($id);
  }

  /**
   * Gets a plugin definition of currently active container object.
   */
  public static function getDefinition($plugin_id) {
    return static::$container->getDefinition($plugin_id);
  }

  /**
   * Gets an instance of the currently active container object.
   *
   * @param string $service
   *   The service to get an object from.
   * @param array $plugin
   *   The plugin definition.
   *
   * @return object
   *   Openlayers object instance.
   */
  public static function getOLObject($service, $plugin) {
    return static::$container->get('openlayers.' . strtolower($service))->createInstance($plugin);
  }

  /**
   * Gets a list of available plugin types.
   *
   * @param string $plugin
   *   The plugin .
   *
   * @return array
   *   Openlayers object instance.
   */
  public static function getOLObjectsOptions($plugin) {
    $options = array('' => t('<Choose the @plugin type>', array('@plugin' => $plugin)));
    $service_basename = 'openlayers.' . strtolower($plugin);
    foreach (Openlayers::service($service_basename)->getDefinitions() as $service => $data) {
      $options[$service_basename . '.internal.' . $data['name']] = $data['name'];
    }
    return $options;
  }

}
