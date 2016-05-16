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
    if ($cwd eq &simplify_path($base.$dir) & $act eq "cut")  {
        push @errors, $text{'error_pasting_nonsence'};
    } else {
        for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
            chomp($arr[$i]);
            $arr[$i] =~ s/\.\.//g;
            $arr[$i] = &simplify_path($arr[$i]);
            my @p = split('/', $arr[$i]);
            my $name = pop(\@p);
            my $suggested_name = suggest_filename($cwd, $name);
            if ($act eq "copy") {
                system("cp -r ".quotemeta($base.$arr[$i]).
                       " ".quotemeta("$cwd/$suggested_name")) == 0 or push @errors, $base.$arr[$i]." $text{'error_copy'} $!";
            } elsif ($act eq "cut") {
                system("mv ".quotemeta($base.$arr[$i]).
                       " ".quotemeta("$cwd/$suggested_name")) == 0 or push @errors, $base.$arr[$i]." $text{'error_copy'} $!";
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
        my $success_text = ($act eq "copy") ? $text{'copy_complete'} : $text {'move_complete'};
        print("{\"success\" : \"1\", \"text\" : \"$success_text\"}");
    }
} else {
    print("{\"error\": \" Error .buffer $!\"}");
}
