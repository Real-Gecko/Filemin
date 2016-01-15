#!/usr/bin/perl

require './filemin-lib.pl';
&foreign_require("libraries", "libraries-lib.pl");
&ReadParse();

get_paths();

push @libraries, {
    'name' => 'codemirror',
    'files' => [
        'lib/codemirror.js',
        'lib/codemirror.css',
        'addon/mode/loadmode.js',
        'mode/meta.js',
    ]
};

$head = libraries::head_libraries(@libraries);
&ui_print_header(undef, "$text{'edit_file'}", "", undef, 0 , 0, 0, "<a href='config.cgi?path=$path' data-config-pagination='$userconfig{'per_page'}'>$text{'module_config'}</a>", $head);

$data = &read_file_contents($cwd.'/'.$in{file});

$head = "<link rel='stylesheet' type='text/css' href='unauthenticated/css/style.css' />";

if ($current_theme ne 'authentic-theme') {
    $head.= "<style type='text/css'>.CodeMirror {height: auto; width: 100%;}</style>";
}

print $head;

print ui_table_start("$path/$in{'file'}", 'style="width: 100%"', 1);

print &ui_form_start("save_file.cgi", "post");
print &ui_hidden("file", $in{'file'}),"\n";
print &ui_textarea("data", $data, 20, 80, undef, undef, "style='width: 100%' id='data'");
print &ui_hidden("path", $path);
print &ui_form_end([ [ save, $text{'save'} ], [ save_close, $text{'save_close'} ] ]);

print ui_table_end();

print "<script type='text/javascript' src='unauthenticated/js/cmauto.js'></script>";
print "<script type='text/javascript'>\$(document).ready( function() { change('".$in{'file'}."'); });</script>";

&ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
