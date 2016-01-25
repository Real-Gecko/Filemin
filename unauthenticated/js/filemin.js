/* Modify bootstrap-table a little :D */
!function($) {

    'use strict';

    $.fn.bootstrapTable.methods.push('checkInvert');

    var BootstrapTable = $.fn.bootstrapTable.Constructor;

    BootstrapTable.prototype.checkInvert = function () {
        var that = this;
        var rows = that.$selectItem.filter(':enabled');
        var checked = rows.filter(':checked');
        rows.each(function() {
            $(this).prop('checked', !$(this).prop('checked'));
        });
        that.updateRows();
        that.updateSelected();
        that.trigger('uncheck-some', checked);
        checked = that.getSelections();
        that.trigger('check-some', checked);
    };

}(jQuery)

/* Initialize coooool stuff */
$(document).ready( function () {
    /* Initialise some vars */
    CodeMirror.modeURL = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.11.0/mode/%N/%N.min.js";
    var filemin = {};
    filemin.path = '';
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 10, "firstpos2": 10};
    PNotify.prototype.options.stack = stack_bottomright;
    PNotify.prototype.options.styling = "fontawesome";
    PNotify.prototype.options.delay = 4000;

    /* Init primary list table */
    $('#list-table').bootstrapTable({
        classes: 'table table-condensed table-hover table-no-bordered',
        search: true,
        showColumns: true,
        showPaginationSwitch: true,
        clickToSelect: true,
        maintainSelected: true,
        cookie: true,
        cookieIdTable: 'listTable',
        selectItemName: 'name',
        striped: 'true',
        url: 'list.cgi',
        minimumCountColumns: 0,
        height: 520,
        toolbar: '.breadcrumb',
        /* Some locale changes */
        formatSearch: function() { return text.table_Search},
        formatNoMatches: function() { return text.table_NoMateches },
        columns: [ {
                checkbox: true
            }, {
                field: 'name',
                title: text.name,
                switchable: false,
                sortable: true,
                width: '500px',
                class: 'column-field-name',
                formatter: function(value, row, index) {
                    var img = row.type.replace("/", "-");
                    return '<img src="images/icons/mime/' + img + '.png" class="pull-left"> <span class="name-column-link">' + value + '</span>';
                },
                events: {
                    'click .name-column-link': function(e, value, row, index) {
                            if(row.directory) {
                                $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(filemin.path + '/' + row.name) });
                            } else {
                                window.location.href='download.cgi?path=' + encodeURIComponent(filemin.path) + '&file=' + encodeURIComponent(row.name);
                            }
                            e.stopPropagation();
                        }
                }
            }, {
                field: 'type',
                title: text.type,
                sortable: true
            }, {
                field: 'user',
                title: text.owner_user,
                sortable: true,
                formatter: function(value, row, index) {
                    return row.user + ':' + row.group;
                }
            }, {
                field: 'permissions',
                title: text.permissions,
                sortable: true
            }, {
                field: 'size',
                title: text.size,
                sortable: true,
                formatter: function(value, row, index) {
                    return bytesToSize(value);
                }
            }, {
                field: 'mtime',
                title: text.last_mod_time,
                sortable: true,
                formatter: function(value, row, index){
                    return convertTimestamp(value);
                }
            }
        ],
        /* Fix checkAll/uncheckAll behavior*/
        onCheckAll: function() { $('#list-table tr[data-index]').addClass('selected') },
        onUncheckAll: function() { $('#list-table tr.selected').removeClass('selected') },
        responseHandler: function(response) {
            var data = this.data;
            if(response.error) {
                new PNotify({
                    addclass: "stack-bottomright",
                    title: text.error_title,
                    text: response.error
                });
                return data;
            } else {
                filemin.path = getQueryPathParam(this.url);
                updateBreadcrumb(filemin.path);
                return response;
            }
        },
        onLoadError: function(status, res) {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': status + ' ' + res,
                'type': 'error'
            });
        },
        contextMenu: '#context-menu',
        beforeContextMenuRow: function(e, row) {
            var index = ($(e.currentTarget).data("index"));
            if(row.editable) {
                $('#context-menu [ data-item="edit" ]').show();
            } else {
                $('#context-menu [ data-item="edit" ]').hide();
            };
            if(row.archive) {
                $('#context-menu [ data-item="extract" ]').show();
            } else {
                $('#context-menu [ data-item="extract" ]').hide();
            };
            $('#list-table').bootstrapTable('showContextMenu', { event: e } )
            .off('contextmenu-item.bs.table')
            .on('contextmenu-item.bs.table', function(ev, row, $el) {
                switch($el.data("item")) {
                    case "rename":
                        rename(filemin.path, row.name);
                        break;
                    case "edit":
                        editFile(filemin.path, row.name);
                        break;
                    case "extract":
                        extract(filemin.path, row.name);
                        break;
                    case "create_file":
                        createFile(filemin.path);
                        break;
                    case "create_folder":
                        createFolder(filemin.path);
                        break;
                    case "copy_selected":
                        copySelected(filemin.path, row.name);
                        break;
                    case "cut_selected":
                        cutSelected(filemin.path, row.name);
                        break;
                    case "paste":
                        paste(filemin.path);
                        break;
                    case "symlink":
                        pasteSymlink(filemin.path);
                        break;
                    case "select_all":
                        $('#list-table').bootstrapTable('checkAll');
                        break;
                    case "select_none":
                        $('#list-table').bootstrapTable('uncheckAll');
                        break;
                    case "select_inverse":
                        $('#list-table').bootstrapTable('checkInvert');
                        break;
                    case "properties":
                        changeProperties(filemin.path, row);
                        break;
                    case "chmod_selected":
                        chmodSelected(filemin.path, row);
                        break;
                    case "chown_selected":
                        chownSelected(filemin.path, row);
                        break;
                    case "compress_selected":
                        compressSelected(filemin.path, row);
                        break;
                    case "download_selected":
                        downloadSelected(filemin.path, row);
                        break;
                    case "search":
                        search(filemin.path);
                        break;
                    case "delete":
                        deleteSelected(filemin.path, row.name);
                        break;
                }
            });
            return false;
        }
    });

    /* Breadcrumb click */
    $('.breadcrumb').on('click', 'li', function(){
        var ol = $(this).parent();
        var ix = $(this).index();
        var path = '';
        $.each(ol.children().slice(1, ix + 1), function(index, element) {
            path += '/' + element.textContent;
        });
        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
    });

    /* Main menu */
    $('#main-menu').on('click', 'a', function() {
        switch($(this).data("item")) {
            case "upload_files":
                $('#fileupload').click();
                break;
            case "get_from_url":
                getFromUrl(filemin.path);
                break;
            case "create_file":
                createFile(filemin.path);
                break;
            case "create_folder":
                createFolder(filemin.path);
                break;
            case "copy_selected":
                copySelected(filemin.path);
                break;
            case "cut_selected":
                cutSelected(filemin.path);
                break;
            case "paste":
                paste(filemin.path);
                break;
            case "symlink":
                pasteSymlink(filemin.path);
                break;
            case "chmod_selected":
                if(checkSelected()) {
                    chmodSelected(filemin.path);
                }
                break;
            case "chown_selected":
                if(checkSelected()) {
                    chownSelected(filemin.path);
                }
                break;
            case "compress_selected":
                if(checkSelected()) {
                    compressSelected(filemin.path);
                }
                break;
            case "search":
                search(filemin.path);
                break;
            case "bookmark":
                bookmark(filemin.path);
                break;
            case "manage_bookmarks":
                manageBookmarks();
                break;
            case "goto":
                $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent($(this).text()) });
                $('#tabs-control a:first').tab('show');
                break;
        }
    });

    /* Initialize upload library */
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            if(data.path == filemin.path) {
                $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(filemin.path) });
            }
            data.tracker.get().find('div.progress').hide();
            data.tracker.update({
                type: 'success',
                hide: true,
                icon: 'fa fa-check-circle',
                title: text.upload_success,
                text: data.files[0].name,
                buttons: {
                    closer: true,
                }
            });
        },
        fail: function(e, data) {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': text,
                'type': 'error'
            });
        },
        add: function(e, data) {
            $.post("check_exists.cgi", {
                'path': filemin.path,
                'name': data.files[0].name
            }).done(function(response) {
                if(response.exists) {
                    if(response.directory) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': data.files[0].name + ' ' + text.error_exists_and_dir
                        });
                    } else {
                        (new PNotify({
                            addclass: "stack-bottomright",
                            type: 'notice',
                            icon: 'fa fa-question-circle',
                            title: text.warning_title,
                            text: response.notice,
                            hide: false,
                            buttons: {
                                closer: false,
                                sticker: false
                            },
                            history: {
                                history: false
                            },
                            'confirm': {
                                confirm: true
                            }
                        })).get().on('pnotify.confirm', function() {
                            data.url = 'upload.cgi?path=' + encodeURIComponent(filemin.path);
                            data.url += '&overwrite=1';
                            data.submit();
                        });
                    }
                } else {
                    data.url = 'upload.cgi?path=' + encodeURIComponent(filemin.path);
                    data.submit();
                }
            }).fail(function(jqx, text, e) {
                new PNotify({
                    addclass: "stack-bottomright",
                    'title': text.error_title,
                    'text': text
                });
            });
        },
        submit: function(e, data) {
            data.path = filemin.path;
            data.tracker = new PNotify({
                addclass: "stack-bottomright",                
                title: text.uploading + ' ' + data.files[0].name,
                text: '\
                <div class="progress progress-striped active" style="margin:0">\
                    <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
                        <span class="sr-only">0%</span>\
                    </div>\
                </div>',
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
        },
        progress: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.tracker.get().find('div.progress-bar').css('width', progress + '%');
            data.tracker.get().find('div.progress-bar').html(progress + '% ' + (data.bitrate/(8192*1024)).toFixed(2) + 'MB/s');
        }
    });
    
    /* Tab control */
    $('#tabs-control').on('click', ' li a .close-tab', function() {
        var tabId = $(this).parents('li').children('a').attr('href');
        $(this).parents('li').remove('li');
        $(tabId).remove();
        $('#tabs-control a:first').tab('show');
    });

    /* Save da failo */
    $('#tabs-container').on('click', 'form[name="edit-file"] input[name="save"]', function() {
        sender = $(this)[0];
        form = sender.form;
        form.data.value = form.editor.getValue();
        data = $(form).serializeArray();
        $.post("save_file.cgi", data)
        .done(function(response) {
            if(response.success) {
                new PNotify({
                    addclass: "stack-bottomright",
                    type: 'success',
                    text: text.saved_successfully
                });
                var url = 'list.cgi?path=' + encodeURIComponent(form.path.value);
                if($('#list-table').bootstrapTable('getOptions').url == url) {
                    $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(form.path.value) });
                }
            } else {
                new PNotify({
                    addclass: "stack-bottomright",
                    title: text.error_title,
                    text: response.error
                });
            }
        }).fail(function(jqx, text, e) {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': text
            });
        });
    });
    
    /* Path editing */
    $('#path-edit').on('click', function() {
        $(this).popover({
            html : true,
            trigger: 'manual',
            content: function() { return '<div class="input-group">\
                    <input id="path" type="text" class="form-control input-sm" value="' + filemin.path + '">\
                    <span class="input-group-btn">\
                        <button id="go" class="btn btn-success btn-sm" type="button"><i class="fa fa-check"></i></button>\
                    </span>\
                </div>'}
        });
        $(this).popover('toggle');
        $('#path').focus();
    });
    $(document).on('click', '#go', function() {
        $('#path-edit').popover('hide');
        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent($('#path').val()) });
    });

    $(document).on("keydown", "#path", function(event) {
        if ( event.which == 13 ) {
            $('#path-edit').popover('hide');
            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent($('#path').val()) });
        }
    });


    /* Search form 0x13 dirty hack*/
    $(document).on("keydown", ".bootbox form[name='search'] #query", function(event) {
        if ( event.which == 13 ) {
            $(".bootbox button[data-bb-handler='success']").trigger('click');
            event.preventDefault();
        }
    });
});

