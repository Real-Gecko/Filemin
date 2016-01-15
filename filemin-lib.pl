# filemin-lib.pl

BEGIN { push(@INC, ".."); };
use WebminCore;
&init_config();
use Encode qw(decode encode);
use File::Basename;
use POSIX;

=begin
%libraries = (
    'jquery' => {
        'order' => 1,
        'files' => ['jquery.min.js']
    },
    'jquery-ui' => {
        'order' => 2,
        'files' => ['jquery-ui.min.js', 'jquery-ui.min.css']
    },
    'bootstrap' => {
        'order' => 3,
        'files' => ['js/bootstrap.min.js', 'css/bootstrap.min.css']
    }
);
=cut

if ($current_theme eq 'authentic-theme' or $current_theme eq 'bootstrap') {
    @libraries = (
        {
            'name' => 'jquery.contextMenu',
            'files' => ['jquery.contextMenu.min.js', 'jquery.contextMenu.min.css']
        },
        {
            'name' => 'bootstrap-msg',
            'files' => ['bootstrap-msg.min.js', 'bootstrap-msg.min.css']
        },

    );
} else {
    @libraries = (
        {
            'name' => 'jquery',
            'files' => ['jquery.min.js']
        },
#        {
#            'name' => 'jquery-ui',
#            'files' => ['jquery-ui.min.js', 'jquery-ui.min.css']
#        },
        {
            'name' => 'bootstrap',
            'files' => ['js/bootstrap.min.js', 'css/bootstrap.min.css', 'css/bootstrap-theme.min.css']
        },
        {
            'name' => 'jquery.contextMenu',
            'files' => ['jquery.contextMenu.min.js', 'jquery.contextMenu.min.css']
        },
        {
            'name' => 'fontawesome',
            'files' => ['css/font-awesome.min.css']
        },
        {
            'name' => 'bootstrap-msg',
            'files' => ['bootstrap-msg.min.js', 'bootstrap-msg.min.css']
        },
#        {
#            'name' => 'bootstrap3-editable',
#            'files' => ['js/bootstrap-editable.min.js', 'css/bootstrap-editable.css']
#        },
        {
            'name' => 'datatables',
            'files' => [
                'js/jquery.dataTables.min.js',
                'css/jquery.dataTables.min.css',
                'js/dataTables.bootstrap.min.js',
                'css/dataTables.bootstrap.min.css'
            ]
        },
    );
}

sub get_paths {
    %access = &get_module_acl();

    # Switch to the correct user
    if (&get_product_name() eq 'usermin') {
        # In Usermin, the module only ever runs as the connected user
        &switch_to_remote_user();
        &create_user_config_dirs();
    }
    elsif ($access{'work_as_root'}) {
        # Root user, so no switching
        @remote_user_info = getpwnam('root');
    }
    elsif ($access{'work_as_user'}) {
        # A specific user
        @remote_user_info = getpwnam($access{'work_as_user'});
        @remote_user_info ||
            &error("Unix user $access{'work_as_user'} does not exist!");
        &switch_to_unix_user(\@remote_user_info);
    }
    else {
        # The Webmin user we are connected as
        &switch_to_remote_user();
    }

    # Get and check allowed paths
    @allowed_paths = split(/\s+/, $access{'allowed_paths'});
    if (&get_product_name() eq 'usermin') {
        # Add paths from Usermin config
        push(@allowed_paths, split(/\t+/, $config{'allowed_paths'}));
    }
    if($remote_user_info[0] eq 'root' || $allowed_paths[0] eq '$ROOT') {
        # Assume any directory can be accessed
        $base = "/";
        @allowed_paths = ( $base );
    } else {
        @allowed_paths = map { $_ eq '$HOME' ? @remote_user_info[7] : $_ }
                             @allowed_paths;
        @allowed_paths = map { s/\$USER/$remote_user/g; $_ } @allowed_paths;
        if (scalar(@allowed_paths == 1)) {
            $base = $allowed_paths[0];
        } else {
            $base = '/';
        }
    }
    $path = $in{'path'} ? $in{'path'} : '';
    $path = &simplify_path($path);
    $cwd = &simplify_path($base.$path);

    # Work out max upload size
    if (&get_product_name() eq 'usermin') {
        $upload_max = $config{'max'};
    } else {
        $upload_max = $access{'max'};
    }

    # Check that current directory is one of those that is allowed
    my $error = 1;
    for $allowed_path (@allowed_paths) {
        if (&is_under_directory($allowed_path, $cwd) ||
            $allowed_path =~ /^$cwd/) {
            $error = 0;
        }
    }
    if ($error) {
        &error(&text('notallowed', &html_escape($cwd),
                                   &html_escape(join(" , ", @allowed_paths))));
    }

    if (index($cwd, $base) == -1)
    {
        $cwd = $base;
    }

    # Initiate per user config
    $confdir = "$remote_user_info[7]/.filemin";
    if(!-e "$confdir/.config") {
        &read_file_cached("$module_root_directory/defaultuconf", \%userconfig);
    } else {
        &read_file_cached("$confdir/.config", \%userconfig);
    }
}

