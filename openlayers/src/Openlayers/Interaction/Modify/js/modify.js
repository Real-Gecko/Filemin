Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.modify',
  init: function(data) {
    return new ol.interaction.Modify(data.opt);
  }
});
