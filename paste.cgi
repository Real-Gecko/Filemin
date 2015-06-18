#!/usr/bin/perl

require './filemin-lib.pl';
use Cwd 'abs_path';
&ReadParse();

get_paths();

$tmpdir = "$remote_user_info[7]/.filemin";

open(my $fh, "< $tmpdir/.buffer") or die "Error: $!";
my @arr = <$fh>;
close($fh);
my $act = $arr[0];
my $dir = $arr[1];
chomp($act);
chomp($dir);
$from = abs_path($base.$dir);
if ($cwd eq $from) {
    print_errors($text{'error_pasting_nonsence'});
} else {    
    my @errors;
    for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
        chomp($arr[$i]);
        if ($act eq "copy") {
            if (-e "$cwd/$arr[$i]") {
                push @errors, "$cwd/$arr[$i] $text{'error_exists'}";
            } else {
                &copy_source_dest("$from/$arr[$i]", $cwd) or push @errors, "$cwd/$arr[$i] $text{'error_copy'} $!";
            }
        }
        elsif ($act eq "cut") {
            if (-e "$cwd/$arr[$i]") {
                push @errors, "$cwd/$arr[$i] $text{'error_exists'}";
            } else {
                &rename_file("$from/$arr[$i]", $cwd) or push @errors, "$cwd/$arr[$i] $text{'error_cut'} $!";
            }
        }
    }
    if (scalar(@errors) > 0) {
        print_errors(@errors);
    } else {
        &redirect("index.cgi?path=$path");
    }
}
