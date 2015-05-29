Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.geolocation',
  init: function(data) {
    var map = data.map;

    var geolocation = new ol.Geolocation({
      projection: map.getView().getProjection()
    });

    var track = new ol.dom.Input(document.getElementById(data.opt.checkboxID));
    track.bindTo('checked', geolocation, 'tracking');

// update the HTML page when the position changes.
    geolocation.on('change', function(event) {
      jQuery('#' + data.opt.positionAccuracyID).val(geolocation.getAccuracy() + ' [m]');
      jQuery('#' + data.opt.altitudeID).val(geolocation.getAltitude() + ' [m]');
      jQuery('#' + data.opt.altitudeAccuracyID).val(geolocation.getAltitudeAccuracy() + ' [m]');
      jQuery('#' + data.opt.headingID).val(geolocation.getHeading() + ' [rad]');
      jQuery('#' + data.opt.speedID).val(geolocation.getSpeed() + ' [m/s]');

      var pan = ol.animation.pan({
        duration: 2000,
        source: map.getView().getCenter()
      });
      var zoom = ol.animation.zoom({
        duration: 2000,
        resolution: map.getView().getResolution(),
        source: (map.getView().getZoom())
      });

      map.beforeRender(pan, zoom);
      map.getView().setCenter(geolocation.getPosition());
      map.getView().setZoom(7);
    });

    geolocation.on('error', function(error) {
      var info = document.getElementById('info');
      info.innerHTML = error.message;
      info.style.display = '';
    });

    var accuracyFeature = new ol.Feature();
    accuracyFeature.bindTo('geometry', geolocation, 'accuracyGeometry');

    var positionFeature = new ol.Feature();
    positionFeature.bindTo('geometry', geolocation, 'position')
      .transform(function() {}, function(coordinates) {
        return coordinates ? new ol.geom.Point(coordinates) : null;
      });

    var featuresOverlay = new ol.FeatureOverlay({
      map: map,
      features: [accuracyFeature, positionFeature]
    });
  }
});
