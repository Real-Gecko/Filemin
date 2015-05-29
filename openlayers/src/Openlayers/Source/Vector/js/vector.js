Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.vector',
  init: function(data) {

    var options = {
      features: []
    };
    if (goog.isDef(data.opt) && goog.isDef(data.opt.features)) {
      // Ensure the features are really an array.
      if (!(data.opt.features instanceof Array)) {
        data.opt.features = [{geometry: data.opt.features}];
      }
      var format = new ol.format.WKT();
      for (var i in data.opt.features) {
        if (data.opt.features[i].wkt) {
          try {
            var data_projection = data.opt.features[i].projection || 'EPSG:4326';
            var feature = format.readFeature(data.opt.features[i].wkt, {
              dataProjection: data_projection,
              featureProjection: data.map.getView().getProjection()
            });
            if (goog.isDef(data.opt.features[i].attributes)) {
              feature.setProperties(data.opt.features[i].attributes);
            }
            options.features.push(feature);
          }
          catch(e) {
          }
        }
      }
    }
    return new ol.source.Vector(options);
  }
});
