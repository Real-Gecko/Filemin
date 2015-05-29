Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.draw',
  init: function(data) {

    var featureOverlay = new ol.FeatureOverlay({
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    });
    featureOverlay.setMap(data.map);

    data.opt.features = featureOverlay.getFeatures();
    data.opt.type = 'Point';

    data.map.on('moveend', function(evt){
      var WKT = new ol.format.WKT();
      console.log(WKT.writeFeatures(featureOverlay.getFeatures()));
    });

    return new ol.interaction.Draw(data.opt);
  }
});
