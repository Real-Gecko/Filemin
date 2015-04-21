#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();
&ReadParse();
get_paths();

my $command = "tar czf $cwd/$in{'arch'}.tar.gz -C $cwd";
foreach my $name(split(/\0/, $in{'name'}))
{
    $name =~ s/$in{'cwd'}\///ig;
    $command = "$command \"$name\"";
}
system($command);
&redirect("index.cgi?path=$path");
