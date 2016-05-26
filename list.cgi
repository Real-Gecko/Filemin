#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();

my @errors;

# To search
if($in{'query'}) {
    if($in{'caseins'}) {
        $criteria = '-iname';
    } else {
        $criteria = '-name'
    }
    @list = split('\n', &backquote_logged(
                    "find ".quotemeta($cwd)." $criteria ".quotemeta("*$in{'query'}*")));
    @list = map { [ $_, lstat($_), mimetype($_), -d, -l $_ ] } @list;
# Or not to search
} else {
    unless (opendir ( DIR, $cwd )) {
        $path="";
        push @errors, "$text{'error_opendir'} <b>$cwd</b> $!";
    } else {
        # Push file names with full paths to array, filtering out "." and ".."
        @list = map { &simplify_path("$cwd/$_") } grep { $_ ne '.' && $_ ne '..' } readdir(DIR);
        closedir(DIR);

        # Filter out not allowed entries
        if($remote_user_info[0] ne 'root' && $allowed_paths[0] ne '$ROOT') {
            # Leave only allowed
            for $path (@allowed_paths) {
                my $slashed = $path;
                $slashed .= "/" if ($slashed !~ /\/$/);
                push @tmp_list, grep { $slashed =~ /\Q^$_\/\E/ ||
                                       $_ =~ /\Q$slashed\E/ } @list;
            }
            # Remove duplicates
            my %hash = map { $_, 1 } @tmp_list;
            @list = keys %hash;
        }
        # Get info about directory entries
        @info = map { [ $_, lstat($_), mimetype($_), -d, -l $_ ] } @list;

        # Filter out folders
        @folders = map {$_} grep {$_->[15] == 1 } @info;

        # Filter out files
        @files = map {$_} grep {$_->[15] != 1 } @info;

        # Sort stuff by name
        @folders = sort { $a->[0] cmp $b->[0] } @folders;
        @files = sort { $a->[0] cmp $b->[0] } @files;

        # Recreate list
        undef(@list);
        push @list, @folders, @files;
    }
}

# Push everything to JSON
@result = ();

# That is the answer
foreach(@list) {
    my $user = getpwuid($_->[5]) ? getpwuid($_->[5]) : $_->[5];
    my $group = getgrgid($_->[6]) ? getgrgid($_->[6]) : $_->[6];
    my $permissions = sprintf("%04o", $_->[3] & 07777);
    my $type = $_->[14];
    my $link_target = "";
    my $link_target_mime = "";
    my $size;

    my $link = $_->[0];

    if($in{'sizes'} & $_->[15]) {
        $size = &recursive_disk_usage($link);
    } else {
        $size = $_->[8];
    }

    if($_->[16]) {
        $link_target = readlink($link);
        $link_target_mime = mimetype($link_target);
        unless(-e &resolve_links($link)) {
            $_->[16] = 'broken'
        }
    }

    $link =~ s/\Q$cwd\E\///;
    $link =~ s/^\///g;
    $link = decode('UTF-8', $link, Encode::FB_CROAK);

    my %entry = (
        'name' => $link,
        'type' => $type,
        'size' => $size,
        'user' => $user,
        'group' => $group,
        'permissions' => $permissions,
        'directory' => $_->[15],
        'symlink' => $_->[16],
        'atime' => $_->[9],
        'mtime' => $_->[10],
        'archive' => (index($type, "zip") != -1 or index($type, "compressed") != -1),
        'link_target' => $link_target,
        'link_target_mime' => $link_target_mime
    );

    push @result, \%entry;
}
if (scalar(@errors) > 0) {
    $result = '';
    foreach $error(@errors) {
        $result.= "$error<br>";
    }
    print '{"error": "'.$result.'"}';
} else {
    print Mojo::JSON::to_json(\@result);
}
