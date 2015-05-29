Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.geojson',
  init: function(data) {
    data.opt.projection = 'EPSG:3857';

    //// If GeoJSON data is provided with the layer, use that.  Otherwise
    //// check if BBOX, then finally use AJAX method.
    if (data.opt.geojson_data) {
      data.opt.text = data.opt.geojson_data;
      return new ol.source.GeoJSON(data.opt);
    }
    else {
      // @todo Add more strategies. Paging strategy would be really interesting
      //   to use with views_geojson.
      if (data.opt.useBBOX) {
        data.opt.format = new ol.format.GeoJSON();
        data.opt.strategy = ol.loadingstrategy.bbox;
        data.opt.loader = function(extent, resolution, projection) {
          // Ensure the bbox values are in the correct projection.
          var bbox = ol.proj.transformExtent(extent, data.map.getView().getProjection(), 'EPSG:4326');


          // Check if parameter forwarding is enabled.
          var params = {};
          if (data.opt.paramForwarding) {
            var get_params = location.search.substring(location.search.indexOf('?') + 1 ).split('&');
            jQuery.each(get_params, function(i, val){
              var param = val.split('=');
              params[param[0]] = param[1] || '';
            })
          }
          params.bbox = bbox.join(',');
          params.zoom = data.map.getView().getZoom();

          var url = data.opt.url;
          jQuery(document).trigger('openlayers.bbox_pre_loading', [{'url': url, 'params': params, 'data':  data}]);

          var that = this;
          jQuery.ajax({
            url: url,
            data: params,
            success: function(data) {
              that.addFeatures(that.readFeatures(data));
            }
          });
        };
        var vectorSource = new ol.source.ServerVector(data.opt);

        if (goog.isDef(data.opt.reloadOnExtentChange) && data.opt.reloadOnExtentChange) {
          data.map.getView().on('change:center', function() {
            vectorSource.clear();
          });
        }
        if (goog.isDef(data.opt.reloadOnZoomChange) && data.opt.reloadOnZoomChange) {
          data.map.getView().on('change:resolution', function() {
            vectorSource.clear();
          });
        }

        return vectorSource;
      }
      //else {
      //  // Fixed strategy.
      //  // @see http://dev.ol.org/releases/OpenLayers-2.12/doc/apidocs/files/OpenLayers/Strategy/Fixed-js.html
      //  if (data.opt.preload) {
      //    data.opt.strategies = [new ol.Strategy.Fixed({preload: true})];
      //  }
      //  else {
      //    data.opt.strategies = [new ol.Strategy.Fixed()];
      //  }
      //}
      //  if(data.opt.useScript){
      //    //use Script protocol to get around xss issues and 405 error
      //    data.opt.protocol = new ol.Protocol.Script({
      //      url: data.opt.url,
      //      callbackKey: data.opt.callbackKey,
      //      callbackPrefix: "callback:",
      //      filterToParams: function(filter, params) {
      //        // example to demonstrate BBOX serialization
      //        if (filter.type === ol.Filter.Spatial.BBOX) {
      //          params.bbox = filter.value.toArray();
      //          if (filter.projection) {
      //            params.bbox.push(filter.projection.getCode());
      //          }
      //        }
      //        return params;
      //      }
      //    });
      //  }
      //  else{
      //    data.opt.protocol = new ol.Protocol.HTTP({
      //      url: data.opt.url,
      //      format: new ol.Format.GeoJSON()
      //    });
      //  }
      //  var layer = new ol.Layer.Vector(title, options);
    }

    return new ol.source.GeoJSON(data.opt);
  }
});
