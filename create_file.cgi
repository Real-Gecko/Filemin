#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

open my $fh, "> $cwd/$in{'name'}" or die "Unable to create $filename $!";
close($fh);
&redirect("index.cgi?path=$path");
