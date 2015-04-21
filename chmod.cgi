#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

foreach $name (split(/\0/, $in{'name'})) {
    chmod oct($in{'perms'}), $cwd.'/'.$name;
}

&redirect("index.cgi?path=$path");
