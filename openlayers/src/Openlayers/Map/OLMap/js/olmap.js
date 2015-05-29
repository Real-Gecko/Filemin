Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.map.internal.olmap',
  init: function(data) {
    var options = jQuery.extend(true, {}, data.opt);
    var projection = ol.proj.get('EPSG:3857');
    var coord = ol.proj.transform([options.view.center.lat, options.view.center.lon], 'EPSG:4326', projection);

    options.view = new ol.View({
      center: coord,
      rotation: options.view.rotation * (Math.PI / 180),
      zoom: options.view.zoom,
      // Todo: Find why these following options makes problems
      //minZoom: options.view.minZoom,
      //maxZoom: options.view.maxZoom,
      projection: projection,
      extent: projection.getExtent()
    });

    var map = new ol.Map(options);
    map.target = data.opt.target;

    return map;
  },
  attach: function(context, settings) {},
  detach: function(context, settings) {}
});
