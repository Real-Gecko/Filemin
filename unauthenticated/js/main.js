$(function(){
    /* Dynamic context menu, created on every right click */
    $.contextMenu({
        selector: '#list-table > tbody > tr', 
        build: function($trigger, e) {
            var extra_actions = $trigger.find('.actions')[0].textContent;
            var trigger_checkbox = $trigger.find('.ui_checkbox')[0];
            var items = {};
            items.rename = {name: text_rename, icon: "rename"};
            if (extra_actions == 'edit') {
                items.edit =  {name: text_edit, icon: "Edit"};
            };
            if (extra_actions == 'extract') {
                items.extract =  {name: text_extract, icon: "extract"};
            };
            items.sep1 = "-------";
            items.copy = {name: text_copy, icon: "copy"};
            items.cut = {name: text_cut, icon: "cut"};
            items.paste = {name: text_paste, icon: "paste"};
            items.sep2 = "-------";
            items.delete = {name: text_delete, icon: "delete"};
            items.sep3 = "-------";
            items.properties = {name: text_properties, icon: "gear"};
            items.sep4 = "-------";
            items.select_all = {name: text_select_all, icon: "check-square-o"};
            items.select_none = {name: text_select_none, icon: "square-o"};
            items.invert_sel = {name: text_invert_selection, icon: "check-square"};
            return {
                items: items,
                callback: function(key, options) {
                    var name = $(this).children()[2].textContent;
                    var selected = checkSelected();
                    switch (key) {
                        case 'rename':
                            renameDialog(name);
                            break;
                        case 'edit':
                            window.location.href = 'edit_file.cgi?file=' + name + '&path=' + path;
                            break;
                        case 'extract':
                            window.location.href = 'extract.cgi?file=' + name + '&path=' + path;
                            break;
                        case 'copy':
                            if(!selected)
                                trigger_checkbox.checked = true;
                            copySelected();
                            break;
                        case 'cut':
                            if(!selected)
                                trigger_checkbox.checked = true;
                            cutSelected();
                            break;
                        case 'paste':
                            window.location.href = 'paste.cgi?path=' + path;
                            break;
                        case 'delete':
                            if(!selected)
                                trigger_checkbox.checked = true;
                            removeDialog();
                            break;
                        case 'properties':
                            propertiesDialog(name);
                            break;
                        case 'select_all':
                            selectAll();
                            break;
                        case 'select_none':
                            selectNone();
                            break;
                        case 'invert_sel':
                            invertSelection();
                            break;
                    }
                }
            };
        }
    });/*
    $('.ui_checked_columns').click( function(e) {
        rowClick($(this)[0]);
    });
    $('.ui_checkbox').click( function(e) {
        rowClick($(this)[0].closest('tr'));
        e.stopPropagation;
    });*/

    /* Code for current path edit form */
    $('.breadcrumb').click(function() {
        $('#path-edit').show();
        $('.breadcrumb').css("visibility", "hidden");
        $('.breadcrumb input[name=path]').focus();
    });
    $(".breadcrumb a").click(function(e) {
        e.stopPropagation();
        return true;
    });
    PNotify.prototype.options.styling = "bootstrap3";
    PNotify.prototype.options.delay = 4000;
    PNotify.prototype.options.icon = false;

    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        },
        progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            $('#progress .bar').css(
                'width',
                progress + '%'
            );
        },
        start: function(e) {
            $("#uploadProgressDialog").modal({
                "backdrop"  : "static",
                "keyboard"  : true,
                "show"      : true
            });
        },
        stop: function(e) {
            window.location.href = 'index.cgi?path=' + path;
        }
    });
});

function closePathEdit(){
    $('#path-edit').hide();
    $('.breadcrumb').css("visibility", "visible");
}

function propertiesDialog(name) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'get_properties.cgi?name=' + name + '&path=' + path);
    xhr.send();
    xhr.onloadend = function () {
        var response = JSON.parse(xhr.responseText);
        $("#propertiesDialog i.obj-name").html(name);
        $("#propertiesDialog i.type").html(response.type);
        $("#propertiesDialog i.size").html(response.size);
        $("#propertiesDialog i.modified").html(response.mtime);
        $("#propertiesDialog i.accessed").html(response.atime);
        $('#propertiesDialog table :input').attr('disabled', true);
        $('#propertiesDialog .panel :input').attr('disabled', true);
        var form = $("#propertiesDialog form[name=chmod]")[0];
        form.permissions.value = response.permissions;
        form.name.value = name;
        form.owner.value = response.owner;
        form.group.value = response.group;
        octalchange(form.permissions);
        $("#propertiesDialog").modal({
            "backdrop"  : "static",
            "keyboard"  : true,
            "show"      : true
        });
    };
}

function toggleChmod(sender) {
    $('#propertiesDialog table :input').attr('disabled', !sender.checked);
}

function toggleChown(sender) {
    $('#propertiesDialog .panel :input').attr('disabled', !sender.checked);
}

function changeProperties() {
    var form = $("#propertiesDialog form[name=chmod]")[0];
    if (form.chmod.checked || form.chown.checked) {
        var permissions = form.permissions.value;
        var owner = form.owner.value;
        var group = form.group.value;
        var applyto = form.applyto.value;
        if ( permissions != null && permissions != "" &&
             owner != null && owner != "" &&
             group != null && owner != "" ) 
        {
            form.submit();
        }
    } else
        $("#propertiesDialog").modal('hide');
}

