Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.keyboardzoom',
  init: function(data) {
    return new ol.interaction.KeyboardZoom(data.opt);
  }
});
