Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.mapquest',
  init: function(data) {
    return new ol.source.MapQuest(data.opt);
  }
});
