# filemin-lib.pl

BEGIN { push(@INC, ".."); };
use WebminCore;
use Cwd 'abs_path';
use Encode qw(decode encode);

&init_config();

sub get_paths {
    local @uinfo = getpwnam($remote_user);
    #not sure if it is really necessary, could not reproduce "User with no $HOME" scenario.
    if(!defined $uinfo[7]) {
        print_errors('You`re not supposed to be here!');
        exit();
    }
    if($uinfo[0] eq 'root') {
        $base = "/";
    } else {
#        $base = $uinfo[7] ? $uinfo[7] : "/home";
        $base = $uinfo[7];
    }
#    $home = $uinfo[7] ? $uinfo[7] : "/home";
    $path = $in{'path'} ? $in{'path'} : '';
    $cwd = abs_path($base.$path);
    if (index($cwd, $base) == -1)
    {
        $cwd = $base;
    }
}

sub print_legacy_interface {
    $head = "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
    $head.= "<script type=\"text/javascript\" src=\"unauthenticated/jquery/jquery.min.js\"></script>";
    $head.= "<script type=\"text/javascript\" src=\"unauthenticated/jquery/jquery-ui.min.js\"></script>";
    $head.= "<script type=\"text/javascript\" src=\"unauthenticated/js/legacy.js\"></script>";
    $head.= "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/jquery/jquery-ui.min.css\" />";
    $head.= "<script type=\"text/javascript\" src=\"unauthenticated/js/chmod-calculator.js\"></script>";

#    $head.= "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/jquery/jquery-ui.theme.min.css\" />";

    print $head;

    if($base eq '/') {
        $root_icon = "<img src=\"images/icons/quick/drive-harddisk.png\" class=\"hdd-icon\" />";
    } else {
        $root_icon = "~";
    }
    
    #breadcrumbs
    print "<div id='bread' style='float: left; padding-bottom: 2px;'><a href='?path='>$root_icon</a> / ";
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
    my $pages = ceil((scalar(@list))/$pagelimit);
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

    print_template("unauthenticated/templates/legacy_quicks.html");
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
#            $text{'owner_group'},
            $text{'permissions'},
            $text{'last_mod_time'}
        ]
    );
     use Encode qw(decode encode);
    #foreach $link (@list) {
    for(my $count = 1 + $pagelimit*($page-1);$count <= $pagelimit+$pagelimit*($page-1);$count++) {
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
        my $img = "images/icons/mime/$type.png";
        unless (-e $img) { $img = "images/icons/mime/unknown.png"; }
        my $size = (stat($file))[7];
        $size = &nice_size($size);
        $user = getpwuid((stat($file))[4]);
        $group = getgrgid((stat($file))[5]);
        $permissions = sprintf("%04o", (stat($file))[2] & 07777);
#        $mod_time = POSIX::strftime('%a, %d %b %Y %T', localtime((stat($file))[9]));
        $mod_time = POSIX::strftime('%Y/%m/%d - %T', localtime((stat($file))[9]));

        $actions = "<a href='javascript:void(0)' onclick='renameDialog(\"$link\")' title='$text{'rename'}'><img src='images/icons/quick/rename.png' alt='$text{'rename'}'/></a>";

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
                $type eq "application-x-shellscript" or
                $type eq "application-x-perl"
            ) {
                $actions = "$actions<a href='edit_file.cgi?file=$link&path=$path' title='$text{'edit'}'><img src='images/icons/quick/edit.png' alt='$text{'edit'}' /></a>";
            }
            if (index($type, "zip") != -1 or index($type, "compressed") != -1) {
                $actions = "$actions <a href='extract.cgi?path=$path&file=$link' title='$text{'extract_archive'}'><img src='images/icons/quick/extract.png' alt='$text{'extract_archive'}' /></a> ";
            }
        }

        print &ui_checked_columns_row([
            "<a href='$href'><img src=\"$img\"></a>",
            "<a href=\"$href\">$link</a>",
            $type,
            $actions,
            $size,
            $user.':'.$group,
 #           $group,
            $permissions,
            $mod_time
            ], "", "name", $link);
    }
    print ui_columns_end();
    print &ui_links_row(\@links);
    print &ui_hidden("path", $path),"\n";
    print &ui_form_end();

    print &ui_form_end();
    print_template("unauthenticated/templates/legacy_dialogs.html");
}

