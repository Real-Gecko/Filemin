Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.control.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return control;
  }
});
