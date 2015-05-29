Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.heatmap',
  init: function(data) {
    return new ol.layer.Heatmap(data.opt);
  }
});
