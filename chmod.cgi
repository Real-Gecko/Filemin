#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

my @errors;
foreach $name (split(/\0/, $in{'name'})) {
    if(!chmod(oct($in{'perms'}), $cwd.'/'.$name)) {
        push @errors, "$name - $text{'error_chmod'}: $!";
    }
}
if (scalar(@errors) > 0) {
    print_errors(@errors);
} else {
    &redirect("index.cgi?path=$path");
}
