Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.zoomslider',
  init: function(data) {
    return new ol.control.ZoomSlider(data.opt);
  }
});
