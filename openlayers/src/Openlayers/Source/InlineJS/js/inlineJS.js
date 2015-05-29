Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.source.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return source;
  }
});
