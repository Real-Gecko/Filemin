#!/usr/bin/perl

require './filemin-lib.pl';
&foreign_require("webmin", "webmin-lib.pl");
use version;

&ReadParse();

&ui_print_unbuffered_header();
$webprefix = $gconfig{'webprefix'};

# Just in case
if($remote_user eq 'root') {
    my $os = $gconfig{'os_type'};
    my $version = $in{'version'};
    my $flavour = $in{'flavour'};
    if(index($os, 'linux') != -1) {
        $os = 'linux';
    } elsif (index($os, 'freebsd') != -1) {
        $os = 'freebsd';
    } else {
        &error('WHAT???');
    }
    # my $url = "https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-$version.$os.wbm.gz";
    my $url = "https://github.com/Real-Gecko/Filemin/releases/download/$version/filemin-$version.$os.$flavour.wbm.gz";
    my $tempfile = transname();
    my ($host, $port, $page, $ssl) = &parse_http_url($url);
    &http_download($host, $port, $page, $tempfile, undef, \&progress_callback, $ssl);
    $irv = &webmin::install_webmin_module($tempfile);
    if (!ref($irv)) {
        print &text('update_failed', $irv),"<p>\n";
    }
    else {
        print &text('module_updated', "<b>$irv->[0]->[0]</b>", "<b>$irv->[2]->[0]</b>"),"\n";
        print "<a href='$webprefix/filemin/filemin.cgi'>Filemin</a>";
    }
}

&ui_print_footer("/", $text{'index'});