function updateBreadcrumb(path) {
    ol = $('.breadcrumb');
    ol.children().slice(1).remove();
    var li = path.split('/');
    $.each(li.slice(1), function(index, value) {
        ol.append('<li>' + value + '</li>');
    });
}

function rename(path, name) {
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
                $.post("rename.cgi", { 'path': path, 'file': name, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                    } else {
                        new PNotify({
                            addclass: "stack-bottomright",
                            title: text.error_rename,
                            text: response.error
                        });
                    }
                }).fail(function(jqx, text, e) {
                    new PNotify({
                        addclass: "stack-bottomright",
                        'title': text.error_title,
                        'text': text
                    });
                });
            }
        }
    });
}

function createFile(path) {
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
            if (result != null) {
                $.post("create_file.cgi", { 'path': path, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                    } else {
                        new PNotify({
                            addclass: "stack-bottomright",
                            title: text.error_create + ' ' + result,
                            text: response.error
                        });
                    }
                }).fail(function(jqx, text, e) {
                    new PNotify({
                        addclass: "stack-bottomright",
                        'title': text.error_title,
                        'text': text
                    });
                });
            }
        }
    });
}

function createFolder(path) {
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
                $.post("create_folder.cgi", { 'path': path, 'name': result })
                .done(function(response) {
                    if(response.success) {
                        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                    } else {
                        new PNotify({
                            addclass: "stack-bottomright",
                            title: text.error_create + ' ' + result,
                            text: response.error
                        });
                    }
                }).fail(function(jqx, text, e) {
                    new PNotify({
                        addclass: "stack-bottomright",
                        'title': text.error_title,
                        'text': text
                    });
                });
            }
        }
    });
}

