/*jshint multistr: true */
function rename(tab, name) {
    bootbox.prompt({
        title: text.rename,
        value: name,
        size: 'small',
        buttons: {
            confirm: {
                label: text.dialog_ok,
                className: "btn-primary",
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default pull-right"
            }
        },
        callback: function(result) {
            if (result !== null) {
                $.post("rename.cgi", { 'path': tab.path, 'file': name, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                    } else {
                        showError(text.error_rename, response.error);
                    }
                }).fail(function(jqx, text, e) {
                    showError(text.error_title, text)
                });
            }
        }
    });
}

function createFile(tab) {
    bootbox.prompt({
        title: text.provide_new_file_name,
        value: "",
        size: 'small',
        buttons: {
            confirm: {
                label: text.dialog_ok,
                className: "btn-primary",
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default pull-right"
            }
        },
        callback: function(result) {
            if (result !== null) {
                $.post("create_file.cgi", { 'path': tab.path, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                    } else {
                        showError(text.error_create + ' ' + result, response.error);
                    }
                }).fail(function(jqx, text, e) {
                    showError(null, text);
                });
            }
        }
    });
}

function createFolder(tab) {
    bootbox.prompt({
        title: text.provide_folder_name,
        value: "",
        size: 'small',
        buttons: {
            confirm: {
                label: text.dialog_ok,
                className: "btn-primary",
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default pull-right"
            }
        },
        callback: function(result) {
            if (result === null) {
            } else {
                $.post("create_folder.cgi", { 'path': tab.path, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                    } else {
                        showError(text.error_create + ' ' + result, response.error);
                    }
                }).fail(function(jqx, text, e) {
                    showError(null, text);
                });
            }
        }
    });
}

function copySelected(tab, name) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var names;
    if(rows.length === 0 && name === undefined) {
    } else {
        if(rows.length > 0) {
            names = rows.map(function(row) {return tab.path + '/' + row.name;});
        } else {
            names = [tab.path + '/' + name];
        }
        $.post("copy.cgi", { 'path': tab.path, 'name': names })
        .done(function(response) {
            if(response.success) {
                showSuccess(null, response.text)
            } else {
                showError(text.error_copy, response.error);
            }
        }).fail(function(jqx, text, e) {
            showError(null, text);
        });
    }
}

function cutSelected(tab, name) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var names;
    if(rows.length === 0 && name === undefined) {
    } else {
        if(rows.length > 0) {
            names = rows.map(function(row) {return tab.path + '/' + row.name;});
        } else {
            names = [tab.path + '/' + name];
        }
        $.post("cut.cgi", { 'path': tab.path, 'name': names })
        .done(function(response) {
            if(response.success) {
                showSuccess(null, response.text);
            } else {
                showError(text.error_cut, response.error);
            }
        }).fail(function(jqx, text, e) {
            showError(null, text);
        });
    }
}

function paste(tab) {
    var notice = showWait(text.paste, text.notice_take_while);
    $.post("paste.cgi", { 'path': tab.path })
    .done(function(response) {
        if(response.error) {
            waitToError(notice, text.error_title, response.error)
        } else {
            waitToSuccess(notice, text.notice_success, response.text);
        }
        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
    }).fail(function(jqx, text, e) {
        waitToError(notice, text.error_title, text);
    });
}

function extract(tab, name) {
    var notice = showWait(text.extraction_started);
    $.post("extract.cgi", { 'path': tab.path, 'file': name })
    .done(function(response) {
        if(response.success) {
            waitToSuccess(notice, text.extraction_complete, name);
            $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
        } else {
            waitToError(notice, text.error_extract, response.error);
        }
    }).fail(function(jqx, text, e) {
        waitToError(notice, null, text);
    });
}

function listArchive(path, name) {
    var notice = showWait(text.table_LoadingMessage);
    $.post("list_archive.cgi", { 'path': path, 'file': name })
    .done(function(response) {
        if(response.success) {
            bootbox.dialog({
                title: name,
                message: '<pre class="well">' + response.success + '</pre>',
                size: 'large',
                onEscape: true,
                buttons: {
                    cancel: {
                        label: text.dialog_ok,
                        className: "btn-primary"
                    }
                }
            });
            $('pre.well').height($(window).height() - 273);
            notice.remove();
        } else {
            waitToError(notice, null, response.error);
        }
    }).fail(function(jqx, text, e) {
        waitToError(notice, null, text);
    });
}

