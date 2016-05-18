/*jshint multistr: true */
/*--------------------------------------*/
    /* Primary Filemin object */
    var Filemin = function() {
        var _self = this;
        this.tabs = [];
        this.tabcounter = 0;
        this.activeTab = function() {
            var id = $('#tabs-control').find('li.active a').attr('href');
            var ix = this.tabs.map(function(x) {return x.id; }).indexOf(id);
            return this.tabs[ix];
        };
        this.getTab = function(id) {
            var ix = this.tabs.map(function(x) {return x.id; }).indexOf(id);
            return this.tabs[ix];
        };
        this.delTab = function(id) {
            var ix = this.tabs.map(function(x) {return x.id; }).indexOf(id);
            if(ix >= 0) {
                this.tabs.splice(ix, 1);
            }
        };
        this.listTableOptions = {
            classes: 'table table-condensed table-hover table-no-bordered',
            search: true,
            showColumns: true,
            showPaginationSwitch: true,
            clickToSelect: true,
            maintainSelected: true,
            cookie: true,
//            cookieIdTable: 'listTable' + Math.random(),
            selectItemName: 'name',
            striped: 'true',
            minimumCountColumns: 0,
            height: $(window).height() - 158,
            /* Some locale changes */
            formatSearch: function() { return text.table_Search; },
            formatNoMatches: function() { return text.table_NoMatches; },
            /* ------------------- */
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
                        if(row.symlink) {
                            if(row.symlink == 'broken') {
                                img = 'broken';
                            }
                            return '<img src="images/icons/mime/' + img + '.png" class="pull-left"> <span class="name-column-link" rel="tooltip" title="' + row.link_target + '">' + escapeHTML(value) + '</span>';
                        } else {
                            return '<img src="images/icons/mime/' + img + '.png" class="pull-left"> <span class="name-column-link">' + escapeHTML(value) + '</span>';
                        }
                    },
                    events: {
                        'click .name-column-link': function(e, value, row, index) {
                            var id = '#' + $(this).parents('.filemin-tab').attr('id');
                            var tab = _self.getTab(id);
                            if(row.symlink == 'broken') {
                                showError(null, text.broken_symlink);
                            } else
                            if(row.directory) {
                                $(this).parents('.list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tab.path + '/' + row.name)});
                            } else
                            if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target)) {
                                editFile(tab.path, row.name, ++_self.tabcounter);
                            } else
                            if(row.type.indexOf('image') > -1 || row.link_target_mime.indexOf('image') > -1) {
                                viewImage(tab.path, row.name);
                            } else
                            if(row.archive){
                                listArchive(tab.path, row.name);
                            } else {
                                downloadSingle(tab.path, row.name);
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
            onCheckAll: function() {
                var tab = _self.activeTab();
                $(tab.id + ' .list-table').find('tr[data-index]').addClass('selected');
            },
            onUncheckAll: function() {
                var tab = _self.activeTab();
                $(tab.id + ' .list-table').find('tr.selected').removeClass('selected');
            },
            onContextMenuRow: function(row, $el) { /* Highlight clicked row if no rows selected */
                var tab = _self.activeTab();
                if(!checkSelected(tab)) {
                    $($el).addClass('success');
                }
            },
            responseHandler: function(response) {
                var data = this.data;
                if(response.error) {
                    showError(null, response.error)
                    return data;
                } else {
                    _self.updateTab(this, response);
                    return response;
                }
            },
            onLoadError: function(status, res) {
                new PNotify({
                    icon: "fa fa-exclamation-circle",
                    type: 'error',
                    'title': text.error_title,
                    'text': status + ' ' + res
                });
            },
            contextMenu: '#context-menu',
            beforeContextMenuRow: function(e, row) {
                var $table = $(this).closest('.list-table');
                var $tab = $($table).closest('.filemin-tab');
                var id = $tab.attr('id');
                var tab = _self.getTab(id);
                var index = ($(e.currentTarget).data("index"));
                if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target) || row.symlink) {
                    $('#context-menu [ data-item="edit" ]').show();
                } else {
                    $('#context-menu [ data-item="edit" ]').hide();
                }
                if(row.archive) {
                    $('#context-menu [ data-item="extract" ]').show();
                } else {
                    $('#context-menu [ data-item="extract" ]').hide();
                }
                if(row.type.indexOf('image') > -1 || row.link_target_mime.indexOf('image') > -1) {
                    $('#context-menu [ data-item="view" ]').show();
                } else {
                    $('#context-menu [ data-item="view" ]').hide();
                }
                $table.bootstrapTable('showContextMenu', { event: e } )
                .off('contextmenu-item.bs.table')
                .on('contextmenu-item.bs.table', function(ev, row, $el) {
                    var tab = _self.activeTab();
                    $(tab.id + ' .list-table').find('.success').removeClass('success');
                    switch($el.data("item")) {
                        case "rename":
                            rename(tab, row.name);
                            break;
                        case "view":
                            viewImage(tab.path, row.name);
                            break;
                        case "edit":
                            if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target)) { // Check for editable once more, just in case :D
                                editFile(tab.path, row.name, ++_self.tabcounter);
                            } else if(row.symlink) {
                                editSymlink(tab, row);
                            }
                            break;
                        case "extract":
                            extract(tab, row.name);
                            break;
                        case "create_file":
                            createFile(tab);
                            break;
                        case "create_folder":
                            createFolder(tab);
                            break;
                        case "copy_selected":
                            copySelected(tab, row.name);
                            break;
                        case "cut_selected":
                            cutSelected(tab, row.name);
                            break;
                        case "paste":
                            paste(tab);
                            break;
                        case "symlink":
                            pasteSymlink(tab);
                            break;
                        case "select_all":
                            $(this).bootstrapTable('checkAll');
                            break;
                        case "select_none":
                            $(this).bootstrapTable('uncheckAll');
                            break;
                        case "select_inverse":
                            $(this).bootstrapTable('checkInvert');
                            break;
                        case "properties":
                            changeProperties(tab, row);
                            break;
                        case "get_sizes":
                            var notice = showWait(text.notice_take_while);
                            $(this).bootstrapTable('refresh', { url: 'list.cgi?path=' + filemin.activeTab().path + '&sizes=1'})
                            .on('load-success.bs.table load-error.bs.table', function() {
                                notice.remove();
                            });
                            break;
                        case "chmod_selected":
                            chmodSelected(tab, row);
                            break;
                        case "chown_selected":
                            chownSelected(tab, row);
                            break;
                        case "compress_selected":
                            compressSelected(tab, row);
                            break;
                        case "download_selected":
                            downloadSelected(tab, row);
                            break;
                        case "search":
                            search(tab.path);
                            break;
                        case "delete":
                            deleteSelected(tab, row.name);
                            break;
                    }
                });
                return false;
            }
        };

        this.searchTableOptions = {
            cookie: false,
            formatNoMatches: function() { return text.table_search_NoMatches; },
            columns: [ {
                    checkbox: true
                }, {
                    field: 'name',
                    title: text.name,
                    switchable: false,
                    sortable: true,
                    width: '740px',
                    class: 'column-field-name',
                    formatter: function(value, row, index) {
                        var img = row.type.replace("/", "-");
                        if(row.symlink) {
                            if(row.symlink == 'broken') {
                                img = 'broken';
                            }
                            return '<img src="images/icons/mime/' + img + '.png" class="pull-left"> <span class="name-column-link" rel="tooltip" title="' + row.link_target + '">' + value + '</span>';
                        } else {
                            return '<img src="images/icons/mime/' + img + '.png" class="pull-left"> <span class="name-column-link">' + value + '</span>';
                        }
                    },
                    events: {
                        'click .name-column-link': function(e, value, row, index) {
                            var id = '#' + $(this).parents('.filemin-tab').attr('id');
                            var tab = _self.getTab(id);
                            var path = row.name.split('/')
                            var name = path.pop();
                            path = tab.path + '/' + path.join('/');
                            if(row.symlink == 'broken') {
                                showError(null, text.broken_symlink);
                            } else
                            if(row.directory) {
                                _self.newTab('navigator', tab.path + '/' + row.name);
                                $('#tabs-control a:last').tab('show');
                            } else
                            if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target)) {
                                editFile(path, name, ++_self.counter);
                            } else 
                            if(row.type.indexOf('image') > -1 || row.link_target_mime.indexOf('image') > -1) {
                                viewImage(path, name);
                            } else
                            if(row.archive){
                                listArchive(path, name);
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
            responseHandler: function(response) {
                var data = this.data;
                if(response.error) {
                    showError(null, response.error)
                    return data;
                } else {
                    _self.updateTab(this, response);
                    return response;
                }
            },
            contextMenu: '#context-menu-search',
            beforeContextMenuRow: function(e, row) {
                var $table = $(this).closest('.list-table');
                var $tab = $($table).closest('.filemin-tab');
                var id = $tab.attr('id');
                var tab = _self.getTab(id);
                var index = ($(e.currentTarget).data("index"));
                if(!row.directory) {
                    $('#context-menu-search [ data-item="open_containing"]').show();
                    $('#context-menu-search [ data-item="open_folder"]').hide();
                } else {
                    $('#context-menu-search [ data-item="open_containing"]').hide();
                    $('#context-menu-search [ data-item="open_folder"]').show();
                }
                if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target)) {
                    $('#context-menu-search [ data-item="edit" ]').show();
                } else {
                    $('#context-menu-search [ data-item="edit" ]').hide();
                }
                if(row.type.indexOf('image') > -1 || row.link_target_mime.indexOf('image') > -1) {
                    $('#context-menu-search [ data-item="view" ]').show();
                } else {
                    $('#context-menu-search [ data-item="view" ]').hide();
                }
                $table.bootstrapTable('showContextMenu', { event: e } )
                .off('contextmenu-item.bs.table')
                .on('contextmenu-item.bs.table', function(ev, row, $el) {
                    var tab = _self.activeTab();
                    $(tab.id + ' .list-table').find('.success').removeClass('success');
                    var path = row.name.split('/')
                    var name = path.pop();
                    path = tab.path + '/' + path.join('/');
                    switch($el.data("item")) {
                        case "view":
                            viewImage(path, name);
                            break;
                        case "edit":
                            if(isEditable(row.type, row.name) || isEditable(row.link_target_mime, row.link_target)) {
                                editFile(path, name, ++_self.counter);
                            }
                            break;
                        case "copy_selected":
                            copySelected(tab, row.name);
                            break;
                        case "cut_selected":
                            cutSelected(tab, row.name);
                            break;
                        case "select_all":
                            $(this).bootstrapTable('checkAll');
                            break;
                        case "select_none":
                            $(this).bootstrapTable('uncheckAll');
                            break;
                        case "select_inverse":
                            $(this).bootstrapTable('checkInvert');
                            break;
                        case "chmod_selected":
                            chmodSelected(tab, row);
                            break;
                        case "chown_selected":
                            chownSelected(tab, row);
                            break;
                        case "open_containing":
                            _self.newTab('navigator', path);
                            $('#tabs-control a:last').tab('show');
                            break;
                        case "open_folder":
                            _self.newTab('navigator', path);
                            $('#tabs-control a:last').tab('show');
                            break;
                    }
                });
                return false;
            }
        };
    };
    
    Filemin.prototype.newTab = function(type, path, cookieId) {
        this.tabcounter++;
        id = '#' + type + '-' + this.tabcounter;
        if(cookieId === undefined) {
            cookieId = 'listTable' + Math.random();
        }
        var icon;
        switch(type){
            case 'navigator':
                icon = 'fa-folder-open-o';
                break;
            case 'search':
                icon = 'fa-search';
                break;
        }
        $('#tabs-control').append(
            $('<li class="tab"><a class="closable" data-toggle="tab" href="' + id + '"><i class="fa ' + icon + '"></i> ' +
            '<span class="tab-title"></span>' +
            ' <button class="btn btn-xs btn-warning close-tab pull-right" type="button" ' +
            'title="' + text.close_tab + '"><i class="fa fa-close"></i></button>' +
            '</a></li>')
        );
        $('#tabs-container').append(
            $('\
                <div class="tab-pane fade filemin-tab" id="' + id.substring(1) + '">\
                </div>'
            )
        );

        $('#tabs-container ' + id).append('\
            <div class="filemin-table pull-left">\
                <ol class="breadcrumb pull-left">\
                    <li><a>' + root_icon + '</a></li>\
                </ol>\
                <button type="button" class="btn btn-default path-edit"><i class="fa fa-edit"></i></button>\
                <table class="list-table"></table>\
            </div>\
        ');

        var tab = {
            id: id,
            path: path ? path : "",
            type: type,
            cookieId: cookieId,
            stats: {
                total: 0,
                files: 0,
                dirs: 0,
                size: ""
            }
        };

        this.tabs.push(tab);
        switch(type) {
            case 'navigator':
                var options = $.extend(
                    {},
                    this.listTableOptions,
                    {
                        toolbar: tab.id + ' .breadcrumb',
                        cookieIdTable: cookieId
                    }
                );
                if(path === undefined) {
                    $.extend(true, options, {url: 'list.cgi'});
                } else {
                    $.extend(true, options, {url: 'list.cgi?path=' + encodeURIComponent(path)});
                }
                $(tab.id + ' .list-table').bootstrapTable(options);
                break;
            case 'search':
                var searchOptions = $.extend(true, {}, this.listTableOptions);
                $.extend(true, searchOptions, this.searchTableOptions);
                searchOptions.url = path;
                searchOptions.toolbar = tab.id + ' .breadcrumb',
                $(tab.id + ' .list-table').bootstrapTable(searchOptions);
//                $('#tabs-container ' + id + ' .breadcrumb li').addClass("disabled");
                $('#tabs-control a:last').tab('show');
                break;
        }
        return tab;
    };

    Filemin.prototype.getTabsByPath = function(path) {
        var result = [];
        for(i = 0; i < this.tabs.length; i++) {
            if(this.tabs[i].path == path) {
                result.push(this.tabs[i]);
            }
        }
        return result;
    };

    Filemin.prototype.updateTab = function(table, data) {
        var id = table.toolbar.split(" ")[0];
        var path = getQueryPathParam(table.url);
        var tab = $('#tabs-control').find('a[href="' + id + '"]');
        var ix = this.tabs.map(function(x) {return x.id; }).indexOf(id);
        this.tabs[ix].path = path;
        this.tabs[ix].stats = countStats(data);

        // Update breadcrumb
        ol = $(id).find('.breadcrumb');
        ol.children().slice(1).remove();
        var li = path.split('/');
        $.each(li.slice(1), function(index, value) {
            ol.append('<li><a>' + escapeHTML(value) + '</a></li>');
        });

        // Update tree
        if(this.tabs[ix].type == 'navigator') {
            data = data.filter(function(item){ return item.directory; });
            var treedata = data.map(function(item) {
                return {
                    title: escapeHTML(item.name),
                    key: path + '/' + item.name,
                    folder: true
                };
            });
            var tree = $('#filemin-tree .tree').data("ui-fancytree").getTree();
            var node;i
            var parts = path.split('/').slice(1);
            var curPart = '';
            var p = path;
            if(parts.length > 0) {
                $.each(parts, function(index, value) {
                    curPart = '/' + parts.slice(0, parts.length - index).join('/');
                    node = tree.getNodeByKey(curPart);
                    if(node !== null) {
                        p = p.replace(curPart, '');
                        parts = p.split('/').slice(1);
                        $.each(parts, function(index, value) {
                            var child;
                            curPart += '/' + value;
                            child = node.addChildren([{
                                title: escapeHTML(value),
                                key: curPart,
                                folder: true
                            }]);
                            node.sortChildren();
                            node = child;
                        });
                        return false;
                    }
                });
            }
    
            if(node === null || node === undefined) {
                node = tree.getRootNode();
            }
    
            /* Check existent folders */
            for(i = 0; i < treedata.length; i++) {
                if(tree.getNodeByKey(treedata[i].key) === null) {
                    node.addChildren(treedata[i]);
                }
            }
    
            /* Remove inexistent folders */
            var toDelete = [];
            $.each(node.getChildren(), function(index, value) {
                var ix = treedata.map(function(x) {return x.key; }).indexOf(value.key);
                if(ix < 0) {
                    toDelete.push(value);
                }
            });
            $.each(toDelete, function(index, value){
                node.removeChild(value);
            });
    
            node.sortChildren();
            if(!node.isRootNode()) {
                node.setActive(true, {noEvents: true});
                node.makeVisible();
                node.setExpanded(true, {noAnimation: true});
            }
        }
        /* Setup tab tooltip */
        $(tab).children('.tab-title').html(escapeHTML(li[li.length -1]));
        $(tab).attr('data-original-title', escapeHTML(path)).tooltip({trigger: 'hover', placement: 'bottom', html: true});

        /* Update bottom panel */
        $('#bottom-stats').html(
            text.toolbar_files + ': ' + this.tabs[ix].stats.files + ' | ' +
            text.toolbar_folders + ': ' + this.tabs[ix].stats.dirs + ' | ' +
            text.toolbar_total + ': ' + this.tabs[ix].stats.total + ' | ' +
            this.tabs[ix].stats.size
        );
    };
