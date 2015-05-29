Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.mousewheelzoom',
  init: function(data) {
    return new ol.interaction.MouseWheelZoom(data.opt);
  }
});
