#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(-e $cwd.'/'.$in{name}) {
    $data = &read_file_contents($cwd.'/'.$in{name});
    print $data;
} else {
    print encode_json({'error' => $text{'failed_to_read_file'}})
}
