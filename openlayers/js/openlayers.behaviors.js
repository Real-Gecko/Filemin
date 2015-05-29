Drupal.behaviors.openlayers = (function($) {
  "use strict";
  return {
    attach: function (context, settings) {
      Drupal.openlayers.pluginManager.attach(context, settings);

      $('.openlayers-map:not(.asynchronous)').once('openlayers-map', function () {
        var map_id = $(this).attr('id');
          if (goog.isDef(Drupal.settings.openlayers.maps[map_id])) {
            Drupal.openlayers.processMap(map_id, context);
          }
      });

      // Create dynamic callback functions for asynchronous maps.
      $('.openlayers-map.asynchronous').once('openlayers-map.asynchronous', function () {
        var map_id = $(this).attr('id');
        if (goog.isDef(Drupal.settings.openlayers.maps[map_id])) {
          Drupal.openlayers.asyncIsReadyCallbacks[map_id.replace(/[^0-9a-z]/gi, '_')] = function () {
            Drupal.openlayers.asyncIsReady(map_id);
          }
        }
      });
    },
    detach: function (context, settings) {
      Drupal.openlayers.pluginManager.detach(context, settings);
    }
  }
})(jQuery);



