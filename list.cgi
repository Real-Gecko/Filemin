#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use JSON;

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
    @list = map { [ $_, stat($_), mimetype($_), -d $_ ] } @list;
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
                push @tmp_list, grep { $slashed =~ /^$_\// ||
                                       $_ =~ /$slashed/ } @list;
            }
            # Remove duplicates
            my %hash = map { $_, 1 } @tmp_list;
            @list = keys %hash;
        }
        # Get info about directory entries
        @info = map { [ $_, stat($_), mimetype($_), -d $_ ] } @list;

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
# Get editables
%access = &get_module_acl();
@allowed_for_edit = split(/\s+/, $access{'allowed_for_edit'});
%allowed_for_edit = map { $_ => 1} @allowed_for_edit;

# Push everything to JSON
@result = ();

# That is the answer
foreach(@list) {
    my $user = getpwuid($_->[5]) ? getpwuid($_->[5]) : $_->[5];
    my $group = getgrgid($_->[6]) ? getgrgid($_->[6]) : $_->[6];
    my $permissions = sprintf("%04o", $_->[3] & 07777);
    my $type = $_->[14];

    my $link = "$_->[0]";
    $link =~ s/\Q$cwd\E\///;
    $link =~ s/^\///g;
#    my $vlink = html_escape($link);
    my $vlink = $link;
#    $vlink = quote_escape($vlink);
    $vlink = decode('UTF-8', $vlink, Encode::FB_CROAK);

    my $ed = index($_->[14], "text/");
    my %entry = (
        'name' => $vlink,
        'type' => $type,
        'size' => $_->[8],
        'user' => $user,
        'group' => $group,
        'permissions' => $permissions,
        'directory' => $_->[15],
        'atime' => $_->[9],
        'mtime' => $_->[10],
        'editable' => (index($type, "text/") != -1 or exists($allowed_for_edit{$type})),
        'archive' => (index($type, "zip") != -1 or index($type, "compressed") != -1)
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
    print encode_json(\@result);
}
