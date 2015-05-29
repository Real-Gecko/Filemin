Drupal.behaviors.openlayers_editor = (function($){
  "use strict";
  return {
    attach: function(context, settings) {
      $('textarea[data-editor]').each(function () {
        var textarea = $(this);

        var mode = textarea.data('editor');

        var editDiv = $('<div>', {
          position: 'absolute',
          width: textarea.width(),
          height: textarea.height(),
          'class': textarea.attr('class')
        }).insertBefore(textarea);

        textarea.css('visibility', 'hidden');
        textarea.css('display', 'none');

        var editor = ace.edit(editDiv[0]);
        editor.renderer.setShowGutter(true);
        editor.renderer.setDisplayIndentGuides(true);
        editor.renderer.setShowInvisibles(true);
        editor.session.setUseSoftTabs(true);
        editor.getSession().setValue(textarea.val());
        editor.getSession().setMode("ace/mode/" + mode);
        editor.setTheme("ace/theme/textmate");

        // copy back to textarea on form submit...
        textarea.closest('form').submit(function () {
          textarea.val(editor.getSession().getValue());
        })

      });
    }
  };
})(jQuery);
