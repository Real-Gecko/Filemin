Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.pointer',
  init: function(data) {
    return new ol.interaction.Pointer(data.opt);
  }
});
