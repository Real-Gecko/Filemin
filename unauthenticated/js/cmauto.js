CodeMirror.modeURL = "unauthenticated/js/lib/codemirror/mode/%N/%N.js";

var editor = CodeMirror.fromTextArea(document.getElementById("data"), {
    mode: "scheme",
    lineNumbers: true,
    viewportMargin: Infinity
});

var pending;

function looksLikeScheme(code) {
    return !/^\s*\(\s*function\b/.test(code) && /^\s*[;\(]/.test(code);
}
function update() {
    editor.setOption("mode", looksLikeScheme(editor.getValue()) ? "scheme" : "javascript");
}

function change(val) {
  if (m = /.+\.([^.]+)$/.exec(val)) 
  {
    var info = CodeMirror.findModeByExtension(m[1]);
    if (info) {
      mode = info.mode;
      spec = info.mime;
      editor.setOption("mode", spec);
      CodeMirror.autoLoadMode(editor, mode);
    } else {
      update();
    }
  } else {
    update();
  }
}
