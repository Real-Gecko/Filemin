#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Regexp::Common qw /URI/;
use File::Fetch;
use URI;

&switch_to_remote_user();
&ReadParse();
get_paths();

if(!$in{'link'}) {
    &redirect("index.cgi?path=$path");
}

if ($in{'link'} !~ qr($RE{URI}{HTTP}{-scheme=>qr/https?/}{-keep})) {
    print_errors($text{'error_invalid_uri'});
} else {
    my $file = (URI->new($in{'link'})->path_segments)[-1];
    if(-e "$cwd/$file") {
        print_errors("<i>$file</i> $text{'file_already_exists'} <i>$path</i>");
    } else {
        my $ff = File::Fetch->new(uri=>$in{'link'});
        my $file = $ff->fetch(to=>$cwd);
        &redirect("index.cgi?path=$path");
    }
}
