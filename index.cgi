#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';

&ui_print_header(undef, "Filemin", "", undef, 0 , 0, 0, "<a href='config.cgi?path=$path' data-config-pagination='$userconfig{'per_page'}'>$text{'module_config'}</a>");

print "$text{'will_open'} <a target='_blank' href='filemin.cgi'>$text{'new_tab'}</a>";
print "<script>window.open('filemin.cgi','_blank');</script>";

&ui_print_footer("/", $text{'index'});
