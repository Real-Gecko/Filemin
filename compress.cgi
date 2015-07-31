#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();
get_paths();

if(!$in{'arch'}) {
    &redirect("index.cgi?path=$path");
}

my $command;

if($in{'method'} eq 'tar') {
    $command = "tar czf $cwd/$in{'arch'}.tar.gz -C $cwd";
} elsif($in{'method'} eq 'zip') {
    $command = "cd $cwd && zip -r $cwd/$in{'arch'}.zip";
}

foreach my $name(split(/\0/, $in{'name'}))
{
    $name =~ s/$in{'cwd'}\///ig;
    $command = "$command \"$name\"";
}

system($command);

&redirect("index.cgi?path=$path");
