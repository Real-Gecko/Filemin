Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.zoom',
  init: function(data) {
    return new ol.control.Zoom(data.opt);
  }
});
