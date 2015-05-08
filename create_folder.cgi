#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

if (-e "$cwd/$in{'name'}") {
    print_errors("$in{'name'} $text{'error_exists'}");
} else {
    if( mkdir ("$cwd/$in{'name'}", oct(755)) ) {
        &redirect("index.cgi?path=$path");
    } else {
        print_errors("$text{'error_create'} $in{'name'}: $!");
    }
}