/*--------------------------------------*/

/* Initialize coooool stuff */
$(document).ready( function () {
    /* Set some defaults */
    CodeMirror.modeURL = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.11.0/mode/%N/%N.min.js";
    var stack_bottomright = {"dir1": "up", "dir2": "left", "firstpos1": 10, "firstpos2": 10};

    PNotify.prototype.options.stack = stack_bottomright;
    PNotify.prototype.options.styling = "brighttheme";
    PNotify.prototype.options.delay = 4000;
    PNotify.prototype.options.addclass = "stack-bottomright filemin";

    filemin = new Filemin();

    /* Initialize tree */
    $('#filemin-tree .tree').fancytree({
        source: [],
        extensions: ['glyph', 'filter'],
        glyph: {
            map: {
                folder: "fa fa-folder-o",
                folderOpen: "fa fa-folder-open-o",
                expanderClosed: "fa  fa-caret-right",
                expanderOpen: "fa  fa-caret-down"
            }
        },
        filter: {
            fuzzy: false,
            highlight: false,
            mode: "hide"
        },
        toggleEffect: false,
        activate: function(event, data) {
            if(!data.node.isRootNode()) {
                $(filemin.activeTab().id).find('.list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(data.node.key)});
            }
        }
    });
    
    /* Make it resizable */
    $('#filemin-tree').resizable({
        handles: 'e',
        minWidth: 55,
        maxWidth: 500
    });

    $('ul.fancytree-container').height($(window).height() - 214);

    /* Load session */
    $.get("load_session.cgi")
    .done(function(response) {
        if(!response.error) {
            showSuccess(null, text.session_loaded);
            var tree = $('#filemin-tree .tree').fancytree('getTree');
            var root = tree.getRootNode();
            root.addChildren(response.tree);
            $.each(response.tabs, function(index, tab){
                filemin.newTab('navigator', tab.path, tab.cookieId);
            });
        } else {
            showNotice(null, text.no_session_found)
            filemin.newTab('navigator');
        }
        $('#tabs-control a:last').tab('show');
    }).fail(function(jqx, text, e) {
        showError(text.error_title, text);
    });

    /* Breadcrumb click */
    $('#tabs-container').on('click', '.breadcrumb > li > a', function() {
        var id = $(this).closest('.filemin-tab').attr('id');
        if(id.indexOf('search') == -1) {
            var $li = $(this).parent();
            var $ol = $li.parent();
            var ix = $li.index();
            var path = '';
            $.each($ol.children().find('a').slice(1, ix + 1), function(index, element) {
                path += '/' + element.textContent;
            });
            var tab = filemin.activeTab();
            $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path)});
        }
    });

    /* Main menu */
    $('#main-menu').on('click', 'a', function() {
        if($(this).parent().hasClass('disabled')) {
            return false;
        }
        var tab = filemin.activeTab();
        switch($(this).data("item")) {
            case "upload_files":
                $('#fileupload').click();
                break;
            case "get_from_url":
                getFromUrl(tab);
                break;
            case "create_file":
                createFile(tab);
                break;
            case "create_folder":
                createFolder(tab);
                break;
            case "copy_selected":
                copySelected(tab);
                break;
            case "cut_selected":
                cutSelected(tab);
                break;
            case "paste":
                paste(tab);
                break;
            case "symlink":
                pasteSymlink(tab);
                break;
            case "get_sizes":
                var $table = $(tab.id + ' .list-table'); 
                var notice = showWait(text.notice_take_while);
                $table.bootstrapTable('refresh', { url: 'list.cgi?path=' + tab.path + '&sizes=1'})
                .on('load-success.bs.table load-error.bs.table', function(){
                    notice.remove();
                });
                break;
            case "chmod_selected":
                if(checkSelected(tab)) {
                    chmodSelected(tab);
                }
                break;
            case "chown_selected":
                if(checkSelected(tab)) {
                    chownSelected(tab);
                }
                break;
            case "compress_selected":
                if(checkSelected(tab)) {
                    compressSelected(tab);
                }
                break;
            case "search":
                search(tab.path);
                break;
            case "bookmark":
                bookmark(tab);
                break;
            case "manage_bookmarks":
                manageBookmarks();
                break;
            case "goto":
                $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent($(this).text()) });
                break;
        }
    });

    /* Initialize upload library */
    $('#fileupload').fileupload({
        dataType: 'json',
        done: function (e, data) {
            var tabs = filemin.getTabsByPath(data.path);
            for(i = 0; i < tabs.length; i++) {
                if(tabs[i].path == data.path) {
                    $(tabs[i].id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tabs[i].path) });
                }
            }

            data.tracker.get().find('div.progress').hide();
            if(data.result.error) {
                waitToError(data.tracker, null, data.result.error);
            } else if(data.result.success) {
                waitToSuccess(data.tracker, text.upload_success, data.files[0].name);
            }
        },
        fail: function(e, data) {
            data.tracker.get().find('div.progress').hide();
            if(data.errorThrown == 'abort') {
                waitToNotice(data.tracker, text.upload_cancelled, data.files[0].name);
            } else {
                waitToError(data.tracker, text.error_title, data.textStatus);
            }
            var tabs = filemin.getTabsByPath(data.path);
            for(i = 0; i < tabs.length; i++) {
                if(tabs[i].path == data.path) {
                    $(tabs[i].id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(tabs[i].path) });
                }
            }
        },
        add: function(e, data) {
            var tab = filemin.activeTab();
            $.post("check_exists.cgi", {
                'path': tab.path,
                'name': data.files[0].name
            }).done(function(response) {
                if(response.exists) {
                    if(response.directory) {
                        showNotice(text.warning_title, data.files[0].name + ' ' + text.error_exists_and_dir);
                    } else {
                        (new PNotify({
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
                            data.url = 'upload.cgi?path=' + encodeURIComponent(tab.path);
                            data.url += '&overwrite=1';
                            data.hJQX = data.submit();
                        });
                    }
                } else {
                    data.url = 'upload.cgi?path=' + encodeURIComponent(tab.path);
                    data.hJQX = data.submit();
                }
            }).fail(function(jqx, text, e) {
                showError(null, text);
            });
        },
        submit: function(e, data) {
            data.path = filemin.activeTab().path;
            data.tracker = new PNotify({
                title: text.uploading + ' ' + data.files[0].name,
                text: '\
                <div class="progress active" style="margin:0">\
                    <div class="progress-bar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
                        <span class="sr-only">0%</span>\
                    </div>\
                </div><p></p>\
                <button class="btn btn-xs btn-warning pull-right">' + text.dialog_cancel + '</button>',
                icon: 'fa fa-spinner fa-spin',
                hide: false,
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                },
                after_init: function(notice) {
                    notice.elem.on('click', 'button', function() {
                        data.hJQX.abort();
                    });
                }
            });
        },
        progress: function(e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            data.tracker.get().find('div.progress-bar').css('width', progress + '%');
            data.tracker.get().find('div.progress-bar').html(progress + '% ' + (data.bitrate/(8192*1024)).toFixed(2) + 'MB/s');
        }
    });
    
    /* Close tab*/
    $('#tabs-control').on('click', ' li a .close-tab', function() {
        var sender = this;
        var tabId = $(this).parents('li').children('a').attr('href');
        var li = $(this).parents('li');
        var ix = $(this).parents('ul').children('li').index(li);
        ix = ix < 2 ? 2 : ix;
        if($(this).hasClass('btn-danger')) {
            bootbox.dialog({
                title: text.file_not_saved,
                message: text.really_close,
                buttons: {
                    save: {
                        label: text.save_close,
                        className: "btn-success",
                        callback: function() {
                            var form = $('#tabs-container ' + tabId + ' form[name="edit-file"]')[0];
                            form.data.value = form.editor.getValue();
                            var data = $(form).serializeArray();
                            var notice = showWait(text.notice_saving);
                            $.post("save_file.cgi", data)
                            .done(function(response) {
                                if(response.success) {
                                    waitToSuccess(notice, text.saved_successfully, form.name.value);
                                    var tabs = filemin.getTabsByPath(form.path.value);
                                    var url = 'list.cgi?path=' + encodeURIComponent(form.path.value);
                                    for(i = 0; i < tabs.length; i++) {
                                        if(tabs[i].path == form.path.value) {
                                            $(tabs[i].id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(form.path.value) });
                                        }
                                    }
                                    $(sender).parents('li').remove('li');
                                    $(tabId).remove();
                                    $($('#tabs-control a')[ix - 1]).tab('show');
                                } else {
                                    waitToError(notice, text.error_title, response.error)
                                }
                                var id = $(sender).parents('.filemin-tab').attr('id');
                                $('a[href="#' + id + '"]').find('button').removeClass('btn-danger').addClass('btn-success');
                            }).fail(function(jqx, text, e) {
                                waitToError(text.error_title, text);
                            });
                        }
                    },
                    close: {
                        label: text.close_tab,
                        className: "btn-danger",
                        callback: function() {
                            $(sender).parents('li').remove('li');
                            $(tabId).remove();
                            $($('#tabs-control a')[ix - 1]).tab('show');
                        }
                    },
                    cancel: {
                        label: text.dialog_cancel,
                        className: "btn-primary pull-right"
                    }
                }
            });
        } else {
            $(this).parents('li').remove('li');
            $(tabId).remove();
            $($('#tabs-control a')[ix - 1]).tab('show');
            filemin.delTab(tabId);
        }
        if($('#tabs-control li').length == 1) {
            var $bottomPanel = $('#bottom-panel');
            $bottomPanel.hide("slide", { direction: "down" }, 100);
            var $treePane = $('#filemin-tree');
            $treePane.hide("slide", { direction: "left" }, 100);
        }
    });

    /* Save da failo */
    $('#tabs-container').on('click', 'form[name="edit-file"] button[name="save"]', function(e) {
        e.preventDefault();
        var sender = $(this)[0];
        var form = sender.form;
        form.data.value = form.editor.getValue();
        var data = $(form).serializeArray();
        var notice = showWait(text.notice_saving);
        $.post("save_file.cgi", data)
        .done(function(response) {
            notice.remove();
            if(response.success) {
                waitToSuccess(notice, text.saved_successfully, form.name.value)
                var tabs = filemin.getTabsByPath(form.path.value);
                var url = 'list.cgi?path=' + encodeURIComponent(form.path.value);
                for(i = 0; i < tabs.length; i++) {
                    if(tabs[i].path == form.path.value) {
                        $(tabs[i].id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(form.path.value) });
                    }
                }
            } else {
                waitToError(notice, text.error_title, response.error)
            }
            var id = $(sender).parents('.filemin-tab').attr('id');
            $('a[href="#' + id + '"]').find('button').removeClass('btn-danger').addClass('btn-success');
        }).fail(function(jqx, text, e) {
            waitToError(notice, null, text);
        });
    });

    /* Reload da failo*/
    $('#tabs-container').on('click', 'form[name="edit-file"] button[name="reload"]', function(e) {
        e.preventDefault();
        var notice = showWait(text.table_LoadingMessage);
        var sender = $(this)[0];
        var form = sender.form;
        $.ajax({
            url: "get_file_contents.cgi?path=" + encodeURIComponent(form.path.value) +
            "&name=" + encodeURIComponent(form.name.value),
            dataType: 'text',
            type: 'GET',
            async: true,
        })
        .done(function(response) {
            form.data.value = response;
            form.editor.setValue(response);
            var tabId = '#' + $(sender).parents('.filemin-tab').attr('id');
            $('a[href="' + tabId + '"]').find('button').removeClass('btn-danger').addClass('btn-success');
            notice.remove();
        }).fail(function(jqx, text, e) {
            waitToError(notice, null, text);
        });
    });
    
    /* Path editing */
    $(document).on('click', '.path-edit', function() {
        $(this).popover({
            html : true,
            trigger: 'manual',
            content: function() { return '\
                <div class="input-group">\
                    <input id="path" type="text" class="form-control input-sm" value="' + filemin.activeTab().path + '">\
                    <span class="input-group-btn">\
                        <button id="go" class="btn btn-success btn-sm" type="button"><i class="fa fa-check"></i></button>\
                    </span>\
                </div>';
            }
        });
        $(this).popover('toggle');
        $('#path').focus();
    });

    $(document).on('click', '#go', function() {
        var path = $('#path').val();
        if(path.substr(-1) === '/') {
            path = path.substr(0, path.length - 1);
        }
        $('.path-edit').popover('hide');
        var tab = filemin.activeTab();
        $(tab.id + ' .list-table').bootstrapTable('refresh', { url: 'list.cgi?path=' + encodeURIComponent(path) });
    });

    $(document).on("keydown", "#path", function(event) {
        if ( event.which == 13 ) {
            $('#go').click();
        }
        event.stopPropagation();
    });

    /* $.on('show/hide') snippet */
    $.each(['show', 'hide'], function (i, ev) {
        var el = $.fn[ev];
        $.fn[ev] = function () {
            this.trigger(ev);
            return el.apply(this, arguments);
        };
    });

    /* Remove row highlighting on menu close */
    $('#context-menu').on('hide', function () {
        var tab = filemin.activeTab();
        $(tab.id + ' .list-table').find('.success').removeClass('success');
    });

    $('#context-menu-search').on('hide', function () {
        var tab = filemin.activeTab();
        $(tab.id + ' .list-table').find('.success').removeClass('success');
    });

    $('#new-tab').click(function (e) {
        var tab = filemin.newTab('navigator');
        $('#tabs-control a:last').tab('show');
        // var w = $('.container-fluid').width();
    });
    
    /* Symlinks tooltip */
    $("body").tooltip({   
        selector: "[rel='tooltip']",
        placement: 'right',
        container: "body"
    });

    /* Perform some UI manipulations on tab switch */
    $(document).on('a[data-toggle="tab"] shown.bs.tab', function(e) {
        panelResize(e);
    });
});

