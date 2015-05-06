$( document ).ready(function() {
    $.fn.dataTableExt.sErrMode = 'throw';
    $('#list_form > table').dataTable({
        "order": [],
        "aaSorting": [],
        "bDestroy": true,
        "bPaginate": true,
        "bInfo": false,
        "destroy": true,
        "oLanguage": {
            "sSearch": " "
        },
        "columnDefs": [ { "orderable": false, "targets": [0, 1, 4] }, ],
        "iDisplayLength": 50,
    });
});

function countUploads(files) {
    if(files.files.length = 0) return;
    var info = '';
    for (i = 0; i < files.files.length; i++) {
        info += files.files[i].name + '<br>';
    }
    $('#readyForUploadList').html(info);
}

function selectAll() {
    var rows = document.getElementsByClassName('ui_checked_columns');
    for (i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input')[0];
        if (!input.checked) {
            selectRow(rows[i]);
        }
    }
}

function invertSelection() {
    var rows = document.getElementsByClassName('ui_checked_columns');
    for (i = 0; i < rows.length; i++)
        rowClick(rows[i]);
}

function compressDialog() {
    if(checkSelected())
        $("#compressDialog").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true
        });    
}

function compressSelected() {
    var filename = $('#compressSelectedForm input[name=filename]').val();
    if (filename != null && filename != "") {
        $('#list_form').attr('action', "compress.cgi?arch=" + filename);
        $('#list_form').submit();
    }
}

function removeDialog() {
    if(checkSelected()) {
        $('#items-to-remove').html('');

        $(".ui_checked_checkbox input[type='checkbox']:checked").each(function() {
        $('#items-to-remove').append($(this).val() + '<br>');
        });

        $("#removeDialog").modal({
        "backdrop"  : "static",
        "keyboard"  : true,
        "show"      : true
        });
    }
}

function removeSelected() {
    $('#list_form').attr('action', "delete.cgi");
    $('#list_form').submit();
}

function chmodDialog() {
    if(checkSelected())
        $("#chmodDialog").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true
        });    
}

function chmodSelected() {
    var perms = $('#perms').val();
    if (perms != null && perms != "") {
        $('#list_form').attr('action', "chmod.cgi?perms=" + perms);
        $('#list_form').submit();
    }
}

function chownDialog() {
    if(checkSelected())
        $("#chownDialog").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true
        });    
}

function chownSelected() {
    var owner = $('#chownForm input[name=owner]').val();
    if (owner != null && owner != "") {
        $('#list_form').attr('action', "chown.cgi?owner=" + owner);
        $('#list_form').submit();
    }
}

function renameDialog(file) {
    $("#renameForm input[name=name]").val(file);
    $("#renameForm input[name=file]").val(file);
    $("#renameDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function renameSelected() {
    var name = $('#renameForm input[name=name]').val();
    var file = $('#renameForm input[name=file]').val();
    if (name != null && name != "" && name != file) {
        $('#renameForm').submit();
    }
}

function copySelected() {
    if(checkSelected()) {
        document.forms['list_form'].action = "copy.cgi";
        document.forms['list_form'].submit();
    }
}

function cutSelected() {
    if(checkSelected()) {
        document.forms['list_form'].action = "cut.cgi";
        document.forms['list_form'].submit();
    }
}

function browseForUpload() {
    $('#upfiles').click();
    return true;
}

function uploadFiles() {
    var files = document.getElementById('upfiles');
    if (files.files.length > 0)
        $('#upload-form').submit();
}

function createFolderDialog() {
    $("#createFolderDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });

}

function createFolder() {
    var name = $('#createFolderForm input[name=name]').val();
    if (name != null && name != "")
        $("#createFolderForm").submit();
}

function createFileDialog(path) {
    $("#createFileDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function createFile(path) {
    var name = $('#createFileForm input[name=name]').val();
    if (name != null && name != "")
        $("#createFileForm").submit();
}

function downFromUrlDialog() {
    $("#downFromUrlDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function downFromUrl(path) {
    var link = $('#downFromUrlForm input[name=link]').val();
    if (link != null && link != "")
        $('#downFromUrlForm').submit();
}

function selectUnselect(cb) {
    var rows = document.getElementsByClassName('ui_checked_columns');
    for (i = 0; i < rows.length; i++) {
        switch(cb.checked) {
            case true:
                selectRow(rows[i]);
                break;
            case false:
                unselectRow(rows[i]);
                break;
        }
    }
}

function rowClick(row) {
    var input = row.getElementsByTagName('input')[0];
    input.checked = !input.checked;
    if (input.checked) {
        row.className = row.className + ' checked';
    }
    else {
        row.className = row.className.replace(' checked', '');
    }
}

function selectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(!input.checked) {
        input.checked = true;
        row.className = row.className + ' checked';
    }
}

function unselectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(input.checked) {
        input.checked = false;
        row.className = row.className.replace(' checked', '');
    }
}

function viewReadyForUpload() {
    $("#readyForUploadDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });    
}

function checkSelected() {
    var checkboxes = $(".ui_checked_checkbox input[type='checkbox']:checked");
    if(checkboxes.length == 0) {
        $("#nothingSelected").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true
        });
        return false
    }
    return true;
}
