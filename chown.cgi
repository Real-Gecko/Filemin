#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();
my @errors;


if(!$in{'owner'} or !$in{'group'}) {
    print encode_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

(my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'});
my $grid = getgrnam($in{'group'});
my $recursive;
if($in{'recursive'}) { $recursive = '-R'; } else { $recursive = ''; }

if(! defined $login) {
    push @errors, "$in{'owner'} $text{'error_user_not_found'}";
}

if(! defined $grid) {
    push @errors, "$in{'group'} $text{'error_group_not_found'}";
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    foreach $name (split(/\0/, $in{'name'})) {
#        if(!chown $uid, $grid, $cwd.'/'.$name) {
        if(system_logged("chown $recursive $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
            push @errors, "$name - $text{'error_chown'}: $?";
        }
    }
	if (scalar(@errors) > 0) {
	    print status('error', \@errors);
	} else {
		print status('success', 1);
	}
}
