#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';
use version;

&ui_print_header(undef, "Filemin", "", undef, 0 , 0, 0);

print "<h3>$text{'will_open'} <a target='_blank' href='filemin.cgi'>$text{'new_tab'}</a><br></h3>";
print "<script>window.open('filemin.cgi','_blank');</script>";

# Check for updates
if($remote_user eq 'root') {
    my $url = 'https://github.com/Real-Gecko/filemin/raw/master/module.info';
    my $tempfile = transname();
    my %remote_module_info = ();
    my %module_info = ();
    my ($host, $port, $page, $ssl) = &parse_http_url($url);
    &http_download($host, $port, $page, $tempfile, undef, undef, $ssl)
    &read_file($tempfile, \%remote_module_info);
    %module_info = &get_module_info('filemin');
    my $remote = version->parse($remote_module_info{'version'});
    my $local = version->parse($module_info{'version'});
    if($local < $remote) {
        print "<h4>$text{'newer_version_available'}<br><a href='update.cgi?version=$remote'>$text{'click_to_update'}</a></h4>";
    };
}

&ui_print_footer("/", $text{'index'});
