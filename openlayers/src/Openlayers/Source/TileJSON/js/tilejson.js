Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.tilejson',
  init: function(data) {
    return new ol.source.TileJSON(data.opt);
  }
});
