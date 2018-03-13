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

