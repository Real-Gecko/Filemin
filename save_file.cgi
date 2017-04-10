#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

my @errors;

# Remove exploiting of "../" in parameters
$file = $in{'name'};
$file =~ s/\.\.//g;
$file = &simplify_path($file);

# Correct end of lines
$data = $in{'data'};
$data =~ s/\r\n/\n/g;
if(open(SAVE, ">", $cwd.'/'.$file)) {
    print SAVE $data;
    close SAVE;
} else {
    push @errors, "$text{'error_saving_file'} - $!";
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
