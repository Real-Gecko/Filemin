Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.dragrotateandzoom',
  init: function(data) {
    return new ol.interaction.DragRotateAndZoom(data.opt);
  }
});
