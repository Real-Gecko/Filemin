#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Archive::Extract;

&switch_to_remote_user();
&ReadParse();

get_paths();

$ae = new Archive::Extract( archive => $cwd.'/'.$in{'file'});
$ae->extract(to => $cwd) or die "Unable to extract $in{'file'} ".$ae->error;
&redirect("index.cgi?path=$path");
