#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

my @errors;

print_ajax_header();

foreach $name (split(/\0/, $in{'name[]'})) {
    if(!&unlink_logged("$cwd/$name")) {
        push @errors, "$name - $text{'error_delete'}: $!";
    }
}

if (scalar(@errors) > 0) {
    print encode_json({'error' => \@errors});
} else {
    print encode_json({'success' => 1});
}
