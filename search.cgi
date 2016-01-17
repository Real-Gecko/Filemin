#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&foreign_require("libraries", "libraries-lib.pl");

&ReadParse();

get_paths();

$query = $in{'query'};

$head = libraries::head_libraries(@libraries);
&ui_print_header(undef, "$text{'search_results'} '".&html_escape($query)."'", "", undef, 0 , 0, 0, "<a href='config.cgi?path=$path' data-config-pagination='$userconfig{'per_page'}'>$text{'module_config'}</a>", $head);

#&ui_print_header(undef, $text{'search_results'}." '".
#			&html_escape($query)."'", "");

print $head;
if($in{'caseins'}) {
    $criteria = '-iname';
} else {
    $criteria = '-name'
}
@list = split('\n', &backquote_logged(
                "find ".quotemeta($cwd)." $criteria ".quotemeta("*$in{'query'}*")));
@list = map { [ $_, stat($_), mimetype($_), -d $_ ] } @list;

print_interface();

&ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
