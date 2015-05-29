Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.dragzoom',
  init: function(data) {
    return new ol.interaction.DragZoom(data.opt);
  }
});
