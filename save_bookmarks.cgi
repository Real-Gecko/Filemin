#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

$confdir = get_config_dir();

my $bookmarks = $in{'bookmarks'};
$bookmarks =~ s/\r\n/\n/g;

my $fh;

if(open($fh, ">", $confdir.'/.bookmarks')) {
    print $fh $bookmarks;
    close $fh;
} else {
    push @errors, "$text{'error_saving_bookmarks'} - $!";
}

if (scalar(@errors) > 0) {
    print encode_json({'error' => \@errors});
} else {
    print encode_json({'success' => '1'});
}
