#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

get_paths();

$data = &read_file_contents($cwd.'/'.$in{file});

&ui_print_header(undef, $text{'edit_file'}, "");
$head = "<link rel=\"stylesheet\" type=\"text/css\" href=\"unauthenticated/css/style.css\" />";
print $head;

print $path.'/'.$in{'file'};

print &ui_form_start("save_file.cgi", "post");
print &ui_hidden("file", $in{'file'}),"\n";
print &ui_textarea("data", $data, 20, 80, undef, undef, "style='width: 100%'");
print &ui_hidden("path", $path);
print &ui_form_end([ [ save, $text{'save'} ] ]);

&ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