function copySelected(path, name) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var names;
    if(rows.length == 0 && name === undefined) {
    } else {
        if(rows.length > 0) {
            names = rows.map(function(row) {return row.name;});
        } else {
            names = [name];
        }
        $.post("copy.cgi", { 'path': path, 'name': names })
        .done(function(response) {
            if(response.success) {
                new PNotify({
                    addclass: "stack-bottomright",
                    'title': "Success",
                    'text': response.text,
                    'type': 'success',
                });
            } else {
                new PNotify({
                    addclass: "stack-bottomright",
                    'title': text.error_copy,
                    'text': response.error,
                    'type': 'error'
                });
            }
        }).fail(function(jqx, text, e) {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': text,
                'type': 'error'
            });
        });
    }
}

function cutSelected(path, name) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var names;
    if(rows.length == 0 && name === undefined) {
    } else {
        if(rows.length > 0) {
            names = rows.map(function(row) {return row.name;});
        } else {
            names = [name];
        }
        $.post("cut.cgi", { 'path': path, 'name': names })
        .done(function(response) {
            if(response.success) {
                new PNotify({
                    addclass: "stack-bottomright",
                    'title': "Success",
                    'text': response.text,
                    'type': 'success',
                });
            } else {
                new PNotify({
                    addclass: "stack-bottomright",
                    'title': text.error_cut,
                    'text': response.error,
                    'type': 'error'
                });
            }
        }).fail(function(jqx, text, e) {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': text,
                'type': 'error'
            });
        });
    }
}

