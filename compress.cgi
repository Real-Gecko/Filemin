#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();
get_paths();

if(!$in{'arch'}) {
    &redirect("index.cgi?path=$path");
}

my $command = "tar czf $cwd/$in{'arch'}.tar.gz -C $cwd";
foreach my $name(split(/\0/, $in{'name'}))
{
    $name =~ s/$in{'cwd'}\///ig;
    $command = "$command \"$name\"";
}
system($command);
&redirect("index.cgi?path=$path");
