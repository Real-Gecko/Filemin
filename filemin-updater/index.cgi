#!/usr/bin/perl

use WebminCore;
&init_config();
&foreign_require("webmin", "webmin-lib.pl");

my $vc = eval #102 fix
{
  require version;
  version->import();
  1;
};

$webprefix = $gconfig{'webprefix'};

&ui_print_unbuffered_header(undef, "Filemin Updater", "", undef, 1 , 0, 0);

# Check for updates
if($remote_user eq 'root' & $vc) {
    print $text{'checking_for_update'};
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
    my $flavour = $config{'flavour'};
    if($local < $remote) {
	    my $os = $gconfig{'os_type'};
	    if(index($os, 'linux') != -1) {
	        $os = 'linux';
	    } elsif (index($os, 'freebsd') != -1){
	        $os = 'freebsd';
	    } else {
	        &error('WHAT???');
	    }
	   # my $url = "https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-$remote.$os.wbm.gz";
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
			print "<a href='$webprefix/filemin/index.cgi'>Filemin</a>";
	    }
    } else {
        print $text{'module_up_to_date'};
    };
}

&ui_print_footer("/", $text{'index'});
