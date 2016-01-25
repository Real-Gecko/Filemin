#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(-d "$cwd/$in{'name'}") {
    print encode_json({'success' => 1, 'data' => &recursive_disk_usage("$cwd/$in{'name'}")});
} else {
    print encode_json({'error' => $text{'not_a_directory'}});
}
