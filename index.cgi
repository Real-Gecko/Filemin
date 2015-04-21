#!/usr/bin/perl
# File manager written in perl

#$unsafe_index_cgi = 1;
require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use POSIX;
use File::Basename;

&switch_to_remote_user();

&ReadParse();

get_paths();

&ui_print_header(undef, "Filemin", "");

$head = "<link rel=\"stylesheet\" type=\"text/css\" href=\"images/css/style.css\" />";
$head .= "<script type=\"text/javascript\" src=\"images/js/main.js\"></script>";

print $head;

unless (opendir ( DIR, $cwd )) {
  die "Error in opening dir $cwd $!";
}

@list = readdir(DIR);
closedir(DIR);
@list = sort(@list);

#remove '.' and '..' from file list
#shift(@list);
#shift(@list);

#breadcrumbs
print "<div id='bread' style='float: left; padding-bottom: 2px;'><a href='?path='>~</a> / ";
my @breadcr = split('/', $path);
my $cp = '';
for(my $i = 1; $i <= scalar(@breadcr)-1; $i++) {
    chomp($breadcr[$i]);
    $cp = $cp.'/'.$breadcr[$i];
    print "<a href='?path=$cp'>$breadcr[$i]</a> / ";
}
print "<br />";

#pages
#my $page = param('page');
my $page = $in{'page'};
my $pagelimit = 50;
my $pages = ceil((scalar(@list)-2)/$pagelimit);
if (not defined $page or $page > $pages) { $page = 1; }
print "Pages: ";
for(my $i = 1;$i <= $pages;$i++) {
    if($page eq $i) {
        print "<a class='active' href='?path=$path&page=$i'>$i</a> ";
    } else {
        print "<a href='?path=$path&page=$i'>$i</a> ";
    }
}
print "</div>";

#upload form and ui links
print <<"HTML";
<div style="float: left; visibility: hidden; width: 0; height: 0;">
<form id='upload-form' method='post' action='upload.cgi' enctype='multipart/form-data'>
<input type='file' id='upfiles' name='upfiles' multiple onchange='countUploads(this)'>
<input type='hidden' name='path' value='$path'>
<input type='submit' name="button" value="Upload Files">
</form>
</div>
<div id="quicks" style="float:right">
<a href="javascript:void(0)" onclick='selectAll()' title="$text{'select_all'}"><img src='images/quick/select-all.png' alt="$text{'select_all'}" /></a>
<a href="javascript:void(0)" onclick='invertSelection()' title="$text{'invert_selection'}"><img src='images/quick/invert.png' alt="$text{'invert_selection'}" /></a>
<a href="javascript:void(0)" onclick='copySelected()' title="$text{'copy_selected'}"><img src='images/quick/edit-copy.png' alt="$text{'copy_selected'}" /></a>
<a href="javascript:void(0)" onclick='cutSelected()' title='Cut Selected'><img src='images/quick/edit-cut.png' alt="$text{'cut_selected'}" /></a>
<a href='paste.cgi?path=$path' title="$text{'paste'}"><img src='images/quick/edit-paste.png' alt="$text{'paste'}" /></a>
<a href="javascript:void(0)" onclick='createFolder(\"$path\")' title="$text{'create_folder'}"><img src='images/quick/folder-new.png' alt="$text{'create_folder'}" /></a>
<a href="javascript:void(0)" onclick='createFile(\"$path\")' title="$text{'create_file'}"><img src='images/quick/document-new.png' alt="$text{'create_file'}" /></a>
<a href="javascript:void(0)" onclick='compressSelected()' title="$text{'compress_selected'}"><img src='images/quick/compress.png' alt="$text{'compress_selected'}" /></a>
<a href="javascript:void(0)" onclick='chmodSelected()' title="$text{'chmod_selected'}"><img src='images/quick/chmod.png' alt="$text{'chmod_selected'}" /></a>
<a href="javascript:void(0)" onclick='chownSelected()' title="$text{'chown_selected'}"><img src='images/quick/chown.png' alt="$text{'chown_selected'}" /></a>
<a href="javascript:void(0)" onclick='removeSelected()' title="$text{'remove_selected'}"><img src='images/quick/remove.png' alt="$text{'remove_selected'}" /></a>
<a href="javascript:void(0)" onclick='browseForUpload()' title="$text{'browse_for_upload'}"><img src='images/quick/browse.png' alt="$text{'browse_for_upload'}" /></a>
<a href="javascript:void(0)" onclick='uploadFiles()' title="$text{'upload_files'}"><img src='images/quick/upload.png' alt="$text{'upload_files'}" /></a>
<a href="javascript:void(0)" onclick='downFromUrl(\"$path\")' title="$text{'get_from_url'}"><img src='images/quick/from-url.png' alt="$text{'get_from_url'}" /></a>
</div>
<div id="info" style="float:right"></div>
HTML

