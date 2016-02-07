#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(open(my $fh, "<".&get_paste_buffer_file())) {
    my @arr = <$fh>;
    close($fh);
    my $act = $arr[0];
    my $dir = $arr[1];
    chomp($act);
    chomp($dir);
    $dir =~ s/\.\.//g;
    $dir = &simplify_path($dir);
    my @errors;
    for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
        chomp($arr[$i]);
        $arr[$i] =~ s/\.\.//g;
        $arr[$i] = &simplify_path($arr[$i]);
        my @p = split('/', $arr[$i]);
        my $name = pop(\@p);
        if ($act eq "copy") {
            if (-e "$cwd/$name") {
                push @errors, "<b>$cwd/$name</b> $text{'error_exists'}";
            } else {
                system("cp -r ".quotemeta($base.$arr[$i]).
                       " ".quotemeta($cwd)) == 0 or push @errors, $base.$arr[$i]." $text{'error_copy'} $!";
            }
        } elsif ($act eq "cut") {
            if (-e "$cwd/$name") {
                push @errors, "<b>$cwd/$name</b> $text{'error_exists'}";
            } else {
                system("mv ".quotemeta($base.$arr[$i]).
                       " ".quotemeta($cwd)) == 0 or push @errors, $base.$arr[$i]." $text{'error_copy'} $!";
            }
        }
    }
    if (scalar(@errors) > 0) {
        $result = '';
        foreach $error(@errors) {
            $result.= "$error<br>";
        }
        print '{"error": "'.$result.'"}';
    } else {
        print encode_json({'success' => '1'});
    }
} else {
    print("{\"error\": \" Error .buffer $!\"}");
}
