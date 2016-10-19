#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&ReadParse();
get_paths();

if(!$in{'file'}) {
    print encode_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

# Remove exploiting "../"
$file = $in{'file'};
$file =~ s/\.\.//g;
&simplify_path($file);

print_ajax_header();

$archive_type = mimetype($cwd.'/'.$file);

if ($archive_type eq 'application/zip') {
    &backquote_logged("unzip -o ".quotemeta("$cwd/$file").
                      " -d ".quotemeta($cwd));
    print status('success', 1);
} elsif (index($archive_type, "tar") != -1 || index($archive_type, "gzip") != -1) {
    &backquote_logged("tar xf ".quotemeta("$cwd/$file").
                      " -C ".quotemeta($cwd));
    print status('success', 1);
} else {
    print status('error', "$archive_type $text{'error_archive_type_not_supported'}");
}
