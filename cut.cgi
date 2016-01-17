#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParseMime();

get_paths();

open(my $fh, ">", &get_config_dir()."/.buffer") or die "Error: $!";
print $fh "cut\n";
print $fh "$path\n";
#$info = "Copied ".scalar(@list)." files to buffer";

@names = split(/\0/, $in{'name'});
foreach $name (@names) {
    print $fh "$name\n";
}

close($fh);

print_ajax_header();
print scalar(@names)." ".$text{'cut_to_buffer'};
