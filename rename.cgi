#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

if(!$in{'name'}) {
    &redirect("index.cgi?path=$path");
}

get_paths();

# Remove exploiting "../" in new file names
$name = $in{'name'};
$name =~ s/\.\.//g;
&simplify_path($name);

if (-e "$cwd/$name") {
    print_errors("$name $text{'error_exists'}");
} else {
    if(&rename_file($cwd.'/'.$in{'file'}, $cwd.'/'.$name)) {
        &redirect("index.cgi?path=$path");
    } else {
        print_errors("$text{'error_rename'} $in{'file'}: $!");
    }
}
