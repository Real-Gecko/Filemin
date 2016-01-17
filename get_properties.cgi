#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use JSON;

&ReadParse();

get_paths();

print_ajax_header();

my @data = stat("$cwd/$in{'name'}");
my %json = ();

if(-d "$cwd/$in{'name'}") {
    $json{'size'} = &disk_usage_kb("$cwd/$in{'name'}")." KB";
} else {
    $json{'size'} = &nice_size($data[7]);
}

$json{'owner'} = getpwuid($data[4]) ? getpwuid($data[4]) : $data[4];
$json{'group'} = getgrgid($data[5]) ? getgrgid($data[5]) : $data[5];
$json{'permissions'} = sprintf("%04o", $data[2] & 07777);
$json{'mtime'} = POSIX::strftime('%Y/%m/%d - %T', localtime($data[9]));
$json{'atime'} = POSIX::strftime('%Y/%m/%d - %T', localtime($data[8]));
$json{'type'} = mimetype("$cwd/$in{'name'}");

$response = encode_json \%json;
print $response;