print &ui_form_start("", "post", undef, "id='list_form'");
print &ui_columns_start(
    [
        '<input id="select-unselect" type="checkbox" onclick="selectUnselect(this)" />',
        '',
        $text{'name'},
        $text{'type'},
        $text{'actions'},
        $text{'size'},
        $text{'owner_user'},
        $text{'owner_group'},
        $text{'permissions'},
        $text{'last_mod_time'}
    ]
);
 use Encode qw(decode encode);
#foreach $link (@list) {
for(my $count = 3+$pagelimit*($page-1);$count <= $pagelimit+2+$pagelimit*($page-1);$count++) {
    if ($count > scalar(@list)) { last; }
    my $class = $count & 1 ? "odd" : "even";
    my $link = $list[$count - 1];
    my $file = $cwd.'/'.$link;
    $link = html_escape($link);
    $link = quote_escape($link);
    $link = decode('UTF-8', $link, Encode::FB_CROAK);
    $path = html_escape($path);
    $path = quote_escape($path);
    $path = decode('UTF-8', $path, Encode::FB_CROAK);

    my $type = mimetype($file);
    $type =~ s/\//\-/g;
    my $img = "images/mime/$type.png";
    unless (-e $img) { $img = "images/mime/unknown.png"; }
    my $size = (stat($file))[7];
    $size = &nice_size($size);
    $user = getpwuid((stat($file))[4]);
    $group = getgrgid((stat($file))[5]);
    $permissions = sprintf("%03o", (stat($file))[2] & 00777);
    $mod_time = POSIX::strftime('%a, %d %b %Y %T', localtime((stat($file))[9]));

    $actions = "<a href='javascript:void(0)' onclick='renameSelected(\"$link\", \"$path\")' title='$text{'rename'}'><img src='images/quick/rename.png' alt='$text{'rename'}'/></a>";

    stat($file);
    if (-d _) {
        $href="?path=".$path.'/'.$link;
    }
    if (-f _) {
        $href="download.cgi?file=$link&path=$path";
        (my $name, my $dir, my $ext) = fileparse($file, qr/\.[^.]*/);
        if (
            index($type, "text-") != -1 or
            $type eq "application-x-php" or
            $type eq "application-x-ruby" or
            $type eq "application-xml" or
            $type eq "application-javascript" or
            $type eq "application-x-shellscript"
        ) {
            $actions = "$actions<a href='edit_file.cgi?file=$link&path=$path' title='$text{'edit'}'><img src='images/quick/edit.png' alt='$text{'edit'}' /></a>";
        }
        if (index($type, "zip") != -1 or index($type, "compressed") != -1) {
            $actions = "$actions <a href='extract.cgi?path=$path&file=$link' title='$text{'extract_archive'}'><img src='images/quick/extract.png' alt='$text{'extract_archive'}' /></a> ";
        }
    }

    print &ui_checked_columns_row([
        "<a href='$href'><img src=\"$img\"></a>",
        "<a href=\"$href\">$link</a>",
        $type,
        $actions,
        $size,
        $user,
        $group,
        $permissions,
        $mod_time
        ], "class='lalaila' onClick='rowClick(this)'", "name", $link);
}
print ui_columns_end();
print &ui_links_row(\@links);
print &ui_hidden("path", $path),"\n";
print &ui_form_end();

print &ui_form_end();

&ui_print_footer("/", $text{'index'});
