#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();
my @errors;

if(!$in{'user'} or !$in{'role'} or !$in{'type'} or !$in{'level'}) {
    print encode_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

# (my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'});
# my $grid = getgrnam($in{'group'});
my $recursive;
if($in{'recursive'}) { $recursive = '-R'; } else { $recursive = ''; }

# if(! defined $login) {
#     push @errors, "$in{'owner'} $text{'error_user_not_found'}";
# }

# if(! defined $grid) {
#     push @errors, "$in{'group'} $text{'error_group_not_found'}";
# }

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        &simplify_path($name);
        if(
            system_logged(
                "chcon $recursive ".quotemeta($in{'user'}).":".
                quotemeta($in{'role'}).":".
                quotemeta($in{'type'}).":".
                quotemeta($in{'level'})." ".
                quotemeta("$cwd/$name")
            ) != 0) {
            push @errors, "$name - $text{'error_chown'}: $?";
        }
    }
    if (scalar(@errors) > 0) {
        print status('error', \@errors);
    } else {
        print status('success', 1);
    }
}
