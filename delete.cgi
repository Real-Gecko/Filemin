#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

my @errors;

foreach $name (split(/\0/, $in{'name'})) {
    if(!&unlink_file($cwd.'/'.$name)) {
#    if(!unlink($cwd.'/'.$name)) {
#    if(!system("rm -rf $cwd.'/'.$name")) {
        push @errors, "$name - $text{'error_delete'}: $!";
    }
}

if (scalar(@errors) > 0) {
    print_errors(@errors);
} else {
    &redirect("index.cgi?path=$path");
}
