#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

my @errors;

my $permissions = $in{'permissions'};

# Fix chmod setuid/setgid to 0 for directories
my $permissions = oct_to_symbolic($permissions);

# Selected directories and files only
if($in{'applyto'} eq '1') {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        $name = &simplify_path($name);
        if (!$name || system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
            push @errors, "$name - $text{'error_chmod'}: $?";
        }
    }
}

# Selected files and directories and files in selected directories
if($in{'applyto'} eq '2') {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        $name = &simplify_path($name);
        if(!$name || system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
            push @errors, "$name - $text{'error_chmod'}: $?";
        }
        if($name && -d "$cwd/$name") {
            if(system_logged("find ".quotemeta("$cwd/$name")." -maxdepth 1 -type f -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        }
    }
}

# All (recursive)
if($in{'applyto'} eq '3') {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        $name = &simplify_path($name);
        if(!$name || system_logged("chmod -R ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
            push @errors, "$name - $text{'error_chmod'}: $?";
        }
    }
}

# Selected files and files under selected directories and subdirectories
if($in{'applyto'} eq '4') {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        $name = &simplify_path($name);
        if($name && -f "$cwd/$name") {
            if(system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        } else {
            if(!$name || system_logged("find ".quotemeta("$cwd/$name")." -type f -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        }
    }
}

# Selected directories and subdirectories
if($in{'applyto'} eq '5') {
    foreach $name (split(/\0/, $in{'name'})) {
        $name =~ s/\.\.//g;
        $name = &simplify_path($name);
        if($name && -d "$cwd/$name") {
            if(system_logged("chmod ".quotemeta($permissions)." ".quotemeta("$cwd/$name")) != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
            if(system_logged("find ".quotemeta("$cwd/$name")." -type d -exec chmod ".quotemeta($permissions)." {} \\;") != 0) {
                push @errors, "$name - $text{'error_chmod'}: $?";
            }
        }
    }
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
