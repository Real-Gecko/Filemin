#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

&rename_file($cwd.'/'.$in{'file'}, $cwd.'/'.$in{'name'}) or die "Unable to rename $in{'file'} $!";

&redirect("index.cgi?path=$path");
