Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.boostrapjs_popup',
  init: function(data) {
    jQuery("body").append("<div id='popup'></div>");

    var popup = new ol.Overlay({
      element: document.getElementById('popup'),
      positioning: 'bottom-center',
      stopEvent: false
    });
    data.map.addOverlay(popup);

    data.map.on('click', function(evt) {
      var feature = data.map.forEachFeatureAtPixel(evt.pixel,
        function(feature, layer) {
          return feature;
        });

      var element = popup.getElement();
      jQuery(element).popover('destroy');

      if (feature) {
        var geometry = feature.getGeometry();
        var coord = geometry.getCoordinates();

        jQuery(element).popover('destroy');

        jQuery(element).popover({
          'placement': 'top',
          'html': true,
          'title': feature.get('name'),
          'content': feature.get('description')
        });

        popup.setPosition(coord);
        jQuery(element).popover('show');
      }
    });
  }
});
