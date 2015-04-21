#!/usr/bin/perl

require './filemin-lib.pl';
use CGI ':standard';
&switch_to_remote_user();

#separate parsing of params for multiupload feature

local @uinfo = getpwnam($remote_user);
$base = $uinfo[7] ? $uinfo[7] : "/";
$path = param('path') ? param('path') : '';
$cwd = abs_path($base.$path);
if (index($cwd, $base) == -1) {
    $cwd = $base;
}

my @upfiles = param('upfiles');

if (defined @upfiles) {
    foreach my $upfile(@upfiles)
    {
#        print "$upfile<br />";
        my $nBytes = 0;
        my $totBytes = 0;
        my $buffer = "";
        open(OUTFILE, ">$cwd/$upfile") or die "Can't open $cwd/$upfile for writing - $!";
        binmode($upfile);
        while ( $nBytes = read($upfile, $buffer, 1024) )
        {
            print OUTFILE $buffer;
            $totBytes += $nBytes;
        }
        close(OUTFILE);
#        print "uploaded $totBytes bytes<br />";
    }
}
&redirect("index.cgi?path=$path");
