#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

my @errors;

# Remove exploiting of "../" in parameters
$file = $in{'name'};
$file =~ s/\.\.//g;
&simplify_path($file);

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
    print encode_json({'error' => \@errors});
} else {
    print encode_json({'success' => '1'});
}
