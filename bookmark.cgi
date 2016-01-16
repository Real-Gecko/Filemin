#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();

get_paths();

$confdir = get_config_dir();
if(!-e $confdir) {
    mkdir $confdir or &error("$text{'error_creating_conf'}: $!");
}

if(!-e "$confdir/.bookmarks") {
    utime time, time, "$confdir/.bookmarks";
}

$bookmarks = &read_file_lines($confdir.'/.bookmarks');
push @$bookmarks, $path;
&flush_file_lines("$confdir/.bookmarks");

&redirect("index.cgi?path=$path");