function deleteThis(name) {
    return;
}

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
            rowClick(rows[i]);
        }
    }
}

function selectNone() {
    var rows = document.getElementsByClassName('ui_checked_columns');

    for (i = 0; i < rows.length; i++) {
        var input = rows[i].getElementsByTagName('input')[0];
        if (input.checked) {
            rowClick(rows[i]);
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
    else
        warnNothingSelected();
}

function compressSelected() {
    var filename = $('#compressSelectedForm input[name=filename]').val();
    if (filename != null && filename != "") {
        var method = $('#compressSelectedForm select[name=method] option:selected').val();
        $('#list_form').attr('action', "compress.cgi?arch=" + filename + "&method=" + method);
        $('#list_form').submit();
    } else {
        $('#compressSelectedForm input[name=filename]').popover('show');
        $('#compressSelectedForm input[name=filename]').focus();
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
    } else
        warnNothingSelected();
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
    else
        warnNothingSelected();
}

function chmodSelected() {
    var form = $("#chmodDialog form[name=chmod]")[0];
    var permissions = form.permissions.value;
    var applyto = form.applyto.value;
    console.log(form, permissions, applyto);
    if (permissions != null && permissions != "") {
        $('#list_form').attr('action', "chmod.cgi?permissions=" + permissions + "&applyto=" + applyto);
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
    else
        warnNothingSelected();
}

function chownSelected() {
    var owner = $('#chownForm input[name=owner]').val();
    var group = $('#chownForm input[name=group]').val();
    var recursive = $('#chown-recursive').prop('checked');
    if (owner == null || owner == "") {
        $('#chownForm input[name=owner]').popover('show');
        $('#chownForm input[name=owner]').focus();
    }
    if (group == null || group == "") {
        $('#chownForm input[name=group]').popover('show');
        $('#chownForm input[name=group]').focus();
    }

    if (owner != null && owner != "" && group != null && group != "") {
        $('#list_form').attr('action', "chown.cgi?owner=" + owner + "&group=" + group + "&recursive=" + recursive);
        $('#list_form').submit();
    }
}

function renameDialog(name) {
    $("#renameForm input[name=name]").val(name);
    $("#renameForm input[name=file]").val(name);
    $("#renameForm input[name=name]").focus();
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
    } else {
        $('#renameForm input[name=name]').popover('show');
        $('#renameForm input[name=name]').focus();
    }
}

function copySelected() {
    if(checkSelected()) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'copy.cgi');
        xhr.send(new FormData(document.forms.list));
        xhr.onloadend = function () {
//            $.jGrowl(xhr.responseText);
            new PNotify({ text: xhr.responseText, type: 'success'});
            selectNone();
        }
    } else
        warnNothingSelected();
}

function cutSelected() {
    if(checkSelected()) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'cut.cgi');
        xhr.send(new FormData(document.forms.list));
        xhr.onloadend = function () {
//            $.jGrowl(xhr.responseText);
            new PNotify({ text: xhr.responseText, type: 'success'});
            selectNone();
        }
    } else
        warnNothingSelected();
}

function browseForUpload() {
    $('#upfiles').click();
    return true;
}

function uploadFiles() {
    var files = document.getElementById('upfiles');
    if (files.files.length > 0)
        $('#upload-form').submit();
    else
        files.click();
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
    else {
        $('#createFolderForm input[name=name]').popover('show');
        $('#createFolderForm input[name=name]').focus();
    }
}

function createFileDialog(path) {
    $("#createFileDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function createFile() {
    var name = $('#createFileForm input[name=name]').val();
    if (name != null && name != "")
        $("#createFileForm").submit();
    else {
        $('#createFileForm input[name=name]').popover('show');
        $('#createFileForm input[name=name]').focus();
    }
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
    else {
        $('#downFromUrlForm input[name=link]').popover('show');
        $('#downFromUrlForm input[name=link]').focus();
    }
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
        row.className = row.className + ' hl-aw';
    }
    else {
        row.className = row.className.replace(' hl-aw', '');
    }
}

function selectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(!input.checked) {
        input.checked = true;
        row.className = row.className + ' hl-aw';
    }
}

function unselectRow(row) {
    var input = row.getElementsByTagName('input')[0];
    if(input.checked) {
        input.checked = false;
        row.className = row.className.replace(' hl-aw', '');
    }
}

function viewReadyForUpload() {
    $("#readyForUploadDialog").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function checkSelectedNoWarn() {
    var checkboxes = $(".ui_checked_checkbox input[type='checkbox']:checked");
    if(checkboxes.length == 0) {
        return false
    }
    return true;

}
function checkSelected() {
    var checkboxes = $(".ui_checked_checkbox input[type='checkbox']:checked");
    return (checkboxes.length > 0);
/*    if(checkboxes.length == 0) {
        $("#nothingSelected").modal({
          "backdrop"  : "static",
          "keyboard"  : true,
          "show"      : true
        });
        return false
    }
    return true;*/
}

function warnNothingSelected() {
    $("#nothingSelected").modal({
      "backdrop"  : "static",
      "keyboard"  : true,
      "show"      : true
    });
}

function searchDialog() {
    $("#searchDialog").modal({
        "backdrop"  : "static",
        "keyboard"  : true,
        "show"      : true
    });
}

function search() {
    var query = $('#searchForm input[name=query]').val();
    if (query != null && query != "")
        $("#searchForm").submit();
    else {
        $('#searchForm input[name=query]').popover('show');
        $('#searchForm input[name=query]').focus();
    }
}
