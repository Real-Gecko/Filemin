Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.vector',
  init: function(data) {
    return new ol.layer.Vector(data.opt);
  }
});
