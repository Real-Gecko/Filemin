#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParseMime();

get_paths();

$file = $in{'file'};
$data = $in{'data'};
open(SAVE, ">", $cwd.'/'.$file) or $info = $!;
print SAVE $data;
close SAVE;

&redirect("index.cgi?path=$path");
