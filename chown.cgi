#!/usr/bin/perl

require './filemin-lib.pl';
&switch_to_remote_user();

&ReadParse();

get_paths();

(my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'});

if(! defined $login) {
    print_errors("<b>$in{'owner'}</b> $text{'error_user_not_found'}");
} else {
    my @errors;
    foreach $name (split(/\0/, $in{'name'})) {
        if(!chown $uid, $gid, $cwd.'/'.$name) {
            push @errors, "$name - $text{'error_chown'}: $!";
        }
    }
    if (scalar(@errors) > 0) {
        print_errors(@errors);
    } else {
        &redirect("index.cgi?path=$path");
    }
}
