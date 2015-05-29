Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.stamen',
  init: function(data) {
    return new ol.source.Stamen(data.opt);
  }
});
