#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

get_paths();

# Remove exploiting "../" in new file names
$name = $in{'name'};
$name =~ s/\.\.//g;
$name = &simplify_path($name);

print_ajax_header();

if(!$in{'name'} || !defined($name)) {
    print("{\"error\": \"$text{'provide_file_name'}\"}");
} else {
    if (-e "$cwd/$name") {
        print("{\"error\": \"$name $text{'error_exists'}\"}");
    } else {
        if (open my $fh, "> $cwd/$name") {
            close($fh);
            print status('success', 1);
        } else {
            print status('error', "$name - $text{'error_create'} $!");
        }
    }
}