function paste(path) {
    $.post("paste.cgi", { 'path': path })
    .done(function(response) {
        if(response.success) {
            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.warning_title,
                'text': response.error,
                'type': 'notice'
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text,
            'type': 'error'
        });
    });
}

function extract(path, name) {
    $.post("extract.cgi", { 'path': path, 'file': name })
    .done(function(response) {
        if(response.success) {
            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_extract,
                'text': response.error,
                'type': 'error'
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text,
            'type': 'error'
        });
    });
}

function pasteSymlink(path) {
    $.post("symlink.cgi", { 'path': path })
    .done(function(response) {
        if(response.success) {
            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.warning_title,
                'text': response.error,
                'type': 'notice'
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text,
            'type': 'error'
        });
    });
}

function deleteSelected(path, name) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var names;
    var to_delete = '';
    if(rows.length > 0) {
        names = rows.map(function(row) {return row.name;});
    } else {
        names = [name];
    }
    $.each(names, function (i, val) {
        to_delete += '<li>' + val + '</li>';
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
                var rows = $('#list-table').bootstrapTable('getSelections');
                var names;
                if(rows.length > 0) {
                    names = rows.map(function(row) {return row.name;});
                } else {
                    names = [name];
                }
                $.post("delete.cgi", {
                    'path': path,
                    'name': names
                }).done(function(response) {
                    if(response.success) {
                        $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                        window.scrollTo(0, 0);
                    } else {
                        new PNotify({
                            addclass: "stack-bottomright",
                            title: text.error_delete,
                            text: response.error
                        });
                    }
                }).fail(function(jqx, text, e) {
                    new PNotify({
                        addclass: "stack-bottomright",
                        'title': text.error_title,
                        'text': text
                    });
                });
            }
        }
    });
}

