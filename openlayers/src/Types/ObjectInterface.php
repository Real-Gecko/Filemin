<?php
/**
 * @file
 * Interface openlayers_object_interface.
 */

namespace Drupal\openlayers\Types;

/**
 * Interface openlayers_object_interface.
 */
interface ObjectInterface {
  /**
   * Return a list of default properties.
   *
   * @return array
   *   The default properties for this class.
   */
  public function defaultProperties();

  /**
   * Initializes the object.
   *
   * @param array $data
   *   The configuration data.
   */
  public function init(array $data);

  /**
   * The type of this object.
   *
   * @todo: Shouldn't we automatically compute this based on the fully qualified
   * class name ?
   * ex: \Drupal\openlayers\Control\MousePosition => Control
   *
   * @return string|FALSE
   *   The object type or FALSE on failure.
   */
  public function getType();

  /**
   * Returns the plugin definition.
   *
   * @return array
   *   The plugin definition.
   */
  public function getConfiguration();

  /**
   * @TODO was does this?
   *
   * @param string|array $parents
   *   @TODO Define how this has to look like if it is an array.
   */
  public function clearOption($parents);

  /**
   * Returns an option.
   *
   * @param string|array $parents
   *   @TODO Define how this has to look like if it is an array.
   * @param mixed $default_value
   *   The default value to return if the option isn't set. Set to NULL if not
   *   defined.
   *
   * @return mixed
   *   The value of the option or the defined default value.
   */
  public function getOption($parents, $default_value = NULL);

  /**
   * Set an option.
   *
   * @param string|array $parents
   *   @TODO Define how this has to look like if it is an array.
   *
   * @param mixed $value
   *   The value to set.
   */
  public function setOption($parents, $value);

  /**
   * Provides the options form to configure this object.
   *
   * @param array $form
   *   The form array by reference.
   * @param array $form_state
   *   The form_state array by reference.
   */
  public function optionsForm(&$form, &$form_state);

  /**
   * Validation callback for the options form.
   *
   * @param array $form
   *   The form array.
   * @param array $form_state
   *   The form_state array by reference.
   */
  public function optionsFormValidate($form, &$form_state);

  /**
   * Submit callback for the options form.
   *
   * @param array $form
   *   The form array.
   * @param array $form_state
   *   The form_state array by reference.
   */
  public function optionsFormSubmit($form, &$form_state);

  /**
   * Returns a list of attachments for building the render array.
   *
   * @return array
   *   The attachments to add.
   */
  public function attached();

  /**
   * Defines dependencies.
   *
   * @TODO Define how this has to look like.
   *
   * @return array
   *   The dependencies.
   */
  public function dependencies();

  /**
   * Whether or not this object has to be processed asynchronously.
   *
   * If true the map this object relates to won't be processes right away by
   * Drupals behaviour attach.
   *
   * @return bool
   *   Whether or not this object has to be processed asynchronously.
   */
  public function isAsynchronous();

  /**
   * Invoked before an objects render array is built.
   *
   * Mostly invoked by the map object.
   *
   * @param array $build
   *   The array with the build information.
   * @param \Drupal\openlayers\Types\ObjectInterface $context
   *   The context of the build. Mostly the map object.
   */
  public function preBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL);

  /**
   * Invoked after an objects render array is built.
   *
   * Mostly invoked by the map object.
   *
   * @param array $build
   *   The array with the build information.
   * @param \Drupal\openlayers\Types\ObjectInterface $context
   *   The context of the build. Mostly the map object.
   */
  public function postBuild(array &$build, \Drupal\openlayers\Types\ObjectInterface $context = NULL);
}
