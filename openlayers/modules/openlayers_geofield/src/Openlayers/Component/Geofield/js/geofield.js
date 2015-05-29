Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.geofield',
  init: function(data) {
    var map = data.map;
    var geofieldWrapper = jQuery('#geofield-' + jQuery(data.map.getViewport()).parent().attr('id'));

    // Select the related source or fallback to a generic one.
    if (goog.isDef(data.opt.source) && goog.isDef(data.objects.sources[data.opt.source])) {
      var source = data.objects.sources[data.opt.source];
    }
    else {
      var source = new ol.source.Vector();
    }

    // create a vector layer used for editing.
    var vector_layer = new ol.layer.Vector({
      name: 'drawing_vectorlayer',
      source: source,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffcc33',
          width: 2
        }),
        image: new ol.style.Circle({
          radius: 7,
          fill: new ol.style.Fill({
            color: '#ffcc33'
          })
        })
      })
    });
    map.addLayer(vector_layer);

    // Add preset data if available.
    if (jQuery('.openlayers-geofield-data', geofieldWrapper).val()) {
      try {
        var format = new ol.format[data.opt.initialDataType]({splitCollection: true});
        vector_layer.getSource().addFeatures(
          format.readFeatures(
            jQuery('.openlayers-geofield-data', geofieldWrapper).val(),
            {
              dataProjection: data.opt.dataProjection,
              featureProjection: data.map.getView().getProjection()
            })
        );
      }
      catch (e) {
      }
    }

    // make interactions global so they can later be removed
    var select_interaction,
      draw_interaction,
      modify_interaction;

    var action_type = jQuery('.action-feature', geofieldWrapper);
    action_type.change(function(e) {
      if (this.value === 'draw') {
        addDrawInteraction();
      } else {
        addModifyInteraction();
      }
    });

    // get geometry type
    var geom_type = jQuery('.type-of-feature', geofieldWrapper);
    geom_type.change(function(e) {
      map.removeInteraction(draw_interaction);
      addDrawInteraction();
    });

    // get data type to save in
    var data_type = jQuery('.data-type', geofieldWrapper);
    data_type.change(function(e) {
      clearMap();
      map.removeInteraction(draw_interaction);
      addDrawInteraction();
    });

    // build up modify interaction
    // needs a select and a modify interaction working together
    function addModifyInteraction() {
      // remove draw interaction
      map.removeInteraction(draw_interaction);
      // create select interaction
      select_interaction = new ol.interaction.Select({
        // make sure only the desired layer can be selected
        layers: function(vector_layer) {
          return vector_layer.get('name') === 'drawing_vectorlayer';
        }
      });
      map.addInteraction(select_interaction);

      // grab the features from the select interaction to use in the modify interaction
      var selected_features = select_interaction.getFeatures();
      // when a feature is selected...
      selected_features.on('add', function(event) {
        // grab the feature
        var feature = event.element;
        // ...listen for changes and save them
        feature.on('change', saveData);
        // listen to pressing of delete key, then delete selected features
        jQuery(document).on('keyup', function (event) {
          if (event.keyCode == 46) {
            // remove all selected features from select_interaction and drawing_vectorlayer
            selected_features.forEach(function (selected_feature) {
              var selected_feature_id = selected_feature.getId();
              // remove from select_interaction
              selected_features.remove(selected_feature);
              // remove features from vectorlayer
              var vectorlayer_features = vector_layer.getSource().getFeatures();
              vectorlayer_features.forEach(function (source_feature) {
                var source_feature_id = source_feature.getId();
                if (source_feature_id === selected_feature_id) {
                  // remove from drawing_vectorlayer
                  vector_layer.getSource().removeFeature(source_feature);
                  // save the changed data
                  saveData();
                }
              });
            });
            // remove listener
            jQuery(document).off('keyup');
          }
        });
      });
      // create the modify interaction
      modify_interaction = new ol.interaction.Modify({
        features: selected_features,
        // delete vertices by pressing the SHIFT key
        deleteCondition: function(event) {
          return ol.events.condition.shiftKeyOnly(event) &&
            ol.events.condition.singleClick(event);
        }
      });
      // add it to the map
      map.addInteraction(modify_interaction);
    }