sub print_interface {    
    if($base eq '/') {
        $root_icon = "<i class='fa fa-hdd-o'></i>";
    } else {
        $root_icon = "~";
    }
    
    print "<ol class='breadcrumb pull-left'><li><a href='?path='>$root_icon</a></li>";
    my @breadcr = split('/', $path);
    my $cp = '';
    for(my $i = 1; $i <= scalar(@breadcr)-1; $i++) {
        chomp($breadcr[$i]);
        $cp = $cp.'/'.$breadcr[$i];
        print "<li><a href='?path=$cp'>$breadcr[$i]</a></li>";
    }
    print "</ol>";    

    print_template("unauthenticated/templates/quicks.html");
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
#            $text{'owner_group'},
            $text{'permissions'},
            $text{'last_mod_time'}
        ]
    );
    foreach $link (@list) {
        my $file = $cwd.'/'.$link;
        $link = html_escape($link);
        $link = quote_escape($link);
        $link = decode('UTF-8', $link, Encode::FB_CROAK);
        $path = html_escape($path);
        $path = quote_escape($path);
        $path = decode('UTF-8', $path, Encode::FB_CROAK);

        my $type = mimetype($file);
        $type =~ s/\//\-/g;
        my $img = "images/icons/mime/$type.png";
        unless (-e $img) { $img = "images/icons/mime/unknown.png"; }
        my $size = (stat($file))[7];
        $size = &nice_size($size);
        $user = getpwuid((stat($file))[4]);
        $group = getgrgid((stat($file))[5]);
        $permissions = sprintf("%04o", (stat($file))[2] & 07777);
#        $mod_time = POSIX::strftime('%a, %d %b %Y %T', localtime((stat($file))[9]));
        $mod_time = POSIX::strftime('%Y/%m/%d - %T', localtime((stat($file))[9]));

        $actions = "<div class='btn-group btn-group-lg'><a href='javascript:void(0)' onclick='renameDialog(\"$link\")' title='$text{'rename'}' data-container='body'><i class='fa fa-font' title='$text{'rename'}'></i></a>";

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
                $type eq "application-x-shellscript" or
                $type eq "application-x-perl"
            ) {
                $actions = "$actions <a href='edit_file.cgi?file=$link&path=$path' title='$text{'edit'}' data-container='body'><i class='fa fa-edit' alt='$text{'edit'}'></i></a>";
            }
            if (index($type, "zip") != -1 or index($type, "compressed") != -1) {
                $actions = "$actions <a href='extract.cgi?path=$path&file=$link' title='$text{'extract_archive'}' data-container='body'><i class='fa fa-external-link' alt='$text{'extract_archive'}'></i></a> ";
            }
        }
        $actions = "$actions</div>";

        print &ui_checked_columns_row([
            "<a href='$href'><img src=\"$img\"></a>",
            "<a href=\"$href\">$link</a>",
            $type,
            $actions,
            $size,
            $user.':'.$group,
#            $group,
            $permissions,
            $mod_time
            ], "", "name", $link);
    }
    print ui_columns_end();
    print &ui_links_row(\@links);
    print &ui_hidden("path", $path),"\n";
    print &ui_form_end();

    print &ui_form_end();
    print_template("unauthenticated/templates/dialogs.html");

    print "<script type=\"text/javascript\" src=\"unauthenticated/js/main.js\"></script>";
    print "<script type=\"text/javascript\" src=\"unauthenticated/js/chmod-calculator.js\"></script>";
    print "<script type=\"text/javascript\" src=\"unauthenticated/js/dataTables.bootstrap.js\"></script>";
    print "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
    print "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/dataTables.bootstrap.css\" />";
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

1;
