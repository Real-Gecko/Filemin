#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

if(!$in{'name'}) {
    print("{\"error\": \"1\"}");
}

get_paths();

# Remove exploiting "../" in new file names
$name = $in{'name'};
$name =~ s/\.\.//g;
&simplify_path($name);

print_ajax_header();

if (-e "$cwd/$name") {
    print("{\"error\": \"<b>$name</b> $text{'error_exists'}\"}");
} else {
    if(&rename_file($cwd.'/'.$in{'file'}, $cwd.'/'.$name)) {
        print '{"success": "1"}';
    } else {
        print("{\"error\": \"$text{'error_rename'} $in{'file'}: $!\"}");
    }
}
