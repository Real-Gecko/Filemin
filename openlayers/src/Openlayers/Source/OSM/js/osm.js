Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.osm',
  init: function(data) {
    if (!goog.isDef(data.opt)) {
      data.opt = {};
    }
    data.opt.crossOrigin = null;
    return new ol.source.OSM(data.opt);
  }
});
