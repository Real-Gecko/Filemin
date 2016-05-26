#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();

$confdir = get_config_dir();

if(-e "$confdir/.session") {
    my $session = &read_file_contents($confdir.'/.session', 1);
    print $session;
} else {
    print Mojo::JSON::to_json({'error' => $text{'failed_to_read_file'}.' .session'})
}
