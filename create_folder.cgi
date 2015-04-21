#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

&make_dir("$cwd/$in{'name'}", oct(755), 0) or die "Unable to create $in{'name'} $!";

&redirect("index.cgi?path=$path");

