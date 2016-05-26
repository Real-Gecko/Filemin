#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use Mojo::JSON;

&ReadParse();
get_paths();

if(!$in{'file'}) {
    print Mojo::JSON::to_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

# Remove exploiting "../"
$file = $in{'file'};
$file =~ s/\.\.//g;
&simplify_path($file);

print_ajax_header();

$archive_type = mimetype($cwd.'/'.$file);

my $result;
my $command;

if ($archive_type eq 'application/zip') {
    $command = "unzip -l ".quotemeta("$cwd/$file");
    $result = `$command`;
    print Mojo::JSON::to_json({'success' => $result});
} elsif (index($archive_type, "tar") != -1 || index($archive_type, "gzip") != -1) {
    $command = "tar tvf ".quotemeta("$cwd/$file");
    $result = `$command`;
    print Mojo::JSON::to_json({'success' => $result});
} else {
    print Mojo::JSON::to_json({'error' => "$archive_type $text{'error_archive_type_not_supported'}"});
}
