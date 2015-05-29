Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.zoomtoextent',
  init: function(data) {
    return new ol.control.ZoomToExtent(data.opt);
  }
});
