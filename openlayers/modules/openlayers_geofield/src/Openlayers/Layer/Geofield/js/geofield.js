Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.geofield',
  init: function(data) {
    return new ol.layer.Vector(data.opt);
  }
});
