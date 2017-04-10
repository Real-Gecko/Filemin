#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

my @errors;

print_ajax_header();

foreach $name (split(/\0/, $in{'name[]'})) {
    $name =~ s/\.\.//g;
    $name = &simplify_path($name);
    if(!$name || !&unlink_logged("$cwd/$name")) {
        push @errors, "$name - $text{'error_delete'}: $!";
    }
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
