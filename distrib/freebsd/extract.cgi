#!/usr/local/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&ReadParse();

get_paths();

$archive_type = mimetype($cwd.'/'.$in{'file'});

if ($archive_type eq 'application/zip') {
    &backquote_command("unzip $cwd/$in{'file'} -d $cwd");
    &redirect("index.cgi?path=$path");
} elsif (index($archive_type, "tar") != -1) {
    &backquote_command("tar xf $cwd/$in{'file'} -C $cwd");
    &redirect("index.cgi?path=$path");
} else {
    &ui_print_header(undef, "Filemin", "");
    print "$archive_type $text{'error_archive_type_not_supported'}";
    &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
}