/* Resizables */
$(document).on('resize', '#filemin-tree', function(ev, ui) {
    var $treePane = ui.element;
    var $tabsPane = $('#tabs-container');
    var w = $('.container-fluid').width();
    $tabsPane.width(w - $treePane.outerWidth(true));
    $tabsPane.find('.list-table').bootstrapTable('resetView');
});

/* Tree filtering */
$(document).on("keyup", "input[name='tree-filter']", function(e){
    var match = $(this).val();
    var tree = $('#filemin-tree .tree').fancytree('getTree');
    if(e && e.which === $.ui.keyCode.ESCAPE || $.trim(match) === "") {
        $("input[name='tree-filter']").val("");
        tree.clearFilter();
        return;
    }
    if(match === "") {
        tree.clearFilter();
    } else {
        tree.filterNodes(match, {});
    }
});

/* Tree filter reset */
$(document).on("click", "button[name='reset-tree-filter']", function(e) {
    var tree = $('#filemin-tree .tree').fancytree('getTree');
    $("input[name='tree-filter']").val("");
    tree.clearFilter();
});

/* Hide tree */
$(document).on("click", "#hide-tree", function(e) {
    if($(this).hasClass("disabled")) {
        return false;
    }
    var $treePane = $('#filemin-tree');
    var $tabsPane = $('#tabs-container');
    var w = $('.container-fluid').width();
    if($treePane.is(':hidden')) {
        $tabsPane.width(w - $treePane.outerWidth(true));
        $tabsPane.find('.list-table').bootstrapTable('resetView');
    }
    $treePane.toggle("slide", { direction: "left" }, 100, function() {
        if($treePane.is(':hidden')) {
            $tabsPane.width(w);
        }
        $tabsPane.find('.list-table').bootstrapTable('resetView');
    });
    var value = $(this).attr("value") === "true" ? true : false;
    $(this).attr("value", !value);
});

