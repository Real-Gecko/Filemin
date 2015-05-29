Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.draganddrop',
  init: function(data) {
    return new ol.interaction.DragAndDrop(data.opt);
  }
});
