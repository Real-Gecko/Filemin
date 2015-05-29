Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.image',
  init: function(data) {
    return new ol.layer.Image(data.opt);
  }
});
