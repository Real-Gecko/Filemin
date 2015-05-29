Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.style.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return style;
  }
});
