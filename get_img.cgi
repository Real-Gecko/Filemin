#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&ReadParse();

get_paths();

# Remove exploiting of "../" in file names
$name = $in{'name'};
$name =~ s/\.\.//g;
$name = &simplify_path($name);

if( !defined($name) ){

	print_ajax_header();
    print status('error', $text{'failed_to_read_file'});
	exit;
}

my $img = $cwd.'/'.$name;
my $size = -s "$img";
my $type = mimetype($img);

print "Content-Type: $type\n";
print "Content-Length: $size\n\n";
open (FILE, "< $img") or exit;#die "can't open $img: $!";
binmode FILE;
local $/ = \102400;
while (<FILE>) {
    print $_;
}
close FILE;
