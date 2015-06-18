#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

get_paths();

$tmpdir = "$remote_user_info[7]/.filemin";
unless (-e $tmpdir) { mkdir $tmpdir or die "unable to create tmpdir $!"; }
open(my $fh, ">", "$tmpdir/.buffer") or die "Error: $!";
print $fh "cut\n";
print $fh "$path\n";
#$info = "Copied ".scalar(@list)." files to buffer";

foreach $name (split(/\0/, $in{'name'})) {
    print $fh "$name\n";
}

close($fh);

&redirect("index.cgi?path=$path");