sub print_template {
    $template_name = @_[0];
    if (open(my $fh, '<:encoding(UTF-8)', $template_name)) {
      while (my $row = <$fh>) {
        print (eval "qq($row)");
      }
    } else {
      print "$text{'error_load_template'} '$template_name' $!";
    }
}

sub print_errors {
    my @errors = @_;
    &ui_print_header(undef, "Filemin", "");
    print $text{'errors_occured'};
    print "<ul>";
    foreach $error(@errors) {
        print("<li>$error</li>");
    }
    print "<ul>";
    &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
}

sub print_interface {
    # Some vars for "upload" functionality
    local $upid = time().$$;
    local @remote_user_info = getpwnam($remote_user);
    local $uid = @remote_user_info[2];
    $bookmarks = get_bookmarks();
    @allowed_for_edit = split(/\s+/, $access{'allowed_for_edit'});
    %allowed_for_edit = map { $_ => 1} @allowed_for_edit;

    # Set icons variables
    $edit_icon = "<i class='fa fa-edit' alt='$text{'edit'}'></i>";
    $rename_icon = "<i class='fa fa-font' title='$text{'rename'}'></i>";
    $extract_icon = "<i class='fa fa-external-link' alt='$text{'extract_archive'}'></i>";
    $goto_icon = "<i class='fa fa-arrow-right' alt='$text{'goto_folder'}'></i>";

    # Add static files
    print "<script type=\"text/javascript\" src=\"unauthenticated/js/main.js\"></script>";
    print "<script type=\"text/javascript\" src=\"unauthenticated/js/chmod-calculator.js\"></script>";
    print "<script type=\"text/javascript\" src=\"unauthenticated/js/bootstrap-hover-dropdown.min.js\"></script>";
    print "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
    init_datatables();

    # Set "root" icon
    if($base eq '/') {
        $root_icon = "<i class='fa fa-hdd-o'></i>";
    } else {
        $root_icon = "<i class='fa fa-user text-light'></i>";
    }

    # Breadcrumbs
    print "<ol data-placement='right' data-content='editable %)' data-toggle='popover' data-trigger='hover' class='breadcrumb pull-left context-menu-one'><li><a href='index.cgi?path='>$root_icon</a></li>";
    my @breadcr = split('/', $path);
    my $cp = '';
    for(my $i = 1; $i <= scalar(@breadcr)-1; $i++) {
        chomp($breadcr[$i]);
        $cp = $cp.'/'.$breadcr[$i];
        print "<li><a href='index.cgi?path=$cp'>".
              &html_escape($breadcr[$i])."</a></li>";
    }
    print "</ol>";
    print_template('unauthenticated/templates/path-edit-form.html');

    # Menu
    print_template("unauthenticated/templates/menu.html");

    # Hidden dialogs
    print_template("unauthenticated/templates/dialogs.html");
    print "<div class='total'>" . &text('info_total', scalar @files, scalar @folders) . "</div>";

    # Render current directory entries
    print &ui_form_start("", "post", undef, "id='list_form' name='list'");
    @ui_columns = (
            '<input id="select-unselect" type="checkbox" onclick="selectUnselect(this)" />',
            ''
        );
    push @ui_columns, $text{'name'};
    push @ui_columns, $text{'type'} if($userconfig{'columns'} =~ /type/);
#    push @ui_columns, $text{'actions'};
    push @ui_columns, $text{'size'} if($userconfig{'columns'} =~ /size/);
    push @ui_columns, $text{'owner_user'} if($userconfig{'columns'} =~ /owner_user/);
    push @ui_columns, $text{'permissions'} if($userconfig{'columns'} =~ /permissions/);
    push @ui_columns, $text{'last_mod_time'} if($userconfig{'columns'} =~ /last_mod_time/);

    print &ui_columns_start2(\@ui_columns);
    foreach $item (@list) {
        my $link = $item->[0];
        $link =~ s/\Q$cwd\E\///;
        $link =~ s/^\///g;
        $vlink = html_escape($link);
        $vlink = quote_escape($vlink);
        $vlink = decode('UTF-8', $vlink, Encode::FB_CROAK);
        $path = html_escape($path);
        $vpath = quote_escape($vpath);
        $vpath = decode('UTF-8', $vpath, Encode::FB_CROAK);

        my $type = $item->[14];
        $type =~ s/\//\-/g;
        my $img = "images/icons/mime/$type.png";
        unless (-e $img) { $img = "images/icons/mime/unknown.png"; }
        $size = &nice_size($item->[8]);
        $user = getpwuid($item->[5]) ? getpwuid($item->[5]) : $item->[5];
        $group = getgrgid($item->[6]) ? getgrgid($item->[6]) : $item->[6];
        $permissions = sprintf("%04o", $item->[3] & 07777);
        $mod_time = POSIX::strftime('%Y/%m/%d - %T', localtime($item->[10]));

        print "<script>";
        print "var text_extract = '$text{'extract_archive'}';";
        print "var text_edit = '$text{'edit_file'}';";
        print "var text_rename = '$text{'rename'}';";
        print "var text_copy = '$text{'copy_selected'}';";
        print "var text_cut = '$text{'cut_selected'}';";
        print "var text_delete = '$text{'delete'}';";
        print "var text_paste = '$text{'paste'}';";
        print "var text_properties = '$text{'properties'}';";
        print "var text_select_all = '$text{'select_all'}';";
        print "var text_select_none = '$text{'select_none'}';";
        print "var text_invert_selection = '$text{'invert_selection'}';";
        print "var path = '$path';";
        print "</script>";

        $actions = "<a class='action-link' href='javascript:void(0)' onclick='renameDialog(\"$vlink\")' title='$text{'rename'}' data-container='body'>$rename_icon</a>";

        if ($item->[15] == 1) {
            $href = "index.cgi?path=".&urlize("$path/$link");
        } else {
            $href = "download.cgi?file=".&urlize($link)."&path=".&urlize($path);
            if($0 =~ /search.cgi/) {
                ($fname,$fpath,$fsuffix) = fileparse($item->[0]);
                if($base ne '/') {
                    $fpath =~ s/^\Q$base\E//g;
                }
                $actions = "$actions<a class='action-link' ".
                           "href='index.cgi?path=".&urlize($fpath)."' ".
                           "title='$text{'goto_folder'}'>$goto_icon</a>";
            }
            # Enable "Edit" link for allowed mimetypes
            if (
                index($type, "text-") != -1 or
                exists($allowed_for_edit{$type})
            ) {
#                $actions = "$actions <a class='action-link' href='edit_file.cgi?file=".&urlize($link)."&path=".&urlize($path)."' title='$text{'edit'}' data-container='body'>$edit_icon</a>";
                $actions = "edit"
            }
            if (index($type, "zip") != -1 or index($type, "compressed") != -1) {
#                $actions = "$actions <a class='action-link' href='extract.cgi?path=".&urlize($path)."&file=".&urlize($link)."' title='$text{'extract_archive'}' data-container='body'>$extract_icon</a>";
                $actions = "extract"
            }
        }
        @row_data = (
            "<a href='$href'><img src=\"$img\"></a><span class='actions'>$actions</span>",
            "<a href=\"$href\" data-filemin-path=\"$href\">$vlink</a>"
        );
        push @row_data, $type if($userconfig{'columns'} =~ /type/);
#        push @row_data, undef;
        push @row_data, $size if($userconfig{'columns'} =~ /size/);
        push @row_data, $user.':'.$group if($userconfig{'columns'} =~ /owner_user/);
        push @row_data, $permissions if($userconfig{'columns'} =~ /permissions/);
        push @row_data, $mod_time if($userconfig{'columns'} =~ /last_mod_time/);

        print ui_checked_columns_row2(\@row_data, undef, "name", $link);
    }
    print ui_columns_end2();
    print &ui_hidden("path", $path),"\n";
    print &ui_form_end();
}

