Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.rotate',
  init: function(data) {
    return new ol.control.Rotate(data.opt);
  }
});
