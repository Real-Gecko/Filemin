#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

$archive_type = mimetype($cwd.'/'.$in{'file'});

if ($archive_type eq 'application/zip') {
    &backquote_logged("unzip -o ".quotemeta("$cwd/$in{'file'}").
                      " -d ".quotemeta($cwd));
    print encode_json({'success' => '1'});
} elsif (index($archive_type, "tar") != -1 || index($archive_type, "gzip") != -1) {
    &backquote_logged("tar xf ".quotemeta("$cwd/$in{'file'}").
                      " -C ".quotemeta($cwd));
    print encode_json({'success' => '1'});
} else {
    print encode_json({'error' => "$archive_type $text{'error_archive_type_not_supported'}"});
}