sub init_datatables {
    my ($a, $b, $c);
    $a = '0, 1, 3';
    $b = '4';
    $c = '';
    if ($userconfig{'columns'} =~ /type/) {
        $a = '0, 1, 4';
        $b = '5';
    }
    if ($userconfig{'columns'} =~ /size/) {
        $c = '{ "type": "file-size", "targets": [' . $b . '] },';
    }

    if($userconfig{'disable_pagination'}) {
        $bPaginate = 'false';
    } else {
        $bPaginate = 'true';
    }
print "<script>";
print "\$( document ).ready(function() {";
print "\$.fn.dataTableExt.sErrMode = 'throw';";
print "\$('#list-table').dataTable({";
print "\"order\": [],";
print "\"aaSorting\": [],";
print "\"bDestroy\": true,";
print "\"bPaginate\": $bPaginate,";
print " \"fnDrawCallback\": function(oSettings) {
        if (oSettings.fnRecordsTotal() <= oSettings._iDisplayLength) {
            \$('.dataTables_paginate').hide();
        } else {
            \$('.dataTables_paginate').show();
        }
    },";
print " \"initComplete\": function() {
        \$('div.dataTables_filter input').val('').trigger('keyup');
        \$('div.dataTables_filter input').focus();
        \$(document).on('keydown', function (event) {
            var keycode = event.keyCode ? event.keyCode : event.which;
            if (!\$('input').is(':focus') && !\$('select').is(':focus') && !\$('textarea').is(':focus')) {
                if (keycode === 39) {
                    \$('.paginate_button.next').trigger('click');
                }
                if (keycode === 37) {
                    \$('.paginate_button.previous').trigger('click');
                }
            }
        });
    },";