/* Collapse all */
$(document).on("click", "#close-all", function(e) {
    var tree = $('#filemin-tree .tree').fancytree('getTree');
    $('#filemin-tree .tree').fancytree("getRootNode").visit(function(node){
        node.setExpanded(false);
    });
});

/* Expand all */
$(document).on("click", "#open-all", function(e) {
    var tree = $('#filemin-tree .tree').fancytree('getTree');
    $('#filemin-tree .tree').fancytree("getRootNode").visit(function(node){
        node.setExpanded(true);
    });
});

/* Bootbox forms 0x0D dirty hack */
$(document).on("keydown", ".bootbox.modal input", function(event) {
    if (event.which == 13) {
        $(".bootbox button[data-bb-handler='confirm']").trigger('click');
        event.preventDefault();
    }
});

/* Save session */
$(window).on('beforeunload', function() {
    var tree = $('#filemin-tree .tree').fancytree('getTree');
    var tabs = [];
    $.each(filemin.tabs, function(index, tab) {
        if(tab.type == 'navigator') {
            tabs.push(tab);
        }
    });
    $.ajax({
        type: 'POST',
        async: false,
        url: 'save_session.cgi',
        data: {
            data: JSON.stringify({
                'tabs': tabs,
                'tree': tree.toDict()
            })
        }
    });
});

