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
    $from = &simplify_path("$base/$dir");
    if ($cwd eq $from) {
        print("{\"error\": \"$text{'error_pasting_nonsence'}\"}");
    } else {
        my @errors;
        for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
            chomp($arr[$i]);
            $arr[$i] =~ s/\.\.//g;
            $arr[$i] = &simplify_path($arr[$i]);
            if ($act eq "copy") {
                if (-e $cwd.$arr[$i]) {
                    push @errors, "<b>".$cwd.$arr[$i]."</b> $text{'error_exists'}";
                } else {
                    system("cp -r ".quotemeta($from.$arr[$i]).
                           " ".quotemeta($cwd)) == 0 or push @errors, $from.$arr[$i]." $text{'error_copy'} $!";
                }
            } elsif ($act eq "cut") {
                if (-e $cwd.$arr[$i]) {
                    push @errors, "<b>".$cwd.$arr[$i]."</b> $text{'error_exists'}";
                } else {
                    system("mv ".quotemeta($from.$arr[$i]).
                           " ".quotemeta($cwd)) == 0 or push @errors, $from.$arr[$i]." $text{'error_cut'} $!";
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
    }
} else {
    print("{\"error\": \" Error .buffer $!\"}");
}