print "\"bInfo\": false,";
print "\"destroy\": true,";
print "\"oLanguage\": {";
print "\"sSearch\": \" \"";
print "},";
print "\"columnDefs\": [ { \"orderable\": false, \"targets\": [$a] }, $c ],";
print "\"bStateSave\": true,";
print "\"iDisplayLength\": 50,";
print "});";
print "\$(\"form\").on('click', 'div.popover', function() {";
print "\$(this).prev('input').popover('hide');";
print "});";
print "});";
print "</script>";
}

sub get_bookmarks {
    $confdir = "$remote_user_info[7]/.filemin";
    if(!-e "$confdir/.bookmarks") {
        return "<li><a>$text{'no_bookmarks'}</a></li>";
    }
    my $bookmarks = &read_file_lines($confdir.'/.bookmarks', 1);
    $result = '';
    foreach $bookmark(@$bookmarks) {
        $result.= "<li><a href='index.cgi?path=$bookmark'>".
                  &html_escape($bookmark)."</a><li>";
    }
    return $result;
}

# get_paste_buffer_file()
# Returns the location of the file for temporary copy/paste state
sub get_paste_buffer_file
{
    if (&get_product_name() eq 'usermin') {
        return $user_module_config_directory."/.buffer";
    }
    else {
        my $tmpdir = "$remote_user_info[7]/.filemin";
        &make_dir($tmpdir, 0700) if (!-d $tmpdir);
        return $tmpdir."/.buffer";
    }
}

sub ui_checked_columns_row2
{
my ($cols, $tdtags, $checkname, $checkvalue, $checked, $disabled, $tags) = @_;
my $rv;
$rv .= "<tr class='ui_checked_columns'>\n";
$rv .= "<td class='ui_checked_checkbox' ".$tdtags->[0].">".
       &ui_checkbox($checkname, $checkvalue, undef, $checked, $tags, $disabled).
       "</td>\n";
my $i;
for($i=0; $i<@$cols; $i++) {
    $rv .= "<td ".$tdtags->[$i+1].">";
    if ($cols->[$i] !~ /<a\s+href|<input|<select|<textarea/) {
        $rv .= "<label for=\"".
            &quote_escape("${checkname}_${checkvalue}")."\">";
    }
    $rv .= ($cols->[$i] !~ /\S/ ? "<br>" : $cols->[$i]);
    if ($cols->[$i] !~ /<a\s+href|<input|<select|<textarea/) {
    $rv .= "</label>";
    }
    $rv .= "</td>\n";
    }
$rv .= "</tr>\n";
return $rv;
}

sub ui_columns_start2
{
my ($heads, $width, $noborder, $tdtags, $title) = @_;
my $rv;
$rv .= "<table id='list-table'".($noborder ? "" : " border").
    (defined($width) ? " width=$width%" : "")." class='table table-striped table-condensed no-footer'>\n";
if ($title) {
    $rv .= "<tr".($tb ? " ".$tb : "")." class='ui_columns_heading'>".
           "<td colspan=".scalar(@$heads)."><b>$title</b></td></tr>\n";
    }
$rv .= "<thead>";
$rv .= "<tr".($tb ? " ".$tb : "")." class='ui_columns_heads'>\n";
my $i;
for($i=0; $i<@$heads; $i++) {
    $rv .= "<th ".$tdtags->[$i].">".
           ($heads->[$i] eq "" ? "<br>" : $heads->[$i])."</th>\n";
    }
$rv .= "</tr>\n";
$rv .= "</thead>\n";
$rv .= "<tbody>";
return $rv;
}

sub ui_columns_end2
{
return "</tbody></table>\n";
}

sub print_ajax_header {
    print "Content-Security-Policy: script-src 'self' 'unsafe-inline'; frame-src 'self'\n";
    print "Content-type: application/json; Charset=utf-8\n\n";
}

1;

