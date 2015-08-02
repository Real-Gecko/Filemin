#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&ReadParse();

get_paths();

$query = $in{'query'};

&ui_print_header(undef, "$text{'search_results'} '$query'", "");

print $head;

@list = split('\n', &backquote_command("find $cwd -name \"*$in{'query'}*\""));
@list = map { [ $_, stat($_), mimetype($_), -d $_ ] } @list;

print_interface();

&ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
