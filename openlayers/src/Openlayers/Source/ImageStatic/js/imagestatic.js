Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.imagestatic',
  init: function(data) {
    var pixelProjection = new ol.proj.Projection({
      code: 'pixel',
      units: 'pixels',
      extent: [0, 0, 1024, 968]
    });

    data.opt.imageSize = [1024, 1024];
    data.opt.projection = pixelProjection;
    data.opt.imageExtent = pixelProjection.getExtent();

    data.map.setView(new ol.View({
      projection: pixelProjection,
      center: ol.extent.getCenter(pixelProjection.getExtent()),
      zoom: data.map.getView().getZoom()
    }));

    return new ol.source.ImageStatic(data.opt);
  }
});
