<?php
/**
 * @file
 * Class openlayers_object.
 */

namespace Drupal\openlayers\Types;

/**
 * Class Collection.
 */
class Collection {

  /**
   * @var array
   *  List of objects in this collections. The items have to be instances of
   * \Drupal\openlayers\Types\Object.
   */
  protected $objects = array();

  /**
   * Add object to this collection.
   *
   * @param \Drupal\openlayers\Types\Object $object
   *   Object instance to add to this collection.
   */
  public function append(\Drupal\openlayers\Types\Object $object) {
    $type = strtolower(implode('', array_slice(explode('.', $object->factory_service), -3, 1)));
    $this->objects[$type][$object->machine_name] = $object;
  }

  /**
   * Returns an array with all the attachments of the collection objects.
   *
   * @return array
   *   Array with all the attachments of the collection objects.
   */
  public function getAttached() {
    $attached = array();
    foreach ($this->objects as $objects) {
      foreach ($objects as $object) {
        $object_attached = $object->attached() + array(
          'js' => array(),
          'css' => array(),
          'libraries_load' => array(),
        );
        foreach (array('js', 'css', 'libraries_load') as $type) {
          foreach ($object_attached[$type] as $data) {
            $attached[$type][] = $data;
          }
        }
      }
    }
    return $attached;
  }

  /**
   * Array with all the JS settings of the collection objects.
   *
   * @return array
   *   All the JS settings of the collection objects.
   */
  public function getJS() {
    $clone = clone $this;
    $settings = array();
    foreach ($clone->objects as $type => $objects) {
      foreach ($objects as $object) {
        $settings[$type][] = $object->getJS();
      }
    }

    $settings = array_map_recursive('_floatval_if_numeric', $settings);
    $settings = removeEmptyElements($settings);

    return $settings;
  }

  /**
   * Array with all the collection objects.
   *
   * @param string $type
   *   Type to filter for. If set only a list with objects of this type is
   *   returned.
   *
   * @return array
   *   List of objects of this collection or list of a specific type of objects.
   */
  public function getObjects($type = NULL) {
    if ($type == NULL) {
      return $this->objects;
    }

    if (isset($this->objects[$type])) {
      return $this->objects[$type];
    }

    return array();
  }

  /**
   * Flat array with all the collection objects.
   *
   * @param string $type
   *   Type to filter for. If set only a list with objects of this type is
   *   returned.
   *
   * @return array
   *   List of objects of this collection or list of a specific type of objects.
   */
  public function getFlatList($type = NULL) {
    $list = array();

    if ($type != NULL && isset($this->objects[$type])) {
      foreach ($this->objects[$type] as $object) {
        $list[] = $object;
      }
    }
    else {
      foreach ($this->objects as $objects) {
        foreach ($objects as $object) {
          $list[] = $object;
        }
      }
    }

    return $list;
  }

  /**
   * Merges another collection into this one.
   *
   * @param \Drupal\openlayers\Types\Collection $collection
   *   The collection to merge into this one.
   */
  public function merge(Collection $collection) {
    foreach ($collection->getObjects() as $objects) {
      foreach ($objects as $object) {
        $this->append($object);
      }
    }
  }
}
