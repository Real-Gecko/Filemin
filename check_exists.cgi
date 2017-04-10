#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();

$name = $in{'name'};
$name =~ s/\.\.//g;
$name = &simplify_path($name);

#print '{"success": "1"}';

$exists = (-e "$cwd/$name") ? 1 : 0;
$directory = (-d "$cwd/$name") ? 1 : 0;
$notice = &text('dialog_exists_overwrite', $name, $cwd) if $exists;

print Mojo::JSON::to_json({'exists' => $exists, 'directory' => $directory, 'notice' => $notice})
