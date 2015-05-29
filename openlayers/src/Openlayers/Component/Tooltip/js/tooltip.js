Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.tooltip',
  init: function(data) {
    var map = data.map;

    var container = jQuery('<div/>', {
      id: 'tooltip',
      'class': 'ol-tooltip'
    }).appendTo('body');
    var content = jQuery('<div/>', {
      id: 'tooltip-content'
    }).appendTo('#tooltip');

    var container = document.getElementById('tooltip');
    var content = document.getElementById('tooltip-content');

    /**
     * Create an overlay to anchor the popup to the map.
     */
    var overlay = new ol.Overlay({
      element: container,
      positioning: data.opt.positioning
    });

    map.addOverlay(overlay);

    jQuery(map.getViewport()).on('mousemove', function(evt) {
      var pixel = map.getEventPixel(evt.originalEvent);
      var coordinates = map.getEventCoordinate(evt.originalEvent);

      var feature = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        if (layer.mn == data.opt.layer) {
          return feature;
        }
      });

      if (feature) {
        var name = feature.get('name') || '';
        var description = feature.get('description') || '';

        overlay.setPosition(coordinates);
        content.innerHTML = '<div class="ol-tooltip-name">' + name + '</div><div class="ol-tooltip-description">' + description + '</div>';
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
      }
    });
  }
});
