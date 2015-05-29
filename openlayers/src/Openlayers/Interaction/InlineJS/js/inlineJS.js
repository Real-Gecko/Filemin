Drupal.openlayers.pluginManager.register({
  fs: 'openlayers.interaction.internal.inlinejs',
  init: function(data) {
    eval(data.opt.javascript);
    return interaction;
  }
});
