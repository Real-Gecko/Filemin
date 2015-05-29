(function ($) {
  Drupal.behaviors.olebs =  {
    attach: function(context, settings) {

      $(".form-item-overlays input[type='checkbox']").on('change', function(e) {
        var map_machine_name = $(this).closest('form').find("input[name='map']").val();
        var mapInstance = Drupal.openlayers.getMapById(map_machine_name);
        if (!mapInstance) {
          var map_id = $('.' + map_machine_name).attr('id');
          mapInstance = Drupal.openlayers.getMapById(map_id);
        }
        var layers = mapInstance.map.getLayers();
        var target_layer = $(e.target);
        layers.forEach(function(layer){
          if (layer.mn == target_layer.val()) {
            if (target_layer.prop('checked') == true) {
              layer.setVisible(true);
            } else {
              layer.setVisible(false);
            }
          }
        });
      });

    }
  };
})(jQuery);

