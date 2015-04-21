window.onload = function() {
    var rows = document.getElementsByClassName('ui_checked_columns');
    for(var i = 0; i < rows.length; i++) {
        rows[i].onclick = function() { rowClick(this) };
    }
}

function countUploads(files) {
    document.getElementById('info').innerHTML = files.files.length + ' file(s) selected for upload ';
    return true;
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

function compressSelected() {
    var filename = prompt("Name of archive","");
    if (filename != null && filename != "") {
        document.forms['list_form'].action = "compress.cgi?arch=" + filename;
        document.forms['list_form'].submit();
    }
}

function removeSelected() {
    if (confirm("Do you really want to delete selected items?")) {
        document.forms['list_form'].action = "delete.cgi";
        document.forms['list_form'].submit();
    }
}

function chmodSelected() {
    var perms = prompt("New permissions","");
    if (perms != null && perms != "") {
        document.forms['list_form'].action = "chmod.cgi?perms=" + perms;
        document.forms['list_form'].submit();
    }
}

function chownSelected() {
    var owner = prompt("New owner","");
    if (owner != null && owner != "") {
        document.forms['list_form'].action = "chown.cgi?owner=" + owner;
        document.forms['list_form'].submit();
    }
}

function renameSelected(file, path) {
    var name = prompt("New name ", "");
    if (name != null && name != "") {
        this.document.location.href="rename.cgi?name=" + name + "&file=" + file + "&path=" + path;
    }
}

function copySelected() {
    document.forms['list_form'].action = "copy.cgi";
    document.forms['list_form'].submit();
}

function cutSelected() {
    document.forms['list_form'].action = "cut.cgi";
    document.forms['list_form'].submit();
}

function browseForUpload() {
    var files = document.getElementById('upfiles');
    files.click();
    return true;
}

function uploadFiles() {
    document.forms['upload-form'].submit();
    return true;
}

function createFolder(path) {
    var name = prompt("Name of the new directory","");
    if (name != null && name != "") {
        this.document.location.href="create_folder.cgi?path=" + path + "&name=" + name;
    }
}

function createFile(path) {
    var name = prompt("Name of the new file","");
    if (name != null && name != "") {
        this.document.location.href="create_file.cgi?path=" + path + "&action=newfile&name=" + name;
    }
}

function downFromUrl(path) {
    var link = prompt("URL of remote file","");
    if (link != null && link != "")
    {
        this.document.location.href="http_download.cgi?path=" + path + "&link=" + link;
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
