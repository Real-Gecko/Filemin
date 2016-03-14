#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

# Remove exploiting "../"
$name = $in{'name'};
$name =~ s/\.\.//g;
&simplify_path($name);

if(-e $cwd.'/'.$name) {
    $data = &read_file_contents($cwd.'/'.$name);
    print $data;
} else {
    print encode_json({'error' => $text{'failed_to_read_file'}})
}
