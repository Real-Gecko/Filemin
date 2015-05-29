Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.select',
  init: function(data) {
    return new ol.interaction.Select(data.opt);
  }
});