// creates a draw interaction
    function addDrawInteraction() {
      // remove other interactions
      map.removeInteraction(select_interaction);
      map.removeInteraction(modify_interaction);

      // create the interaction
      draw_interaction = new ol.interaction.Draw({
        source: vector_layer.getSource(),
        type: /** @type {ol.geom.GeometryType} */ (geom_type.val())
      });
      // add it to the map
      map.addInteraction(draw_interaction);

      // when a new feature has been drawn...
      draw_interaction.on('drawend', function(event) {
        // Enforce feature limit.
        if (data.opt.featureLimit && data.opt.featureLimit != -1 && data.opt.featureLimit < vector_layer.getSource().getFeatures().length) {
          if (confirm(Drupal.t('You can add a maximum of !limit features. Dou you want to replace the last feature by the new one?', {'!limit': data.opt.featureLimit}))) {
            var features = vector_layer.getSource().getFeatures();
            // The "last" feature is one before the currently drawn.
            var lastFeature = features[features.length - 2];
            vector_layer.getSource().removeFeature(lastFeature);
          }
          else {
            vector_layer.getSource().removeFeature(event.feature);
            return;
          }
        }
        // give the feature this id
        event.feature.setId(goog.getUid(event));
        // save the changed data
        saveData();
      });
    }

// add the draw interaction when the page is first shown
    addDrawInteraction();

// shows data in textarea
// replace this function by what you need
    function saveData() {
      // get the format the user has chosen
      // define a format the data shall be converted to
      var typeFormat = data_type.val();

      var format = new ol.format[typeFormat]({splitCollection: true}),
      // this will be the data in the chosen format
        datas;
      try {
        // convert the data of the vector_layer into the chosen format
        datas = format.writeFeatures(vector_layer.getSource().getFeatures(), {
          dataProjection: data.opt.dataProjection,
          featureProjection: data.map.getView().getProjection()
        });

      } catch (e) {
        // at time of creation there is an error in the GPX format (18.7.2014)
        jQuery('.openlayers-geofield-data', geofieldWrapper).val(e.name + ": " + e.message);
        return;
      }
      jQuery('.openlayers-geofield-data').val(datas);
      // @TODO Doesn't look like the code below is needed anymore.
      //if (typeFormat === 'GeoJSON') {
      //  // format is JSON
      //  jQuery('.openlayers-geofield-data', geofieldWrapper).val(JSON.stringify(datas, null, 4));
      //}
      //if (typeFormat === 'GPX' || typeFormat === 'KML') {
      //  // format is XML (GPX or KML)
      //  var serializer = new XMLSerializer();
      //  jQuery('.openlayers-geofield-data', geofieldWrapper).val(serializer.serializeToString(datas));
      //}
      //if (typeFormat === 'WKT') {
      //  jQuery('.openlayers-geofield-data').val(datas);
      //}
    }

// clear map when user clicks on 'Delete all features'
    jQuery('.clearmap', geofieldWrapper).click(function(e) {
      clearMap();
      e.preventDefault();
    });

// clears the map and the output of the data
    function clearMap() {
      vector_layer.getSource().clear();
      if (select_interaction) {
        select_interaction.getFeatures().clear();
      }
      jQuery('.openlayers-geofield-data', geofieldWrapper).val('');
    }

  }
});

/** Ensures the  map is fully rebuilt on ajax request - e.g. geocoder. */
Drupal.behaviors.openlayersGeofieldWidget = (function($) {
  "use strict";
  return {
    detach: function (context, settings) {
      $('.openlayers-map').removeOnce('openlayers-map', function () {
        var map_id = $(this).attr('id');
        delete Drupal.openlayers.instances[map_id];
      });
    }
  }
})(jQuery);
