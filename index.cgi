#!/usr/bin/perl
# File manager written in perl

#$unsafe_index_cgi = 1;
require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use POSIX;
use File::Basename;

&switch_to_remote_user();

&ReadParse();

get_paths();

&ui_print_header(undef, "Filemin", "");

unless (opendir ( DIR, $cwd )) {
  print "$text{'error_opendir'} $cwd $!";
}

@list = readdir(DIR);
closedir(DIR);
@list = sort(@list);

#remove '.' and '..' from file list
shift(@list);
shift(@list);

if ($current_theme eq 'authentic-theme') {
    print_modern_interface();
} else {
    print_legacy_interface();
}

&ui_print_footer("/", $text{'index'});
