# filemin-lib.pl

BEGIN { push(@INC, ".."); };
use WebminCore;
&init_config();
use Encode qw(decode encode);
use POSIX;

use lib './lib';
use File::Basename;
use File::MimeInfo;
$templates_path = "unauthenticated/templates";

sub get_paths {
    my @errors;
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
            push @errors, "Unix user $access{'work_as_user'} does not exist!";
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
    $path =~ s/\.\.//g;
    $path = &simplify_path($path);
    $cwd = &simplify_path(&resolve_links($base.$path));

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
#        &error(&text('notallowed', &html_escape($cwd),
#                                   &html_escape(join(" , ", @allowed_paths))));
        push @errors, &text('notallowed', &html_escape($cwd),
                                   &html_escape(join(" , ", @allowed_paths)));
    }

    if (index($cwd, $base) == -1)
    {
        $cwd = $base;
    }

    # Not really elegant, but working :D
    if (scalar(@errors) > 0) {
        $result = '';
        foreach $error(@errors) {
            $result.= "$error<br>";
        }
        print_ajax_header();
        print '{"error": "'.$result.'"}';
        exit;
    }

    # Initiate per user config
    $confdir = "$remote_user_info[7]/.filemin";
    if(!-e "$confdir/.config") {
#        &read_file_cached("$module_root_directory/defaultuconf", \%userconfig);
    } else {
#        &read_file_cached("$confdir/.config", \%userconfig);
    }
}

sub print_template {
    $template_name = @_[0];
    if (open(my $fh, '<:encoding(UTF-8)', "$templates_path/$template_name")) {
      while (my $row = <$fh>) {
        print (eval "qq($row)");
      }
      close($fh);
    } else {
      print "$text{'error_load_template'} '$template_name' $!";
    }
}

sub get_template {
    $template_name = @_[0];
    my $result = "";
    if (open(my $fh, '<:encoding(UTF-8)', "$templates_path/$template_name")) {
      while (my $row = <$fh>) {
        $result .= (eval "qq($row)");
      }
      close($fh);
    } else {
      $result = "$text{'error_load_template'} '$template_name' $!";
    }
    return $result;
}

# get_bookmarks()
# Return list of bookmarks made by user as set of HTML <li>
sub get_bookmarks {
    $confdir = get_config_dir();
    if(!-e "$confdir/.bookmarks") {
        return "<li><a>$text{'no_bookmarks'}</a></li>";
    }
    my $bookmarks = &read_file_lines($confdir.'/.bookmarks', 1);
    if(scalar(@{$bookmarks}) == 0) {
        return "<li><a>$text{'no_bookmarks'}</a></li>";
    }
    $result = '';
    foreach $bookmark(@$bookmarks) {
        $result.= "<li><a data-item='goto'>$bookmark</a><li>";
    }
    return $result;
}

# get_config_dir()
# Returns the directory for user config/bookmarks/copy & paste storage
sub get_config_dir
{
    if (&get_product_name() eq 'usermin') {
        return $user_module_config_directory;
    }
    else {
        my $tmpdir = "$remote_user_info[7]/.filemin";
        &make_dir($tmpdir, 0700) if (!-d $tmpdir);
        return $tmpdir;
    }
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

sub print_ajax_header {
    print "Content-Security-Policy: script-src 'self' 'unsafe-inline'; frame-src 'self'\n";
    print "Content-type: application/json; Charset=utf-8\n\n";
}

sub filemin_progress_callback {
    if ($_[0] == 2) {
        # Got size
        print $progress_callback_prefix;
        if ($_[1]) {
            $progress_size = $_[1];
            $progress_step = int($_[1] / 10);
            print &text('progress_size2', $progress_callback_url,
                    &nice_size($progress_size)),"\n";
        }
        else {
            $progress_size = undef;
            print &text('progress_nosize', $progress_callback_url),"\n";
        }
        $last_progress_time = $last_progress_size = undef;
    }
    elsif ($_[0] == 3) {
        # Got data update
        if ($progress_size) {
            # And we have a size to compare against
            my $st = int(($_[1] * 10) / $progress_size);
            my $time_now = time();
            if ($st != $progress_step ||
                $time_now - $last_progress_time > 60) {
                # Show progress every 10% or 60 seconds
                print &text('progress_datan', &nice_size($_[1]),
                            int($_[1]*100/$progress_size)),"\n";
                $last_progress_time = $time_now;
                }
            $progress_step = $st;
            }
        else {
            # No total size .. so only show in 1M jumps
            if ($_[1] > $last_progress_size+1024*1024) {
                print &text('progress_data2n',
                        &nice_size($_[1])),"\n";
                $last_progress_size = $_[1];
            }
        }
    }
    elsif ($_[0] == 4) {
        # All done downloading
        print $progress_callback_prefix,&text('progress_done'),"\n";
    }
    elsif ($_[0] == 5) {
        # Got new location after redirect
        $progress_callback_url = $_[1];
    }
    elsif ($_[0] == 6) {
        # URL is in cache
        $progress_callback_url = $_[1];
        print &text('progress_incache', $progress_callback_url),"\n";
    }
}

# Simple hash to JSON conversion
sub to_json {
    my %hash = @_;
    return "{".join(q{,}, map{qq{"$_":"$hash{$_}"}} keys %hash)."}";
}

sub oct_to_symbolic {
    my $permissions = $_[0];

    my $sup = substr $permissions, 0, 1;
    my $res = "";
    if(($sup & 4) >> 2) { $res .= 'u+s,' } else { $res .= 'u-s,' }
    if(($sup & 2) >> 1) {$res .= 'g+s,'} else { $res .= 'g-s,' }
    if($sup & 1) { $res .= '+t,' } else { $res .= '-t,' }
    
    my $usr = substr $permissions, 1, 1;
    $res .= "u";
    if(($usr & 4) >> 2) { $res .= '+r' } else { $res .= '-r' }
    if(($usr & 2) >> 1) { $res .= '+w' } else { $res .= '-w' }
    if($usr & 1) { $res .= '+x,' } else { $res .= '-x,' }
    
    my $grp = substr $permissions, 2, 1;
    $res .= "g";
    if(($grp & 4) >> 2) { $res .= '+r' } else { $res .= '-r' }
    if(($grp & 2) >> 1) { $res .= '+w' } else { $res .= '-w' }
    if($grp & 1) { $res .= '+x,' } else { $res .= '-x,' }
    
    my $oth = substr $permissions, 3, 1;
    $res .= "o";
    if(($oth & 4) >> 2) { $res .= '+r' } else { $res .= '-r' }
    if(($oth & 2) >> 1) { $res .= '+w' } else { $res .= '-w' }
    if($oth & 1) { $res .= '+x' } else { $res .= '-x' }

    return $res;
}

sub suggest_filename {
    my ($cwd, $name) = @_;
    if (-e "$cwd/$name") {
        if(-d "$cwd/$name") {
            return suggest_filename($cwd, $name."_copy");
        } else {
            my $mime = mimetype("$cwd/$name");
            my $ext = File::MimeInfo::extensions($mime);
            $name =~ s/\.$ext//;
            $ext = $ext ? ".$ext" : "";
            return suggest_filename($cwd, $name."_copy".$ext);
        }
    }
    return $name;
}

1;

