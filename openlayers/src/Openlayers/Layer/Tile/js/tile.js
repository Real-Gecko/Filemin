Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.tile',
  init: function(data) {
    return new ol.layer.Tile(data.opt);
  }
});
