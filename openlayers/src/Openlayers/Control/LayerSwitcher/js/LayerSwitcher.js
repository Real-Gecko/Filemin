Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.layerswitcher',
  init: function(data) {
    var element = jQuery(data.opt.element);

    jQuery('input[name=layer]', element).change(function() {
      data.map.getLayers().forEach(function(layer, index, array) {
        // If this layer is exposed in the control check its state.
        if (jQuery('input[value=' + layer.mn + ']', element).length) {
          layer.setVisible(jQuery('input[value=' + layer.mn + ']', element).is(':checked'));
        }
      });
    });

    return new ol.control.Control({
      element: element[0]
    });
  }
});
