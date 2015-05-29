Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.component.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
  }
});
