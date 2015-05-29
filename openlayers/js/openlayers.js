Drupal.openlayers = (function($){
  "use strict";
  return {
    instances: {},
    processMap: function (map_id, context) {
      var settings = $.extend({}, {layer:[], style:[], control:[], interaction:[], source: [], projection:[], component:[]}, Drupal.settings.openlayers.maps[map_id]);
      var map = false;

      // If already processed just return the instance.
      if (goog.isDef(Drupal.openlayers.instances[map_id])) {
        return Drupal.openlayers.instances[map_id].map;
      }

      $(document).trigger('openlayers.build_start', [
        {
          'type': 'objects',
          'settings': settings,
          'context': context
        }
      ]);

      try {
        $(document).trigger('openlayers.map_pre_alter', [{context: context}]);
        map = Drupal.openlayers.getObject(context, 'maps', settings.map, map_id);
        $(document).trigger('openlayers.map_post_alter', [{map: Drupal.openlayers.instances[map_id].map}]);

        if (settings.source.length > 0) {
          $(document).trigger('openlayers.sources_pre_alter', [{sources: settings.source}]);
          settings.source.map(function (data) {
            if (goog.isDef(data.opt) && goog.isDef(data.opt.attributions)) {
              data.opt.attributions = [
                new ol.Attribution({
                  'html': data.opt.attributions
                })
              ];
            }
            Drupal.openlayers.getObject(context, 'sources', data, map_id);
          });
          $(document).trigger('openlayers.sources_post_alter', [{sources: settings.source}]);
        }

        if (settings.control.length > 0) {
          $(document).trigger('openlayers.controls_pre_alter', [{controls: settings.control}]);
          settings.control.map(function (data) {
            var control = Drupal.openlayers.getObject(context, 'controls', data, map_id);
            if (control) {
              map.addControl(control);
            }
          });
          $(document).trigger('openlayers.controls_post_alter', [{controls: settings.control}]);
        }

        if (settings.interaction.length > 0) {
          $(document).trigger('openlayers.interactions_pre_alter', [{interactions: settings.interaction}]);
          settings.interaction.map(function (data) {
            var interaction = Drupal.openlayers.getObject(context, 'interactions', data, map_id);
            if (interaction) {
              map.addInteraction(interaction);
            }
          });
          $(document).trigger('openlayers.interactions_post_alter', [{interactions: settings.interaction}]);
        }

        if (settings.style.length > 0) {
          $(document).trigger('openlayers.styles_pre_alter', [{styles: settings.style}]);
          settings.style.map(function (data) {
            Drupal.openlayers.getObject(context, 'styles', data, map_id);
          });
          $(document).trigger('openlayers.styles_post_alter', [{styles: settings.style}]);
        }

        if (settings.layer.length > 0) {
          $(document).trigger('openlayers.layers_pre_alter', [{layers: settings.layer}]);
          settings.layer.map(function (data) {
            // Clone the data to keep the settings as raw as possible.
            var cloned_data = jQuery.extend(true, {}, data);
            cloned_data.opt.source = Drupal.openlayers.instances[map_id].sources[data.opt.source];
            if (goog.isDef(data.opt.style) && goog.isDef(Drupal.openlayers.instances[map_id].styles[data.opt.style])) {
              cloned_data.opt.style = Drupal.openlayers.instances[map_id].styles[data.opt.style];
            }
            var layer = Drupal.openlayers.getObject(context, 'layers', cloned_data, map_id);
            if (layer) {
              map.addLayer(layer);
            }
          });
          $(document).trigger('openlayers.layers_post_alter', [{layers: settings.layer}]);
        }

        if (settings.component.length > 0) {
          $(document).trigger('openlayers.components_pre_alter', [{components: settings.component}]);
          settings.component.map(function (data) {
            Drupal.openlayers.getObject(context, 'components', data, map_id);
          });
        }

      } catch (e) {
        $('#' + map_id).empty();
        $(document).trigger('openlayers.build_failed', [
          {
            'error': e,
            'settings': settings,
            'context': context
          }
        ]);
        map = false;
      }

      $(document).trigger('openlayers.build_stop', [
        {
          'type': 'objects',
          'settings': settings,
          'context': context
        }
      ]);

      return map;
    },

    /**
     * Return the map instance collection of a map_id.
     *
     * @param map_id
     *   The id of the map.
     * @returns object/false
     *   The object or false if not instantiated yet.
     */
    getMapById: function (map_id) {
      if (goog.isDef(Drupal.settings.openlayers.maps[map_id])) {
        // Return map if it is instantiated already.
        if (Drupal.openlayers.instances[map_id]) {
          return Drupal.openlayers.instances[map_id];
        }
      }
      return false;
    },

    // Holds dynamic created asyncIsReady callbacks for every map id.
    // The functions are named by the cleaned map id. Everything besides 0-9a-z
    // is replaced by an underscore (_).
    asyncIsReadyCallbacks: {},
    asyncIsReady: function (map_id) {
      if (goog.isDef(Drupal.settings.openlayers.maps[map_id])) {
        Drupal.settings.openlayers.maps[map_id].map.async--;
        if (!Drupal.settings.openlayers.maps[map_id].map.async) {
          $('#' + map_id).once('openlayers-map', function () {
            Drupal.openlayers.processMap(map_id, document);
          });
        }
      }
    },

    /**
     * Get an object of a map.
     *
     * If it isn't instantiated yet the instance is created.
     */
    getObject: (function (context, type, data, map_id) {
      // If the type is maps the structure is slightly different.
      var instances_type = type;
      if (type == 'maps') {
        instances_type = 'map';
      }
      // Prepare instances cache.
      if (!goog.isDef(Drupal.openlayers.instances[map_id])) {
        Drupal.openlayers.instances[map_id] = {map:null, layers:{}, styles:{}, controls:{}, interactions:{}, sources:{}, projections:{}, components:{}};
      }

      // Check if we've already an instance of this object for this map.
      if (goog.isDef(Drupal.openlayers.instances[map_id]) && goog.isDef(Drupal.openlayers.instances[map_id][instances_type])) {
        if (instances_type != 'map' && goog.isDef(Drupal.openlayers.instances[map_id][instances_type][data.mn])) {
          return Drupal.openlayers.instances[map_id][instances_type][data.mn];
        }
        else if (instances_type == 'map' && Drupal.openlayers.instances[map_id][instances_type]) {
          return Drupal.openlayers.instances[map_id][instances_type];
        }
      }

      var object = null;
      if (Drupal.openlayers.pluginManager.isRegistered(data['fs'])) {
        $(document).trigger('openlayers.object_pre_alter', [
          {
            'type': type,
            'mn': data.mn,
            'data': data,
            'map': Drupal.openlayers.instances[map_id].map,
            'objects': Drupal.openlayers.instances[map_id],
            'context': context
          }
        ]);
        object = Drupal.openlayers.pluginManager.createInstance(data['fs'], {
          'data': data,
          'opt': data.opt,
          'map': Drupal.openlayers.instances[map_id].map,
          'objects': Drupal.openlayers.instances[map_id],
          'context': context
        });
        $(document).trigger('openlayers.object_post_alter', [
          {
            'type': type,
            'mn': data.mn,
            'data': data,
            'map': Drupal.openlayers.instances[map_id].map,
            'objects': Drupal.openlayers.instances[map_id],
            'context': context,
            'object': object
          }
        ]);

        // Store object to the instances cache.
        if (type == 'maps') {
          Drupal.openlayers.instances[map_id][instances_type] = object;
        }
        else {
          Drupal.openlayers.instances[map_id][instances_type][data.mn] = object;
        }
        return object;
      }
      else {
        Drupal.openlayers.log('fake', 'Factory service to build ' + type + ' not available: ' + data.fs);
      }
    }),
    log: function(string) {
      if (goog.isDef(Drupal.openlayers.console)) {
        Drupal.openlayers.console.log(string);
      }
    }
  };
})(jQuery);
