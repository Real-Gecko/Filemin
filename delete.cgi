#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

#&ui_print_header(undef, "Filemin", "", undef, $module_info{'filemin'} ? 0 : 1, 1, undef, undef, $head, undef);
#print $cwd;

foreach $name (split(/\0/, $in{'name'})) {
    &unlink_file($cwd.'/'.$name) or die "Unable to remove $cwd/$name $!";
#    print $cwd.'/'.$name;
}

&redirect("index.cgi?path=$path");
