#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;

&ReadParse();

get_paths();

print_ajax_header();

my @data = stat("$cwd/$in{'name'}");

$size = &nice_size($data[7]);
$user = getpwuid($data[4]) ? getpwuid($data[4]) : $data[4];
$group = getgrgid($data[5]) ? getgrgid($data[5]) : $data[5];
$permissions = sprintf("%04o", $data[2] & 07777);
$mtime = POSIX::strftime('%Y/%m/%d - %T', localtime($data[9]));
$atime = POSIX::strftime('%Y/%m/%d - %T', localtime($data[8]));
$type = mimetype("$cwd/$in{'name'}");

print "{\n";
print "\"size\": \"$size\",\n";
print "\"owner\": \"$user\",\n";
print "\"group\": \"$group\",\n";
print "\"permissions\": \"$permissions\",\n";
print "\"mtime\": \"$mtime\",\n";
print "\"atime\": \"$atime\",\n";
print "\"type\": \"$type\"\n";
print "}";