<?php
/**
 * @file
 * Class openlayers_config.
 */

namespace Drupal\openlayers\Types;
use Drupal\Core\Logger\LoggerChannelInterface;

/**
 * Class openlayers_config.
 *
 * Dummy class to avoid breaking the whole processing if a plugin class is
 * missing.
 */
class Error extends Object {

  /**
   * @var string
   */
  public $errorMessage;

  protected $loggerChannel;

  /**
   * {@inheritdoc}
   */
  public function __construct(LoggerChannelInterface $logger_channel) {
    $this->loggerChannel = $logger_channel;

    foreach ($this->defaultProperties() as $property => $value) {
      $this->{$property} = $value;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function defaultProperties() {
    $properties = parent::defaultProperties();
    $properties['errorMessage'] = 'Error while loading @type @machine_name having service @service.';
    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function init(array $data) {
    foreach ($data as $property => $value) {
      $this->{$property} = $data[$property];
    }

    if (isset($data['options'])) {
      $this->options = array_replace_recursive((array) $this->options, (array) $data['options']);
    }

    $this->loggerChannel->error($this->getMessage(), array('channel' => 'openlayers'));
    drupal_set_message($this->getMessage(), 'error', FALSE);
  }

  /**
   * {@inheritdoc}
   */
  public function getMessage() {
    $machine_name = isset($this->machine_name) ? $this->machine_name : 'undefined';
    $service = isset($this->factory_service) ? $this->factory_service : 'undefined';
    $type = isset($this->type) ? $this->type : 'undefined';

    return t($this->errorMessage, array(
      '@machine_name' => $machine_name,
      '@service' => $service,
      '@type' => $type,
    ));
  }

  /**
   * {@inheritdoc}
   */
  public function getSource() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getSources() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getLayers() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getControls() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getInteractions() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getComponents() {
    return array();
  }

  /**
   * {@inheritdoc}
   */
  public function getType() {
    return 'Error';
  }
}
