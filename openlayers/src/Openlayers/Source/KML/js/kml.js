Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.kml',
  init: function(data) {
    data.opt.projection = 'EPSG:3857';
    data.opt.extractStyles = false;
    return new ol.source.KML(data.opt);
  }
});
