#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

$confdir = get_config_dir();
my @errors;

if(!-e $confdir) {
    mkdir $confdir or push @error, "$text{'error_creating_conf'}: $!";
}

if(!-e "$confdir/.bookmarks") {
    utime time, time, "$configdir/.bookmarks";
}

$bookmarks = &read_file_lines($confdir.'/.bookmarks');
# Check if already exists
my %h_bookmarks = map { $_ => 1 } @$bookmarks;
if(exists($h_bookmarks{$path})) {
    push @errors, $text{'bookmark_exists'};
} else {
    push @$bookmarks, $path;
}
#@bookmarks = sort(@bookmarks);
&flush_file_lines("$confdir/.bookmarks");

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