var resizeId;
$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(panelResize, 300);
});
 
function panelResize(e) {
    var target;
    if (e !== undefined) {
        target = $(e.target).attr("href");
    } else {
        target = $('#tabs-control .active a').attr("href");
    }
    var $treePane = $('#filemin-tree');
    var $tabsPane = $('#tabs-container');
    var $bottomPanel = $('#bottom-panel');
    var w = $('.container-fluid').width();
    var h = $('body').height() - 158;
    var tab = filemin.activeTab();
    switch(true) {
        case /editor/.test(target):
            disableForEdit();
            $bottomPanel.hide("slide", { direction: "down" }, 100);
            $treePane.hide("slide", { direction: "left" }, 100);
            $tabsPane.width(w);
            $(target + ' .CodeMirror').height($(window).height() - 163);
            break;
        case /search/.test(target):
            disableForSearch();
            $('#hide-tree').addClass('disabled');
            $bottomPanel.show("slide", { direction: "down" }, 100);
            $treePane.hide("slide", { direction: "left" }, 100, function() {
                $tabsPane.width(w);
                $(target + ' .filemin-table').height(h);
                $(target + ' .filemin-table .list-table').bootstrapTable('resetView', {height: h});
            });
            $('#bottom-stats').html(
                text.toolbar_files + ': ' + tab.stats.files + ' | ' +
                text.toolbar_folders + ': ' + tab.stats.dirs + ' | ' +
                text.toolbar_total + ': ' + tab.stats.total + ' | ' +
                tab.stats.size
            );
            break;
        case /navigator/.test(target):
            $('#main-menu .nav li').removeClass('disabled');
            $('#hide-tree').removeClass('disabled');
            $bottomPanel.show("slide", { direction: "down" }, 100);
            if($('#hide-tree').attr('value') == "false") {
                $tabsPane.width(w - $treePane.outerWidth(true));
                $('ul.fancytree-container').height($(window).height() - 214);
                $(target + ' .filemin-table').height(h);
                $(target + ' .filemin-table .list-table').bootstrapTable('resetView', {height: h});
                $treePane.show("slide", { direction: "left" }, 100);
                var tree = $('#filemin-tree .tree').data("ui-fancytree").getTree();
                var key = tab.path;
                var node = tree.getNodeByKey(key);
                if(node !== null) {
                    node.setActive(true, {noEvents: true});
                    node.makeVisible();
                    node.setExpanded(true, {noAnimation: true});
                }
            } else {
                $tabsPane.width(w);
                $(target + ' .filemin-table').height(h);
                $(target + ' .filemin-table .list-table').bootstrapTable('resetView', {height: h});
            }
            $('#bottom-stats').html(
                text.toolbar_files + ': ' + tab.stats.files + ' | ' +
                text.toolbar_folders + ': ' + tab.stats.dirs + ' | ' +
                text.toolbar_total + ': ' + tab.stats.total + ' | ' +
                tab.stats.size
            );
            break;
    }
}
