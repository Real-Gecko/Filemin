#!/usr/bin/perl

require './filemin-lib.pl';

&ReadParse();

get_paths();

my @errors;

my $permissions = $in{'permissions'};

=begin
if(defined $in{'chown'}) {
    if (!$in{'owner'} or !$in{'group'}) {
        &redirect("index.cgi?path=$path");
    }

    (my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'});
    my $grid = getgrnam($in{'group'});

    if(! defined $login) {
        push @errors, "<b>$in{'owner'}</b> $text{'error_user_not_found'}";
    }

    if(! defined $grid) {
        push @errors, "<b>$in{'group'}</b> $text{'error_group_not_found'}";
    }
}
=cut

if(defined $in{'chmod'}) {
    # Selected directories and files only
    if($in{'applyto'} eq '1') {
        foreach $name (split(/\0/, $in{'name'})) {
            if (system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        }
    }

    # Selected files and directories and files in selected directories
    if($in{'applyto'} eq '2') {
        foreach $name (split(/\0/, $in{'name'})) {
            if(system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
            if(-d "$cwd/$name") {
                if(system_logged("find ".quotemeta("$cwd/$name")." -maxdepth 1 -type f -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                    push @errors, "$name - $text{'error_chmod'}: $?";
                }
            }
        }
    }

    # All (recursive)
    if($in{'applyto'} eq '3') {
        foreach $name (split(/\0/, $in{'name'})) {
            if(system_logged("chmod -R ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        }
    }

    # Selected files and files under selected directories and subdirectories
    if($in{'applyto'} eq '4') {
        foreach $name (split(/\0/, $in{'name'})) {
            if(-f "$cwd/$name") {
                if(system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                    push @errors, "$name - $text{'error_chmod'}: $?";
                }
            } else {
                if(system_logged("find ".quotemeta("$cwd/$name")." -type f -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                    push @errors, "$name - $text{'error_chmod'}: $?";
                }
            }
        }
    }

    # Selected directories and subdirectories
    if($in{'applyto'} eq '5') {
        foreach $name (split(/\0/, $in{'name'})) {
            if(-d "$cwd/$name") {
                if(system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                    push @errors, "$name - $text{'error_chmod'}: $?";
                }
                if(system_logged("find ".quotemeta("$cwd/$name")." -type d -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                    push @errors, "$name - $text{'error_chmod'}: $?";
                }
            }
        }
    }
}
if(defined $in{'chown'}) {
    if (!$in{'owner'} or !$in{'group'}) {
        &redirect("index.cgi?path=$path");
    }

    (my $login, my $pass, my $uid, my $gid) = getpwnam($in{'owner'});
    my $grid = getgrnam($in{'group'});

    if(!defined $login) {
        push @errors, "<b>$in{'owner'}</b> $text{'error_user_not_found'}";
    }

    if(!defined $grid) {
        push @errors, "<b>$in{'group'}</b> $text{'error_group_not_found'}";
    }

    if (scalar(@errors) == 0) {
        # Selected directories and files only
        if($in{'applyto'} eq '1') {
            foreach $name (split(/\0/, $in{'name'})) {
                if(system_logged("chown $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
                    push @errors, "$name - $text{'error_chown'}: $?";
                }
            }
        }

        # Selected files and directories and files in selected directories
        if($in{'applyto'} eq '2') {
            foreach $name (split(/\0/, $in{'name'})) {
                if(system_logged("chown $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
                    push @errors, "$name - $text{'error_chown'}: $?";
                }
                if(-d "$cwd/$name") {
                    if(system_logged("find ".quotemeta("$cwd/$name")." -maxdepth 1 -type f -exec chown $uid:$grid {} \\;") != 0) {
                        push @errors, "$name - $text{'error_chown'}: $?";
                    }
                }
            }
        }

        # All (recursive)
        if($in{'applyto'} eq '3') {
            foreach $name (split(/\0/, $in{'name'})) {
                if(system_logged("chown -R $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
                    push @errors, "$name - $text{'error_chown'}: $?";
                }
            }
        }

        # Selected files and files under selected directories and subdirectories
        if($in{'applyto'} eq '4') {
            foreach $name (split(/\0/, $in{'name'})) {
                if(-f "$cwd/$name") {
                    if(system_logged("chown $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
                        push @errors, "$name - $text{'error_chown'}: $?";
                    }
                } else {
                    if(system_logged("find ".quotemeta("$cwd/$name")." -type f -exec chown $uid:$grid {} \\;") != 0) {
                        push @errors, "$name - $text{'error_chown'}: $?";
                    }
                }
            }
        }

        # Selected directories and subdirectories
        if($in{'applyto'} eq '5') {
            foreach $name (split(/\0/, $in{'name'})) {
                if(-d "$cwd/$name") {
                    if(system_logged("chown $uid:$grid ".quotemeta("$cwd/$name")) != 0) {
                        push @errors, "$name - $text{'error_chown'}: $?";
                    }
                    if(system_logged("find ".quotemeta("$cwd/$name")." -type d -exec chown $uid:$grid {} \\;") != 0) {
                        push @errors, "$name - $text{'error_chown'}: $?";
                    }
                }
            }
        }
    }
}

if (scalar(@errors) > 0) {
    print_errors(@errors);
} else {
    &redirect("index.cgi?path=$path");
}
