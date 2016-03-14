#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

get_paths();

# Remove exploiting "../" in new file names
$name = $in{'name'};
$name =~ s/\.\.//g;
&simplify_path($name);

print_ajax_header();

if(!$in{'name'}) {
    print("{\"error\": \"$text{'provide_folder_name'}\"}");
} else {
    if (-e "$cwd/$in{'name'}") {
        print("{\"error\": \"<b>$name</b> $text{'error_exists'}\"}");
    } else {
        if( mkdir ("$cwd/$name", oct(755)) ) {
            print '{"success": "1"}';
        } else {
            print("{\"error\": \"$name - $text{'error_create'} $!\"}");
        }
    }
}
