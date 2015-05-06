#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

$tmpdir = $base.'/.filemin';

open(my $fh, "< $tmpdir/.buffer") or die "Error: $!";
my @arr = <$fh>;
close($fh);
my $act = $arr[0];
my $dir = $arr[1];
chomp($act);
chomp($dir);
#&ui_print_header(undef, $text{'edit_file'}, "");
#if ("$base/$dir" eq $path) { print "Copying to same directory is stupid lol"; exit; }
#print $base.$path;
for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
    chomp($arr[$i]);
    if ($act eq "copy"){
        system("cp -r ".$base.$dir."/$arr[$i] ".$base.$path);# or die "Copying failed: $!";
#        $info = "Copied ".(scalar(@arr) - 2)." files from $dir";
    }
    elsif ($act eq "cut") {
        system("mv ".$base.$dir."/$arr[$i] ".$base.$path);# or die "Copying failed: $!";
    #        rename("$base/$dir/$arr[$i]", "$path");
#        $info = "Moved ".(scalar(@arr) - 2)." files from $dir";
    }
}

&redirect("index.cgi?path=$path");