function bookmark(path) {
    $.post("bookmark.cgi", { 'path': path })
    .done(function(response) {
        if(response.success) {
            $('#bookmarks').append('<li><a data-item="goto">' + path + '</a></li>');
            new PNotify({
                addclass: "stack-bottomright",
                'text': text.bookmark_added,
                'type': 'success'
            });
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.warning_title,
                'text': response.error,
                'type': 'notice'
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text,
            'type': 'error'
        });
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
    } else if (hh == 0) {
        h = 12;
    }

    time = yyyy + '-' + mm + '-' + dd + ', ' + h + ':' + min + ' ' + ampm;

    return time;
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

function getQueryPathParam(uri) {
    uri = decodeURIComponent(uri);
    var queryString = {};
    uri.replace(
        new RegExp("([^?=&]+)(=([^&]*))?", "g"),
        function($0, $1, $2, $3) { queryString[$1] = $3; }
    );
    return queryString['path'] ? queryString['path'] : '';
}

function toggleChmod(sender) {
    $(sender.form).find('table :input').attr('disabled', !sender.checked);
}

function toggleChown(sender) {
    $(sender.form).find('.panel :input').attr('disabled', !sender.checked);
}

function changeProperties(path, row) {
    var form = $('<form class="form-inline"/>')[0];
    $(form).html($("#propertiesDialog form[name=properties]").html());

    form.permissions.value = row.permissions;
    form.name.value = name;
    form.owner.value = row.user;
    form.group.value = row.group;
    form.path.value = path;
    form.name.value = row.name;
    octalchange(form.permissions);
    if(!row.directory) {
        $(form.getsize).hide();
    }

    $(form).find('table :input').attr('disabled', true);
    $(form).find('.panel :input').attr('disabled', true);

    $(form).find("i.path").html(path);
    $(form).find("i.obj-name").html(row.name);
    $(form).find("i.type").html(row.type);
    $(form).find("i.size").html(bytesToSize(row.size));
    $(form).find("i.modified").html(convertTimestamp(row.mtime));
    $(form).find("i.accessed").html(convertTimestamp(row.atime));

    bootbox.dialog({
        title: text.properties_of + ' <i><b>' + row.name + '</b></i>',
        message: form,
        buttons: {
            main: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    data = $(form).serializeArray();
                    $.post("change_properties.cgi", data)
                    .done(function(response) {
                        if(response.success) {
                            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                        } else {
                            new PNotify({
                                addclass: "stack-bottomright",
                                title: text.error_title,
                                text: response.error
                            });
                        }
                    }).fail(function(jqx, text, e) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': text
                        });
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

function chmodSelected(path, row) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var form = $('<form/>')[0];
    $(form).html($("#chmodDialog form[name=chmod]").html());

    form.path.value = path;
    if(rows.length == 0) {
        form.permissions.value = row.permissions;
        octalchange(form.permissions);
        rows = [row];
    }
    bootbox.dialog({
        title: text.chmod_selected,
        message: form,
        buttons: {
            success: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) {return {name: 'name', value: row.name}});
                    data = $(form).serializeArray();
                    $.post("chmod.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                        } else {
                            new PNotify({
                                addclass: "stack-bottomright",
                                title: text.error_chown,
                                text: response.error
                            });
                        }
                    }).fail(function(jqx, text, e) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': text
                        });
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

function chownSelected(path, row) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var form = $('<form/>')[0];
    $(form).html($("#chownDialog form[name=chown]").html());

    form.path.value = path;
    if(rows.length == 0) {
        form.owner.value = row.user;
        form.group.value = row.group;
        rows = [row];
    }
    bootbox.dialog({
        title: text.chown_selected,
        message: form,
        buttons: {
            success: {
                label: text.dialog_change,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) {return {name: 'name', value: row.name}});
                    data = $(form).serializeArray();
                    $.post("chown.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                        } else {
                            new PNotify({
                                addclass: "stack-bottomright",
                                title: text.error_chown,
                                text: response.error
                            });
                        }
                    }).fail(function(jqx, text, e) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': text
                        });
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

function compressSelected(path, row) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var form = $('<form class="form-inline"/>')[0];
    $(form).html($("#compressDialog form[name=compress]").html());

    form.path.value = path;
    if(rows.length == 0) {
        rows = [row];
    }
    bootbox.dialog({
        title: text.compress_selected,
        message: form,
        className: 'modal-400',
        buttons: {
            success: {
                label: text.dialog_compress,
                className: "btn-primary",
                callback: function () {
                    var names;
                    names = rows.map(function(row) {return {name: 'name', value: row.name}});
                    data = $(form).serializeArray();
                    $.post("compress.cgi", data.concat(names))
                    .done(function(response) {
                        if(response.success) {
                            $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
                        } else {
                            new PNotify({
                                addclass: "stack-bottomright",
                                title: text.error_compress,
                                text: response.error
                            });
                        }
                    }).fail(function(jqx, text, e) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': text
                        });
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

function checkSelected() {
    return ($('#list-table').bootstrapTable('getSelections').length > 0);
}

function getSize(sender) {
    $(sender).prop('disabled', true);
    $.post("get_size.cgi", {'name': sender.form.name.value, 'path': sender.form.path.value})
    .done(function(response) {
        if(response.success) {
            $(sender.form).find("i.size").html(bytesToSize(response.data));
            $(sender).fadeOut();
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                title: text.error_title,
                text: response.error
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text
        });
    });
}

function search(path) {
    var form = $('<form name="search"/>')[0];
    $(form).html($("#searchDialog form[name=search]").html());
    form.path.value = path;
    bootbox.dialog({
        title: text.search,
        message: form,
        buttons: {
            success: {
                label: text.search_go,
                className: "btn-primary",
                callback: function () {
                    $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) + '&query=' + encodeURIComponent(form.query.value) + '&caseins=' + form.caseins.value });
                }
            },
            cancel: {
                label: text.dialog_cancel,
                className: "btn-default"
            }
        }
    });
}

function getFromUrl(path) {
    var form = $('<form/>')[0];
    $(form).html($("#downFromUrlDialog form[name='down_from_url']").html());
    form.path.value = path;
    bootbox.dialog({
        title: text.chown_selected,
        message: form,
        buttons: {
            success: {
                label: text.get_from_url,
                className: "btn-primary",
                callback: function () {
                    var data = $(form).serialize();
                    var link = form.link.value;
                    var xhr = new XMLHttpRequest()
                    xhr.open("POST", "http_download.cgi", true)
                    var tracker = new PNotify({
                        addclass: "stack-bottomright",
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
                    }
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
                                    response = '{"success" : 1}'
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
                                var url = 'list.cgi?path=' + encodeURIComponent(path);
                                if($('#list-table').bootstrapTable('getOptions').url == url) {
                                    $('#list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
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
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': response.error
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text
        });
    });
    bootbox.dialog({
        title: text.manage_bookmarks,
        className: 'modal-500',
        message: form,
        buttons: {
            success: {
                label: text.dialog_save,
                className: "btn-primary",
                callback: function () {
                    form.bookmarks.value = form.bookmarks.value.replace(/^\s*[\r\n]/gm, "") 
                    data = $(form).serializeArray();
                    $.post("save_bookmarks.cgi", data)
                    .done(function(response) {
                        if(response.success) {
                            new PNotify({
                                addclass: "stack-bottomright",
                                type: 'success',
                                text: text.saved_successfully
                            });
                            var lines = form.bookmarks.value.split('\n');
                            var ul = $('#bookmarks');
                            var lis = ul.children();
                            $.each(lis.slice(3, lis.length), function(ix, el) {
                                el.remove();
                            });
                            $.each(lines, function(ix, el) {
                                if(el != '') {
                                    $(ul).append('<li><a data-item="goto">' + el + '</a><li>');
                                }
                            });
                        } else {
                            new PNotify({
                                addclass: "stack-bottomright",
                                title: text.error_title,
                                text: response.error
                            });
                        }
                    }).fail(function(jqx, text, e) {
                        new PNotify({
                            addclass: "stack-bottomright",
                            'title': text.error_title,
                            'text': text
                        });
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

function editFile(path, name) {
    $.ajax({
        url: "get_file_contents.cgi?path=" + encodeURIComponent(path) + "&name=" + encodeURIComponent(name),
        dataType: 'text',
        type: 'GET',
        async: true,
    })
    .done(function(res) {
        var response = res;
        if(true) {
            var tabNum = $('#tabs-control').children().length;
            $('#tabs-control').append(
                $('<li><a class="closable" data-toggle="tab" role="tab" aria-controls="editor-' + tabNum + '" href="#editor-' + tabNum + '" role="presentation"><i class="fa fa-edit"></i> ' + name +
                ' <button class="btn btn-xs btn-danger close-tab" type="button" ' +
                'title="' + text.close_tab + '"><i class="fa fa-close"></i></button>' +
                '</a></li>')
            );
            $('#tabs-container').append(
                $('\
                    <div class="tab-pane fade" id="editor-' + tabNum + '" role="tab-panel">\
                        <form name="edit-file">\
                            <div class="form-group">\
                                <textarea name="data" class="form-control" rows="20">' + res + '</textarea>\
                            </div>\
                            <input type="hidden" name="path" value="">\
                            <input type="hidden" name="name" value="">\
                            <input class="btn btn-primary" type="button" name="save" value="' + text.save +'">\
                        </form>\
                    </div>')
                );
            var form = $('#editor-' + tabNum + ' form[name="edit-file"]')[0];
            form.path.value = path;
            form.name.value = name;
            var editor = CodeMirror.fromTextArea(form.data, {
                mode: "scheme",
                lineNumbers: true,
                viewportMargin: Infinity,
                autoRefresh: true,
                height: '500px'
            });
            var info = CodeMirror.findModeByExtension(name.split('.').pop());
            if (info) {
                mode = info.mode;
                spec = info.mime;
                editor.setOption("mode", spec);
                CodeMirror.autoLoadMode(editor, mode);
            } else {
                editor.setOption("mode", "scheme");
            }
            form.editor = editor;
            $('a[href="#editor-' + tabNum + '"]').tab('show');
        } else {
            new PNotify({
                addclass: "stack-bottomright",
                'title': text.error_title,
                'text': response.error
            });
        }
    }).fail(function(jqx, text, e) {
        new PNotify({
            addclass: "stack-bottomright",
            'title': text.error_title,
            'text': text
        });
    });
}

function downloadSelected(path, row) {
    var rows = $('#list-table').bootstrapTable('getSelections');
    var form = $('<form class="form-inline"/>')[0];
    $(form).html($("#compressDialog form[name=compress]").html());

    form.path.value = path;
    if(rows.length == 0 && !row.directory) {
        window.location.href='download.cgi?path=' + encodeURIComponent(path) + '&file=' + encodeURIComponent(row.name);
    } else {
        var suggest;
        if(rows.length == 0) {
            rows = [row];
            suggest = row.name;
        } else {
            dirs = path.split("/");
            suggest = dirs[dirs.length - 1];
        }
        form.archivename.value = suggest;
        bootbox.dialog({
            title: text.compress_selected,
            message: form,
            className: 'modal-400',
            buttons: {
                success: {
                    label: text.dialog_compress,
                    className: "btn-primary",
                    callback: function () {
                        var names;
                        names = rows.map(function(row) {return {name: 'name', value: row.name}});
                        data = $(form).serializeArray();
                        data = data.concat(names);
                        var param = $.param(data);
                        window.location.href='download_multi.cgi?' + param;
                        new PNotify({
                            addclass: "stack-bottomright",
                            text: text.preparing_download
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
}