function pasteSymlink(tab) {
    $.post("symlink.cgi", { 'path': tab.path })
    .done(function(response) {
        if(response.success) {
            $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
        } else {
            showError(null, response.error);
        }
    }).fail(function(jqx, text, e) {
        showError(null, text);
    });
}

function deleteSelected(tab, name) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var names;
    var to_delete = '';
    if(rows.length > 0) {
        names = rows.map(function(row) {return row.name;});
    } else {
        names = [name];
    }
    $.each(names, function (i, val) {
        to_delete += '<li>' + escapeHTML(val) + '</li>';
    });
    bootbox.confirm({
        title: text.delete,
        message: text.about_to_delete + '<ul>' + to_delete + '</ul>' + text.are_you_sure,
        className: 'modal-500',
        buttons: {
            confirm: {
                label: text.delete,
                className: "btn-danger",
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default pull-right"
            }
        },
        callback: function(result) {
            if(result) {
                $.post("delete.cgi", {
                    path: tab.path,
                    name: names
                }).done(function(response) {
                    if(response.success) {
                        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                    } else {
                        showError(text.error_delete, response.error);
                    }
                }).fail(function(jqx, text, e) {
                    showError(null, text);
                });
            }
        }
    });
}

function bookmark(tab) {
    $.post("bookmark.cgi", { 'path': tab.path })
    .done(function(response) {
        if(response.success) {
            $('#bookmarks').append('<li><a data-item="goto">' + escapeHTML(tab.path) + '</a></li>');
            showSuccess(null, text.bookmark_added);
        } else {
            showError(null, response.error)
        }
    }).fail(function(jqx, text, e) {
        showError(null, text);
    });
}

function convertTimestamp(timestamp) {
    var d = new Date(timestamp * 1000),
        yyyy = d.getFullYear(),
        mm = ('0' + (d.getMonth() + 1)).slice(-2),
        dd = ('0' + d.getDate()).slice(-2),
        hh = d.getHours(),
        h = hh,
        min = ('0' + d.getMinutes()).slice(-2),
        ampm = 'AM',
        time;

    if (hh > 12) {
        h = hh - 12;
        ampm = 'PM';
    } else if (hh === 12) {
        h = 12;
        ampm = 'PM';
    } else if (hh === 0) {
        h = 12;
    }
    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;
    return time;
}

function bytesToSize(bytes) {
    var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 B';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    var result;
    if(i === 0) {
        result = (bytes / Math.pow(1024, i));
    } else {
        result = (bytes / Math.pow(1024, i)).toFixed(2);
    }
    result += ' ' + sizes[i];
    return result;
}

function getQueryPathParam(uri) {
    var qString = uri.split("?")[1] ? uri.split("?")[1] : "";
    var paramSplit = qString.split("&");
    var params = {};
    for(i = 0; i < paramSplit.length; i++) {
        params[paramSplit[i].split("=")[0]] = decodeURIComponent(paramSplit[i].split("=")[1]);
    }
    return params.path ? params.path : '';
}

function toggleChmod(sender) {
    $(sender.form).find('table :input').attr('disabled', !sender.checked);
}

function toggleChown(sender) {
    $(sender.form).find('.panel :input').attr('disabled', !sender.checked);
}

