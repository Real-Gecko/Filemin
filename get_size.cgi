#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();

$size = 0;
@names = (split(/\0/, $in{'name[]'}));
foreach $name(@names) {
	# Remove exploiting of "../" in file parameters
	$name =~ s/\.\.\///g;
	&simplify_path($name);

	if(-d "$cwd/$name") {
		$size = $size + &recursive_disk_usage("$cwd/$name");
	} else {
		my @fstat = stat "$cwd/$name";
		$size = $size + $fstat[7];
	}
}
print Mojo::JSON::to_json({'success' => 1, 'data' => $size});
