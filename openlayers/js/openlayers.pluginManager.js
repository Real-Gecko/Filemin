Drupal.openlayers.pluginManager = (function($) {
  "use strict";
  var plugins = [];
  return {
    attach: function(context, settings) {
      for (var i in plugins) {
        var plugin = plugins[i];
        if (goog.isFunction(plugin.attach)) {
          plugin.attach(context, settings);
        }
      }
    },
    detach: function(context, settings) {
      for (var i in plugins) {
        var plugin = plugins[i];
        if (goog.isFunction(plugin.detach)) {
          plugin.detach(context, settings);
        }
      }
    },
    alter: function(){
      // @todo: alter hook
    },
    getPlugin: function(factoryService) {
      if (this.isRegistered(factoryService)) {
        return plugins[factoryService];
      }
      return false;
    },
    getPlugins: function(){
      return Object.keys(plugins);
    },
    register: function(plugin) {
      if (!goog.isObject(plugin)) {
        return false;
      }

      if (!plugin.hasOwnProperty('fs') || !goog.isFunction(plugin.init)) {
        return false;
      }

      plugins[plugin.fs.toLowerCase()] = plugin;
    },
    createInstance: function(factoryService, data) {
      var factoryService = factoryService.toLowerCase();

      if (!this.isRegistered(factoryService)) {
        return false;
      }

      try {
        var obj = plugins[factoryService].init(data);
      } catch(e) {
        if (goog.isDef(console)) {
          Drupal.openlayers.console.log(e.message);
          Drupal.openlayers.console.log(e.stack);
        }
        else {
          $(this).text('Error during map rendering: ' + e.message);
          $(this).text('Stack: ' + e.stack);
        }
      }

      if (goog.isObject(obj)) {
        obj.mn = data.data.mn;
        return obj;
      }

      return false;
    },
    isRegistered: function(factoryService) {
      return (factoryService.toLowerCase() in plugins);
    }
  };
})(jQuery);
