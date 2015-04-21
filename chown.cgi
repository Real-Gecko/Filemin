#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

(my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'}) or die "$in{'owner'} not in passwd file";

foreach $name (split(/\0/, $in{'name'})) {
    chown $uid, $gid, $cwd.'/'.$name or die "error chowning $name: $!";
}

&redirect("index.cgi?path=$path");
