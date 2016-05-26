#!/usr/bin/perl

require './filemin-lib.pl';
#use lib './lib';
#use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(open(my $fh, ">", &get_paste_buffer_file())) {
    print $fh "copy\n";
    print $fh "$path\n";
    @names = (split(/\0/, $in{'name[]'}));
    foreach $name (@names) {
        print $fh "$name\n";
    }
    close($fh);
    print Mojo::JSON::to_json({'success' => 1, 'text' => scalar(@names)." $text{'copied_to_buffer'}"});
} else {
    print Mojo::JSON::to_json({'error' => "$text{'error_writing_file'} .buffer $!"});
}
