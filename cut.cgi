#!/usr/bin/perl

require './filemin-lib.pl';
#use lib './lib';
#use JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(open(my $fh, ">", &get_paste_buffer_file())) {
    print $fh "cut\n";
    print $fh "$path\n";
    @names = (split(/\0/, $in{'name[]'}));
    foreach $name (@names) {
        print $fh "$name\n";
    }
    close($fh);
    print to_json('success' => 1, 'text' => scalar(@names)." $text{'cut_to_buffer'}");
} else {
    print to_json('error' => "$text{'error_writing_file'} .buffer $!");
}
