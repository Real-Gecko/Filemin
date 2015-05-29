Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.attribution',
  init: function(data) {
    return new ol.control.Attribution(data.opt);
  }
});
