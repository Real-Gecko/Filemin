#!/usr/bin/perl

require './filemin-lib.pl';
use File::Fetch;
&switch_to_remote_user();

&ReadParse();

get_paths();

my $ff = File::Fetch->new(uri=>$in{'link'});
my $file = $ff->fetch(to=>$cwd);
&redirect("index.cgi?path=$path");
