Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.bingmaps',
  init: function(data) {
    return new ol.source.BingMaps(data.opt);
  }
});
