#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParseMime();

get_paths();

#&ui_print_header(undef, $text{'save_file'}, "");
$file = $in{'file'};
$data = $in{'data'};
open(SAVE, ">", $cwd.'/'.$file) or $info = $!;
print SAVE $data;
close SAVE;
#        $info = "File saved";
#&ui_print_footer("index.cgi", $text{'index'});

&redirect("index.cgi?path=$path");
