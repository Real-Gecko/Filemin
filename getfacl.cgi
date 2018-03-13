#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

print_ajax_header();

# Remove exploiting "../"
$name = $in{'name'};
$name =~ s/\.\.//g;
$name = &simplify_path($name);

# my @errors;

# $command = "getfacl ".quotemeta("$cwd$name")." 2>&1";
# $result = `$command`;

# print Mojo::JSON::to_json({'success' => "$result"});

$out = &backquote_command("getfacl ".quotemeta("$cwd$name")." 2>&1");
if ($?) {
        print $out,"\n";
        }
else {
        foreach $l (split(/\n/, $out)) {
                $l =~ s/#.*$//;
                $l =~ s/\s+$//;
                push(@rv, $l) if ($l =~ /\S/);
                }
        if (!@rv) {
                print "Filesystem does not support ACLs\n";
                }
        else {
                print "\n";
                foreach $l (@rv) {
                    # $l =~ s/:/ /g;
                if (index($l, "user") != -1) {
                         print $l,"\n";
                        }
                }
        }
}

