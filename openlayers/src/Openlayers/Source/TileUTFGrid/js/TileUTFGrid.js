Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.tileutfgrid',
  init: function(data) {
    return new ol.source.TileUTFGrid(data.opt);
  }
});