function changeProperties(tab, row) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var form = $('<form class="form-inline" name="properties"/>')[0];
    $(form).html($("#propertiesDialog form[name=properties]").html());
    var title;

    if(rows.length === 0) {
        form.permissions.value = row.permissions;
        form.owner.value = row.user;
        form.group.value = row.group;
        form.name.value = row.name;
        octalchange(form.permissions);
        rows = [row];
        if(!row.directory) {
            $(form.getsize).hide();
        }
        $(form).find(".obj-name i").html(row.name);
        $(form).find(".type i").html(row.type);
        $(form).find(".stats").hide();
        $(form).find(".size i").html(bytesToSize(row.size));
        $(form).find(".modified i").html(convertTimestamp(row.mtime));
        $(form).find(".accessed i").html(convertTimestamp(row.atime));
        title = '<b>' + text.properties_of + '</b> <i>' + escapeHTML(row.name) + '</i>';
    } else {
        var stats = countStats(rows);
        if(stats.dirs === 0) {
            $(form.getsize).hide();
        }
        $(form).find(".obj-name").hide();
        $(form).find(".type").hide();
        $(form).find(".stats i").html(
            text.toolbar_files + ': ' + stats.files + ' - ' +
            text.toolbar_folders + ': ' + stats.dirs + ' - ' +
            text.toolbar_total + ': ' + stats.total
        );
        $(form).find(".size i").html(stats.size);
        $(form).find(".modified").hide();
        $(form).find(".accessed").hide();
        title = '<b>' + text.properties + '</b>';
    }

    form.path.value = tab.path;
    octalchange(form.permissions);

    $(form).find('table :input').attr('disabled', true);
    $(form).find('.panel :input').attr('disabled', true);

    $(form).find(".path i").html(escapeHTML(tab.path));

    bootbox.dialog({
        title: title,
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    names = rows.map(function(row) { return {name: 'name', value: row.name}; });
                    data = $(form).serializeArray();
                    $.post("change_properties.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                        } else {
                            showError(null, response.error);
                        }
                    }).fail(function(jqx, text, e) {
                        showError(null, text);
                    });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function chmodSelected(tab, row) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var form = $('<form/>')[0];
    $(form).html($("#chmodDialog form[name=chmod]").html());

    form.path.value = tab.path;
    if(rows.length === 0) {
        form.permissions.value = row.permissions;
        octalchange(form.permissions);
        rows = [row];
    }
    bootbox.dialog({
        title: text.chmod_selected,
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) { return {name: 'name', value: row.name}; });
                    data = $(form).serializeArray();
                    $.post("chmod.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
//                            var url = $(tab.id + ' .list-table').bootstrapTable('getOptions').url;
                            $(tab.id + ' .list-table').bootstrapTable('refresh');//, { url: url});//'list.cgi?path=' + encodeURIComponent(tab.path) });
                        } else {
                            showError(text.error_chmod, response.error);
                        }
                    }).fail(function(jqx, text, e) {
                        showError(null, text);
                    });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function chownSelected(tab, row) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var form = $('<form/>')[0];
    $(form).html($("#chownDialog form[name=chown]").html());

    form.path.value = tab.path;
    if(rows.length === 0) {
        form.owner.value = row.user;
        form.group.value = row.group;
        rows = [row];
    }
    bootbox.dialog({
        title: text.chown_selected,
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) { return {name: 'name', value: row.name}; });
                    data = $(form).serializeArray();
                    $.post("chown.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $(tab.id + ' .list-table').bootstrapTable('refresh');//, { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                        } else {
                            showError(text.error_chown, response.error);
                        }
                    }).fail(function(jqx, text, e) {
                        showError(null, text);
                    });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function compressSelected(tab, row) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var form = $('<form class="form-inline"/>')[0];
    $(form).html($("#compressDialog form[name=compress]").html());

    form.path.value = tab.path;
    if(rows.length === 0) {
        rows = [row];
    }
    bootbox.dialog({
        title: text.compress_selected,
        message: form,
        className: 'modal-400',
        onEscape: true,
        buttons: {
            confirm: {
                label: text.dialog_compress,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) { return {name: 'name', value: row.name}; });
                    data = $(form).serializeArray();
                    $.post("compress.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                        } else {
                            showError(text.error_compress, response.error);
                        }
                    }).fail(function(jqx, text, e) {
                        showError(null, text);
                    });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function checkSelected(tab) {
    return ($(tab.id + ' .list-table').bootstrapTable('getAllSelections').length > 0);
}

function getSize(sender) {
    $(sender).prop('disabled', true);
    $.post("get_size.cgi", {'name': sender.form.name.value, 'path': sender.form.path.value})
    .done(function(response) {
        if(response.success) {
            $(sender.form).find(".size i").html(bytesToSize(response.data));
            $(sender).fadeOut('200');
        } else {
            showError(null, response.error);
        }
    }).fail(function(jqx, text, e) {
        showError(null, text);
    });
}

