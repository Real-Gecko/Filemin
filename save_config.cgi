#!/usr/bin/perl

require './filemin-lib.pl';
&ReadParse();

get_paths();

$columns = $in{'columns'};
$columns =~ s/\0/,/g;
%config = (
    'columns' => $columns,
);

$confdir = get_config_dir();
&write_file("$confdir/.config", \%config);

$bookmarks = $in{'bookmarks'};
$bookmarks =~ s/\r\n/\n/g;
open(BOOK, ">", "$confdir/.bookmarks") or $info = $!;
print BOOK $bookmarks;
close BOOK;

&redirect("index.cgi?path=$path");
