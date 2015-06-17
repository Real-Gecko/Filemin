# filemin-lib.pl

BEGIN { push(@INC, ".."); };
use WebminCore;
use Cwd 'abs_path';
use Encode qw(decode encode);

sub get_paths {
    &init_config();
    %access = &get_module_acl();

    &switch_to_remote_user();
    # Not sure if it is really necessary, could not reproduce "User with no $HOME" scenario.
    if(!defined $remote_user_info[7]) {
        &error('You`re not supposed to be here!');
    }

    @allowed_paths = split(/\s+/, $access{'allowed_paths'});
    if($remote_user_info[0] eq 'root' || $allowed_paths[0] eq '$ROOT') {
        $base = "/";
    } else {
        @allowed_paths = map {$_ eq '$HOME' ? @remote_user_info[7] : $_} @allowed_paths;
        if (scalar(@allowed_paths == 1)) {
            $base = $allowed_paths[0];
        } else {
            $base = '/';
        }
    }
    $path = $in{'path'} ? $in{'path'} : '';
    $cwd = abs_path($base.$path);
    my $error = 1;
    for $allowed_path (@allowed_paths) {
        if ($allowed_path =~ /^$cwd/ || $cwd =~ /^$allowed_path/) {
            $error = 0;
        }
    }
    if ($error) {
        &error('You`re not supposed to be here!');
    }
    if (index($cwd, $base) == -1)
    {
        $cwd = $base;
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

    if ($current_theme eq 'authentic-theme' or $current_theme eq 'bootstrap') {
        # Interface for Bootstrap 3 powered themes
        # Set icons variables
        $edit_icon = "<i class='fa fa-edit' alt='$text{'edit'}'></i>";
        $rename_icon = "<i class='fa fa-font' title='$text{'rename'}'></i>";
        $extract_icon = "<i class='fa fa-external-link' alt='$text{'extract_archive'}'></i>";
        # Add static files
        print "<script type=\"text/javascript\" src=\"unauthenticated/js/main.js\"></script>";
        print "<script type=\"text/javascript\" src=\"unauthenticated/js/chmod-calculator.js\"></script>";
        print "<script type=\"text/javascript\" src=\"unauthenticated/js/dataTables.bootstrap.js\"></script>";
        print "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
        print "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/dataTables.bootstrap.css\" />";
        # Set "root" icon
        if($base eq '/') {
            $root_icon = "<i class='fa fa-hdd-o'></i>";
        } else {
            $root_icon = "~";
        }
        # Breadcrumbs
        print "<ol class='breadcrumb pull-left'><li><a href='?path='>$root_icon</a></li>";
        my @breadcr = split('/', $path);
        my $cp = '';
        for(my $i = 1; $i <= scalar(@breadcr)-1; $i++) {
            chomp($breadcr[$i]);
            $cp = $cp.'/'.$breadcr[$i];
            print "<li><a href='?path=$cp'>$breadcr[$i]</a></li>";
        }
        print "</ol>";
        # And toolbar
        print_template("unauthenticated/templates/quicks.html");
        $page = 1;
        $pagelimit = 9000;
        print_template("unauthenticated/templates/dialogs.html");
    } else {
        # Interface for legacy themes
        # Set icons variables
        $edit_icon = "<img src='images/icons/quick/edit.png' alt='$text{'edit'}' />";
        $rename_icon = "<img src='images/icons/quick/rename.png' alt='$text{'rename'}' />";
        $extract_icon = "<img src='images/icons/quick/extract.png' alt='$text{'extract_archive'}' />";
        # Add static files
        $head = "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
        $head.= "<script type=\"text/javascript\" src=\"unauthenticated/jquery/jquery.min.js\"></script>";
        $head.= "<script type=\"text/javascript\" src=\"unauthenticated/jquery/jquery-ui.min.js\"></script>";
        $head.= "<script type=\"text/javascript\" src=\"unauthenticated/js/legacy.js\"></script>";
        $head.= "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/jquery/jquery-ui.min.css\" />";
        $head.= "<script type=\"text/javascript\" src=\"unauthenticated/js/chmod-calculator.js\"></script>";
        print $head;
        # Set "root" icon
        if($base eq '/') {
            $root_icon = "<img src=\"images/icons/quick/drive-harddisk.png\" class=\"hdd-icon\" />";
        } else {
            $root_icon = "~";
        }
        # Legacy breadcrumbs
        print "<div id='bread' style='float: left; padding-bottom: 2px;'><a href='?path='>$root_icon</a> / ";
        my @breadcr = split('/', $path);
        my $cp = '';
        for(my $i = 1; $i <= scalar(@breadcr)-1; $i++) {
            chomp($breadcr[$i]);
            $cp = $cp.'/'.$breadcr[$i];
            print "<a href='?path=$cp'>$breadcr[$i]</a> / ";
        }
        print "<br />";
        # And pagination
        $page = $in{'page'};
        $pagelimit = 50;
        $pages = ceil((scalar(@list))/$pagelimit);
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
        # And toolbar
        print_template("unauthenticated/templates/legacy_quicks.html");
        print_template("unauthenticated/templates/legacy_dialogs.html");
    }

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
            $text{'permissions'},
            $text{'last_mod_time'}
        ]
    );
    #foreach $link (@list) {
    for(my $count = 1 + $pagelimit*($page-1);$count <= $pagelimit+$pagelimit*($page-1);$count++) {
        if ($count > scalar(@list)) { last; }
        my $class = $count & 1 ? "odd" : "even";
        my $link = $list[$count - 1][0];
        $link =~ s/$cwd\///;
        $link =~ s/^\///g;
        $link = html_escape($link);
        $link = quote_escape($link);
        $link = decode('UTF-8', $link, Encode::FB_CROAK);
        $path = html_escape($path);
        $path = quote_escape($path);
        $path = decode('UTF-8', $path, Encode::FB_CROAK);

        my $type = $list[$count - 1][14];
        $type =~ s/\//\-/g;
        my $img = "images/icons/mime/$type.png";
        unless (-e $img) { $img = "images/icons/mime/unknown.png"; }
        $size = &nice_size($list[$count - 1][8]);
        $user = getpwuid($list[$count - 1][5]);
        $group = getgrgid($list[$count - 1][6]);
        $permissions = sprintf("%04o", $list[$count - 1][3] & 07777);
        $mod_time = POSIX::strftime('%Y/%m/%d - %T', localtime($list[$count - 1][10]));

        $actions = "<a href='javascript:void(0)' onclick='renameDialog(\"$link\")' title='$text{'rename'}' data-container='body'>$rename_icon</a>";

        if ($list[$count - 1][14] eq 'inode/directory') {
            $href="?path=".$path.'/'.$link;
        } else {
            $href="download.cgi?file=$link&path=$path";
            if (
                index($type, "text-") != -1 or
                $type eq "application-x-php" or
                $type eq "application-x-ruby" or
                $type eq "application-xml" or
                $type eq "application-javascript" or
                $type eq "application-x-shellscript" or
                $type eq "application-x-perl"
            ) {
                $actions = "$actions<a href='edit_file.cgi?file=$link&path=$path' title='$text{'edit'}' data-container='body'>$edit_icon</a>";
            }
            if (index($type, "zip") != -1 or index($type, "compressed") != -1) {
                $actions = "$actions <a href='extract.cgi?path=$path&file=$link' title='$text{'extract_archive'}' data-container='body'>$extract_icon</a> ";
            }
        }

        print &ui_checked_columns_row([
            "<a href='$href'><img src=\"$img\"></a>",
            "<a href=\"$href\">$link</a>",
            $type,
            $actions,
            $size,
            $user.':'.$group,
            $permissions,
            $mod_time
            ], "", "name", $link);
    }
    print ui_columns_end();
    print &ui_hidden("path", $path),"\n";
    print &ui_form_end();
}

1;

