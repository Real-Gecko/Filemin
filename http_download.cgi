#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::Fetch;
use Data::Validate::URI qw(is_uri);
use URI;
&switch_to_remote_user();

&ReadParse();

get_paths();

if(!is_uri($in{'link'})){
#    &ui_print_header(undef, "Filemin", "");
#    my $file = (URI->new($in{'link'})->path_segments)[-1];
#    print("<h4>$text{'error_invalid_uri'}</h4>");
#    &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
    print_errors($text{'error_invalid_uri'});
} else {
    my $file = (URI->new($in{'link'})->path_segments)[-1];

    if(-e "$cwd/$file") {
#        &ui_print_header(undef, "Filemin", "");
#        print("<h4><i>$file</i> $text{'file_already_exists'} <i>$path</i></h4>");
#        &ui_print_footer("index.cgi?path=$path", $text{'previous_page'});
        print_errors("<i>$file</i> $text{'file_already_exists'} <i>$path</i>");
    } else {
        my $ff = File::Fetch->new(uri=>$in{'link'});
        my $file = $ff->fetch(to=>$cwd);
        &redirect("index.cgi?path=$path");
    }
}
