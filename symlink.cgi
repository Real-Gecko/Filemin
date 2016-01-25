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
        print encode_json({'error' => $text{'error_pasting_nonsence'}});
    } else {
        my @errors;
        for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
            chomp($arr[$i]);
            $arr[$i] =~ s/\.\.//g;
            $arr[$i] = &simplify_path($arr[$i]);
            if (-e $cwd.$arr[$i]) {
                push @errors, $cwd.$arr[$i]." $text{'error_exists'}";
            } else {
                system("ln -s ".quotemeta($from.$arr[$i]).
                       " ".quotemeta($cwd.$arr[$i])) == 0 or push @errors, $from.$arr[$i]." $text{'error_symlink'} $!";
            }
        }
        if (scalar(@errors) > 0) {
            print encode_json({'error' => $errors});
        } else {
            print encode_json({'success' => '1'});
        }
    }
} else {
    print("{\"error\": \" Error .buffer $!\"}");
}
