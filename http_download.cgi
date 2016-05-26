#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

my $mode;
my @errors;
my ($host, $port, $page, $ssl) = &parse_http_url($in{'link'});

if (!$host || !$in{'link'}) {
    # Not an HTTP or FTP URL
    push @errors, $text{'error_invalid_uri'};
} else {
    # Looks like a valid URL
    my $file = $page;
    $file =~ s/^.*\///;
    $file ||= "index.html";

    if(-e "$cwd/$file") {
        push @errors, "<b>$file</b> $text{'file_already_exists'} <b>$path</b>";
    } else {
        if ($ssl == 0 || $ssl == 1) {
            # HTTP or HTTPS download
            &http_download($host, $port, $page, "$cwd/$file", undef,
                   \&filemin_progress_callback, $ssl,
                   $in{'username'}, $in{'password'});
        } else {
            # Actually an FTP download
            &ftp_download($host, $page, "$cwd/$file", undef,
                  \&filemin_progress_callback,
                  $in{'username'}, $in{'password'}, $port);
        }
    }
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
}
