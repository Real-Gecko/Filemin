#!/usr/local/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Regexp::Common qw /URI/;
use URI;

&ReadParse();
get_paths();

if(!$in{'link'}) {
    &redirect("index.cgi?path=$path");
}

my $mode;
my @errors;

if($in{'link'} !~ qr($RE{URI}{HTTP}{-scheme=>qr/https?/}{-keep}) && $in{'link'} !~ qr($RE{URI}{FTP})) {
    push @errors, $text{'error_invalid_uri'};
} else {
    my $uri = (URI->new($in{'link'}));
    my $file = ($uri->path_segments)[-1];
    $ssl_mode = $uri->scheme eq 'https' ? 1 : 0;

    if(-e "$cwd/$file") {
        push @errors, "<i>$file</i> $text{'file_already_exists'} <i>$path</i>";
    } else {
        if($uri->scheme eq 'http' || $uri->scheme eq 'https') {
            &ui_print_header(undef, "$text{'http_downloading'} $file", "");
            &http_download($uri->host, $uri->port, $uri->path, "$cwd/$file", undef, \&progress_callback, $ssl_mode, $in{'username'}, $in{'password'});
            &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
        } elsif($uri->scheme eq 'ftp') {
            &ui_print_header(undef, "$text{'http_downloading'} $file", "");
            &ftp_download($uri->host, $uri->path, "$cwd/$file", undef, \&progress_callback, $in{'username'}, $in{'password'});
            &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
        }
    }
}

if (scalar(@errors) > 0) {
    print_errors(@errors);
}