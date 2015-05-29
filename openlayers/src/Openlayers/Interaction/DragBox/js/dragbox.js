Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.dragbox',
  init: function(data) {
    return new ol.interaction.DragBox(data.opt);
  }
});
