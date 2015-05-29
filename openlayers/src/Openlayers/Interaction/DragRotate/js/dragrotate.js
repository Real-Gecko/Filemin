Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.dragrotate',
  init: function(data) {
    return new ol.interaction.DragRotate(data.opt);
  }
});
