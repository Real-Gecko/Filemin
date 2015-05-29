Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.pinchrotate',
  init: function(data) {
    return new ol.interaction.PinchRotate(data.opt);
  }
});
