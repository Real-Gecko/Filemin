#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

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

    if ($cwd eq &simplify_path($base.$dir) & ($act eq "cut" || $in{'overwrite'}))  {
        push @errors, $text{'error_pasting_nonsence'};
    } else {
        for(my $i = 2;$i <= scalar(@arr)-1;$i++) {
            chomp($arr[$i]);
            $arr[$i] =~ s/\.\.//g;
            $arr[$i] = &simplify_path($arr[$i]);
            my @p = split('/', $arr[$i]);
            my $name = pop(@p);
            my $suggested_name;
            if ($in{'overwrite'}) {
                $suggested_name = $name;
            } else {
                $suggested_name = suggest_filename($cwd, $name);
            }
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
        print Mojo::JSON::to_json({'error' => $result});
    } else {
        my $success_text = ($act eq "copy") ? $text{'copy_complete'} : $text {'move_complete'};
        print Mojo::JSON::to_json({'success' => 1, 'text' => $success_text, 'from' => $dir});
    }
} else {
    print Mojo::JSON::to_json({'error' => "Error .buffer $!"});
}
