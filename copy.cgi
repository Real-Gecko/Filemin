#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParseMime();

get_paths();

open(my $fh, ">", &get_paste_buffer_file()) or die "Error: $!";
print $fh "copy\n";
print $fh "$path\n";

@names = split(/\0/, $in{'name'});
foreach $name (@names) {
    print $fh "$name\n";
}

close($fh);

print_ajax_header();
print scalar(@names)." ".$text{'copied_to_buffer'};
