Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.xyz',
  init: function(data) {
    return new ol.source.XYZ(data.opt);
  }
});
