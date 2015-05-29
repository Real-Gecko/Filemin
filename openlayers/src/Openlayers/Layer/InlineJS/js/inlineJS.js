Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.layer.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return layer;
  }
});
