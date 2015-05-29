Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.scaleline',
  init: function(data) {
    return new ol.control.ScaleLine(data.opt);
  }
});
