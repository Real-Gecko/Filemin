#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

get_paths();

print_ajax_header();

$data = &read_file_contents(&get_paste_buffer_file());
print Mojo::JSON::to_json({'success' => $data});
