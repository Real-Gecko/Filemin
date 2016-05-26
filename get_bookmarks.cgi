#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

$confdir = get_config_dir();
my $bookmarks = &read_file_lines($confdir.'/.bookmarks', 1);

$result = '';
foreach $bookmark(@$bookmarks) {
    $result.= "$bookmark\n";
}
print $result;
