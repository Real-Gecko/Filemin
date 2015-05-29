Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.mouseposition',
  init: function(data) {
//  We can like automatically check if data.opt is not undefined
//  for all the ol types.
//  ex: data.opt = data.opt || {};
    data.opt = data.opt || {};
    data.opt.coordinateFormat = ol.coordinate.createStringXY(4);
    //options.projection = 'EPSG:4326';
    return new ol.control.MousePosition(data.opt);
  }
});
