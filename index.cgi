#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';
&foreign_require("webmin", "webmin-lib.pl");

my $vc = eval #102 fix
{
  require version;
  version->import();
  1;
};

#use version;

$webprefix = $gconfig{'webprefix'};

&ui_print_unbuffered_header(undef, "Filemin", "", undef, 1 , 0, 0);

print "<h3>$text{'will_open'} <a target='_blank' href='$webprefix/filemin/filemin.cgi'>$text{'new_tab'}</a><br></h3>";
print "<script>window.open('$webprefix/filemin/filemin.cgi','_blank');</script>";
print "<script src='$webprefix/filemin/unauthenticated/js/markdown.min.js'></script>";

# Check for updates
if($remote_user eq 'root' & $vc) {
	# Check if updater is installed
	my $updater = &foreign_installed('filemin-updater');
	if(!$updater) {
		print "Installing updater<br>";
		$irv = &webmin::install_webmin_module("$module_root_directory/unauthenticated/filemin-updater.tar.gz");
	    if (!ref($irv)) {
	        print "Installation failed $irv";
	    }
	    else {
	        print "Updater Installed <b>$irv->[0]->[0]</b> <b>$irv->[2]->[0]</b><br>";
	    }
	}
	# print $installer;
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
    if($local < $remote) {
        print "<h4>$text{'newer_version_available'}<br><a href='update.cgi?version=$remote'>$text{'click_to_update'}</a></h4>";
    } else {
        print $text{'module_up_to_date'};
    };
}

# Display changelog
if($remote_user eq 'root' & $vc) {
    my $changelog = &read_file_contents('CHANGELOG.md');
    
    print '<hr><article id="changelog">';
    print $changelog;
    print '</article>';
    
    print "<script>\
        var changelog = document.getElementById('changelog');
        var content = changelog.innerHTML;
        changelog.innerHTML = markdown.toHTML(content);
    </script>";
}

&ui_print_footer("/", $text{'index'});
