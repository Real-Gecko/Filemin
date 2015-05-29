Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.fullscreen',
  init: function(data) {
    return new ol.control.FullScreen(data.opt);
  }
});
