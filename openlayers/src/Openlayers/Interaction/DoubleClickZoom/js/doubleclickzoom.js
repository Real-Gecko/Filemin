Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.doubleclickzoom',
  init: function(data) {
    return new ol.interaction.DoubleClickZoom(data.opt);
  }
});
