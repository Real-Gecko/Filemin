Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.keyboardpan',
  init: function(data) {
    return new ol.interaction.KeyboardPan(data.opt);
  }
});
