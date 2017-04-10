#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

# Remove exploiting "../"
$name = $in{'name'};
$name =~ s/\.\.//g;
$name  = simplify_path($name);

if($name && -e $cwd.'/'.$name) {
    $data = &read_file_contents($cwd.'/'.$name);
    print $data;
} else {
    print status('error', $text{'failed_to_read_file'});
}
