Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.setvalues',
  init: function(data) {
    data.map.on('moveend', function(evt){
      var view = data.map.getView();
      var coord = ol.proj.transform(view.getCenter(), view.getProjection(), 'EPSG:4326');

      jQuery('#' + data.opt.latitude).val(coord[0]);
      jQuery('#' + data.opt.longitude).val(coord[1]);
      jQuery('#' + data.opt.rotation).val(Math.round(view.getRotation() * (180 / Math.PI)));
      jQuery('#' + data.opt.zoom).val(view.getZoom());
    });
  }
});
