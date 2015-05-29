Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.pinchzoom',
  init: function(data) {
    return new ol.interaction.PinchZoom(data.opt);
  }
});
