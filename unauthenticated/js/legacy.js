$( document ).ready(function() {
    /* Dynamic context menu, created on every right click */
    $.contextMenu({
        selector: '#list_form > table > tbody > tr', 
        build: function($trigger, e) {
            var extra_actions = $trigger.find('.actions')[0].textContent;
            var trigger_checkbox = $trigger.find("input[type='checkbox']")[0];
            var items = {};
            items.rename = {name: text.rename, icon: "rename"};
            if (extra_actions == 'edit') {
                items.edit =  {name: text.edit, icon: "Edit"};
            };
            if (extra_actions == 'extract') {
                items.extract =  {name: text.extract, icon: "extract"};
            };
            items.sep1 = "-------";
            items.copy = {name: text.copy, icon: "copy"};
            items.cut = {name: text.cut, icon: "cut"};
            items.paste = {name: text.paste, icon: "paste"};
            items.sep2 = "-------";
            items.delete = {name: text.delete, icon: "delete"};
            items.sep3 = "-------";
            items.properties = {name: text.properties, icon: "gear"};
            items.sep4 = "-------";
            items.select_all = {name: text.select_all, icon: "check-square-o"};
            items.select_none = {name: text.select_none, icon: "square-o"};
            items.invert_sel = {name: text.invert_selection, icon: "check-square"};
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
                            removeSelected();
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
    });

    $('tr').removeAttr('onmouseover');
    $('tr').removeAttr('onmouseout');
    $('input').removeAttr('onclick');
    $('#select-unselect').change(function() { selectUnselect($(this)); });

    // BUTTONS
    $('.fg-button').hover(
      function(){ $(this).removeClass('ui-state-default').addClass('ui-state-focus'); },
      function(){ $(this).removeClass('ui-state-focus').addClass('ui-state-default'); }
    );

    // MENUS
    $('#flat').menu({ 
    content: $('#flat').next().html(), // grab content from this page
    showSpeed: 100
    });
});

window.onload = function() {
    var checkboxes = document.getElementsByClassName('ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].onclick = function() {
            var row = this.parentNode.parentNode;
            if (this.checked) {
                row.className = row.className + ' checked';
            }
            else {
                row.className = row.className.replace(' checked', '');
            }
        };
    }
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

function invertSelection() {
    var rows = document.getElementsByClassName('ui_checked_columns');

    for (i = 0; i < rows.length; i++)
        rowClick(rows[i]);
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

function compressDialog() {
    if(checkSelected()) {
      $( "#compressDialog" ).dialog({
          modal: true,
          buttons: {
              "Compress": function() {
                  compressSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function compressSelected() {
    var filename = $('#compressSelectedForm input[name=filename]').val();
    if (filename != null && filename != "") {
        var method = $('#compressSelectedForm select[name=method] option:selected').val();
        $('#list_form').attr('action', "compress.cgi?arch=" + filename + "&method=" + method);
        $('#list_form').submit();
    }
}

function removeSelected() {
    if(checkSelected()) {
        $('#items-to-remove').html('');

        $(".ui_checked_checkbox input[type='checkbox']:checked").each(function() {
        $('#items-to-remove').append($(this).val() + '<br>');
        });

        $( "#removeDialog" ).dialog({
            modal: true,
            buttons: {
                "YES": function() {
                    document.forms['list_form'].action = "delete.cgi";
                    document.forms['list_form'].submit();
                },
                "NO": function() {
                    $( this ).dialog( "close" );
                }
            }
        });
    }
}

function chmodDialog() {
    if(checkSelected()) {
      $( "#chmodDialog" ).dialog({
          modal: true,
          minWidth: 550,
          buttons: {
              "Change": function() {
                  chmodSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function chmodSelected() {
    var perms = $('#perms').val();
    if (perms != null && perms != "") {
        var applyto = $('#chmodForm select[name=applyto] option:selected').val();
        $('#list_form').attr('action', "chmod.cgi?perms=" + perms + "&applyto=" + applyto);
        $('#list_form').submit();
    }
}

function chownDialog() {
    if(checkSelected()) {
      $( "#chownDialog" ).dialog({
          modal: true,
          buttons: {
              "Change": function() {
                  chownSelected();
              },
              "Cancel": function() {
                  $( this ).dialog( "close" );
              }
          }
      });
    }
}

function chownSelected() {
    var owner = $('#chownForm input[name=owner]').val();
    var group = $('#chownForm input[name=group]').val();
    var recursive = $('#chown-recursive').prop('checked');

    if (owner != null && owner != "" && group != null && group != "") {
        $('#list_form').attr('action', "chown.cgi?owner=" + owner + "&group=" + group + "&recursive=" + recursive);
        $('#list_form').submit();
    }
}

function renameDialog(file) {
    $("#renameForm input[name=name]").val(file);
    $("#renameForm input[name=file]").val(file);
    $( "#renameDialog" ).dialog({
        modal: true,
        buttons: {
            "Rename": function() {
                renameSelected();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
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

function viewReadyForUpload() {
    $( "#readyForUploadDialog" ).dialog({
        modal: true,
        buttons: {
            "OK": function() {
                uploadFiles();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function browseForUpload() {
    var files = document.getElementById('upfiles');
    files.click();
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
    $( "#createFolderDialog" ).dialog({
        modal: true,
        buttons: {
            "Create": function() {
                createFolder();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function createFolder() {
    var name = $('#createFolderForm input[name=name]').val();
    if (name != null && name != "")
        $("#createFolderForm").submit();
    else {
/*        var tooltip = $('#createFolderForm input[name=name]').tooltip({
            position: {
                my: "left top",
                at: "right+5 top-5"
            }
        });
        tooltip.tooltip('open');*/
        $('#createFolderForm input[name=name]').tooltip('open');
    }
}

function createFileDialog() {
    $( "#createFileDialog" ).dialog({
        modal: true,
        buttons: {
            "Create": function() {
                createFile();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function createFile() {
    var name = $('#createFileForm input[name=name]').val();
    if (name != null && name != "") {
        $("#createFileForm").submit();
    }
}

function downFromUrlDialog() {
    $( "#downFromUrlDialog" ).dialog({
        modal: true,
        buttons: {
            "Download": function() {
                downFromUrl();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function downFromUrl() {
    var link = $('#downFromUrlForm input[name=link]').val();
    if (link != null && link != "")
        $('#downFromUrlForm').submit();
}

function selectUnselect(cb) {
    var rows = $('.ui_checked_columns');
    for (i = 0; i < rows.length; i++) {
        switch(cb.is(":checked")) {
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

function checkSelected() {
    var checkboxes = $(".ui_checked_columns input[type='checkbox']:checked");
    return (checkboxes.length > 0);
}

/*
function checkSelected() {
    var checkboxes = $('.ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) return true;
    }
    $( "#nothingSelected" ).dialog({
        modal: true,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
            }
        }
    });
    return false;
}
*/
function searchDialog() {
    $( "#searchDialog" ).dialog({
        modal: true,
        buttons: {
            "Search": function() {
                search();
            },
            "Cancel": function() {
                $( this ).dialog( "close" );
            }
        }
    });
}

function search() {
    var query = $('#searchForm input[name=query]').val();
    if (query != null && query != "")
        $("#searchForm").submit();
}

/*
function checkSelected() {
    var checkboxes = document.getElementsByClassName('ui_checkbox');
    for(var i = 0; i < checkboxes.length; i++) {
        if(checkboxes[i].checked) return true;
    }
    alert('Nothing selected');
    return false;
}
*/

function warnNothingSelected() {
    $( "#nothingSelected" ).dialog({
        modal: true,
        buttons: {
            "OK": function() {
                $( this ).dialog( "close" );
            }
        }
    });
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