function getFromUrl(tab) {
    var form = $('<form/>')[0];
    $(form).html($("#downFromUrlDialog form[name='down_from_url']").html());
    form.path.value = tab.path;
    bootbox.dialog({
        title: text.chown_selected,
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.get_from_url,
                className: "btn-primary",
                callback: function () {
                    var data = $(form).serialize();
                    var link = form.link.value;
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "http_download.cgi", true);
                    var tracker = new PNotify({
                        title: text.http_downloading,
                        text: '',
                        icon: 'fa fa-spinner fa-spin',
                        hide: false,
                        buttons: {
                            closer: false,
                            sticker: false
                        },
                        history: {
                            history: false
                        }
                    });
                    xhr.onprogress = function () {
                        tracker.update({
                            text: xhr.responseText,
                        });
                    };
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            if (xhr.status != 200) {
                                tracker.update({
                                    type: 'error',
                                    hide: true,
                                    icon: 'fa fa-exclamation-triangle',
                                    title: text.error_title,
                                    text: xhr.statusText,
                                    buttons: {
                                        closer: true,
                                    }
                                });
                            } else {
                                var response;
                                try {
                                    response = JSON.parse(xhr.responseText);
                                }
                                catch (err) {
                                    response = '{"success" : 1}';
                                }
                                if(response.error) {
                                    tracker.update({
                                        type: 'notice',
                                        hide: true,
                                        icon: 'fa fa-exclamation-circle',
                                        title: text.warning_title,
                                        text: response.error,
                                        buttons: {
                                            closer: true,
                                        }
                                    });
                                } else {
                                    tracker.update({
                                        type: 'success',
                                        hide: true,
                                        icon: 'fa fa-check-circle',
                                        title: text.http_download_complete,
                                        text: link,
                                        buttons: {
                                            closer: true,
                                        }
                                    });
                                }
                                var url = 'list.cgi?path=' + encodeURIComponent(tab.path);
                                if($(tab.id + ' .list-table').bootstrapTable('getOptions').url == url) {
                                    $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + tab.path });
                                }
                            }
                        }
                    };
                    xhr.send(data);
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function manageBookmarks() {
    var form = $('<form/>')[0];
    $(form).html($("#bookmarksDialog form[name='manage-bookmarks']").html());
    $.ajax({
        url: "get_bookmarks.cgi",
        dataType: 'text',
        type: 'GET',
        async: true,
    })
    .done(function(res) {
        var response;
        try {
            response = JSON.parse(res);
        }
        catch (err) {
            response = {"success" : 1};
        }
        if(response.success) {
            form.bookmarks.value = res;
        } else {
            showError(null, response.error);
        }
    }).fail(function(jqx, text, e) {
        showError(null, text);
    });
    bootbox.dialog({
        title: text.manage_bookmarks,
        className: 'modal-500',
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.dialog_save,
                className: "btn-primary",
                callback: function () {
                    form.bookmarks.value = form.bookmarks.value.replace(/^\s*[\r\n]/gm, ""); 
                    data = $(form).serializeArray();
                    $.post("save_bookmarks.cgi", data)
                    .done(function(response) {
                        if(response.success) {
                            showSuccess(null, text.saved_successfully);
                            var lines = form.bookmarks.value.split('\n');
                            var ul = $('#bookmarks');
                            var lis = ul.children();
                            $.each(lis.slice(3, lis.length), function(ix, el) {
                                el.remove();
                            });
                            $.each(lines, function(ix, el) {
                                if(el !== '') {
                                    $(ul).append('<li><a data-item="goto">' + el + '</a><li>');
                                }
                            });
                        } else {
                            showError(null, response.error);
                        }
                    }).fail(function(jqx, text, e) {
                        showError(null, text);
                    });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function editFile(path, name, counter) {
    var notice = showWait(text.table_LoadingMessage);
    $.ajax({
        url: "get_file_contents.cgi?path=" + encodeURIComponent(path) + "&name=" + encodeURIComponent(name),
        dataType: 'text',
        type: 'GET',
        async: true,
    })
    .done(function(res) {
        var response = res;
        if(true) {
            var tabNum = counter;
            $('#tabs-control').append(
                $('<li><a class="closable" data-toggle="tab" aria-controls="editor-' + tabNum + '" href="#editor-' + tabNum + '"><i class="fa fa-edit"></i> ' + escapeHTML(name) +
                ' <button class="btn btn-xs btn-success close-tab pull-right" type="button" ' +
                'title="' + text.close_tab + '"><i class="fa fa-close"></i></button>' +
                '</a></li>')
            );
            var newTab = $('#tabs-control').find('a[href="#editor-' + tabNum + '"]');
            $(newTab).attr('data-original-title', escapeHTML(path + '/' + name)).tooltip({trigger: 'hover', placement: 'bottom', html: true});
            $('#tabs-container').append(
                $('\
                    <div class="tab-pane fade filemin-tab" id="editor-' + tabNum + '">\
                        <form name="edit-file">\
                            <div class="form-group">\
                                <textarea name="data" class="form-control" rows="20">' + $('<div/>').text(res).html() + '</textarea>\
                            </div>\
                            <input type="hidden" name="path" value="">\
                            <input type="hidden" name="name" value="">\
                            <input class="btn btn-primary" type="button" name="save" value="' + text.save +'">' +
                            buildModeSelector() +
                        '</form>\
                    </div>'
                )
            );
            var form = $('#editor-' + tabNum + ' form[name="edit-file"]')[0];
            form.path.value = path;
            form.name.value = name;
            var editor = CodeMirror.fromTextArea(form.data, {
                mode: "scheme",
                lineNumbers: true,
                viewportMargin: Infinity,
                autoRefresh: true,
            });
            editor.on("change", function(cm, change) {
                $('a[href="#editor-' + tabNum + '"]').find('button').removeClass('btn-success').addClass('btn-danger');
            });
            $('#editor-' + tabNum + ' .CodeMirror').height($(window).height() - 163);
            var info = CodeMirror.findModeByExtension(name.split('.').pop());
            if (info) {
                mode = info.mode;
                mime = info.mime;
                editor.setOption("mode", mime);
                CodeMirror.autoLoadMode(editor, mode);
                $('#editor-' + tabNum + ' select[name="mode-list"]').val(mime)
            } else {
                editor.setOption("mode", "scheme");
                $('#editor-' + tabNum + ' select[name="mode-list"]').val("text/plain")
            }
            $('#editor-' + tabNum + ' select[name="mode-list"]').selectpicker({
                style: 'btn-info',
                size: 10,
                dropupAuto: false
            }).on('change', function() {
                var info = CodeMirror.findModeByMIME(this.value);
                mode = info.mode;
                spec = info.mime;
                editor.setOption("mode", spec);
                CodeMirror.autoLoadMode(editor, mode);
            });
            form.editor = editor;
            $('a[href="#editor-' + tabNum + '"]').tab('show');
            notice.remove();
        } else {
            waitToError(notice, null, response.error);
        }
    }).fail(function(jqx, text, e) {
        waitToError(notice, null, text);
    });
}

function downloadSelected(tab, row) {
    var rows = $(tab.id + ' .list-table').bootstrapTable('getAllSelections');
    var form = $('<form class="form-inline"/>')[0];
    $(form).html($("#compressDialog form[name=compress]").html());

    form.path.value = tab.path;
    if(rows.length === 0 && !row.directory) {
        window.location.href='download.cgi?path=' + encodeURIComponent(tab.path) + '&file=' + encodeURIComponent(row.name);
    } else {
        var suggest;
        if(rows.length === 0) {
            rows = [row];
            suggest = row.name;
        } else {
            dirs = tab.path.split("/");
            suggest = dirs[dirs.length - 1];
        }
        form.archivename.value = suggest;
        bootbox.dialog({
            title: text.compress_selected,
            message: form,
            className: 'modal-400',
            onEscape: true,
            buttons: {
                confirm: {
                    label: text.dialog_compress,
                    className: "btn-primary",
                    callback: function () {
                        var names;
                        names = rows.map(function(row) { return {name: 'name', value: row.name}; });
                        data = $(form).serializeArray();
                        data = data.concat(names);
                        var param = $.param(data);
                        window.location.href='download_multi.cgi?' + param;
                        showNotice(text.preparing_download);
                    }
                },
                cancel: {
                    label: text.dialog_cancel,
                    className: "btn-default"
                }
            }
        });
    }
}

function viewImage(path, name) {
    bootbox.dialog({
        title: name,
        message: '<img class="img-responsive" src="get_img.cgi?path=' + encodeURIComponent(path) + '&name=' + encodeURIComponent(name) + '"/>',
        size: 'large',
        className: 'text-center',
        onEscape: true,
        buttons: {
            cancel: {
                label: text.dialog_ok,
                className: "btn-primary"
            }
        }
    });
}

function editSymlink(tab, row) {
    bootbox.prompt({
        title: text.edit_symlink,
        value: row.link_target,
        size: 'small',
        buttons: {
            confirm: {
                label: text.dialog_ok,
                className: "btn-primary",
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default pull-right"
            }
        },
        callback: function(result) {
            if (result !== null) {
                $.post("update_symlink.cgi", { 'path': tab.path, 'name': row.name, 'link': result })
                .done(function(response) {
                    if(response.success) {
                        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path) });
                    } else {
                        showError(text.error_symlink, response.error);
                    }
                }).fail(function(jqx, text, e) {
                    showError(null, text);
                });
            }
        }
    });
}

function search(path) {
    var form = $('<form name="search"/>')[0];
    $(form).html($("#searchDialog form[name=search]").html());
    form.path.value = path;
    bootbox.dialog({
        title: text.search,
        message: form,
        onEscape: true,
        buttons: {
            confirm: {
                label: text.search_go,
                className: "btn-primary",
                callback: function () {
                    var url = 'list.cgi?path=' + encodeURIComponent(path) + '&query=' + encodeURIComponent(form.query.value) + '&caseins=' + form.caseins.value;
                    filemin.newTab('search', url);
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function escapeHTML(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function showSuccess(title, message) {
    new PNotify({
        icon: "fa fa-check-circle",
        type: 'success',
        title: title ? title : text.notice_success,
        text: message ? escapeHTML(message) : ''
    });
}

function showNotice(title, message) {
    new PNotify({
        icon: "fa fa-exclamation-circle",
        type: 'notice',
        title: title ? title : text.warning_title,
        text: message ? escapeHTML(message) : ''
    });
}

function showError(title, message) {
    new PNotify({
        icon: "fa fa-exclamation-triangle",
        type: 'error',
        title: title ? title : text.error_title,
        text: message ? escapeHTML(message) : ''
    });
}

function showWait(title, message) {
    return new PNotify({
        icon: "fa fa-cog fa-spin",
        type: 'notice',
        hide: false,
        title: title ? title : text.notice_wait,
        text: message ? escapeHTML(message) : ''
    });
}

function waitToSuccess(notice, title, message) {
    notice.update({
        type: 'success',
        hide: true,
        icon: 'fa fa-check-circle',
        title: title ? title : text.notice_success,
        text: message ? escapeHTML(message) : '',
        buttons: {
            closer: true,
        }
    });
}

function waitToError(notice, title, text) {
    notice.update({
        type: 'error',
        hide: true,
        icon: 'fa fa-exclamation-circle',
        title: title ? title : text.error_title,
        text: text ? text : '',
        buttons: {
            closer: true,
        }
    });
}

function countStats(data) {
    var total = data.length;
    var dirs = data.filter(function(el) { return el.directory }).length;
    var files = total - dirs;
    var size = 0;
    $.each(data, function(ix, val) {
        size += val.size;
    });
    size = bytesToSize(size);
    return {
        total: total,
        dirs: dirs,
        files: files,
        size: size
    }
}

function buildModeSelector() {
    result = '<select name="mode-list" class="selectpicker dropup" data-live-search="true">';
    var modes = CodeMirror.modeInfo;
    $.each(modes, function(index, mode) {
        result += '<option value="' + mode.mime + '">' + mode.name + '</option>';
    });
    result += '</select>';
    return result;
}

function isEditable(mime, name) {
    if(mime.indexOf('inode') > -1 ) {
        return false;
    }
    if(mime.indexOf('text') > -1) {
        return true;
    }
    var info = CodeMirror.findModeByMIME(mime);
    if(!info) {
        info = CodeMirror.findModeByExtension(name.split('.').pop());
    }
    return info ? true : false;
}

function disableForSearch() {
    $('#main-menu .nav li a[data-item="create_file"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="create_folder"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="upload_files"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="get_from_url"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="paste"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="symlink"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="get_sizes"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="compress_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="search"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="bookmark"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="goto"]').parent().addClass('disabled');
}

function disableForEdit() {
    $('#main-menu .nav li a[data-item="create_file"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="create_folder"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="upload_files"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="get_from_url"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="copy_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="cut_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="paste"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="symlink"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="get_sizes"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="chmod_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="chown_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="compress_selected"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="search"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="bookmark"]').parent().addClass('disabled');
    $('#main-menu .nav li a[data-item="goto"]').parent().addClass('disabled');
}
