#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Mojo::JSON;

&ReadParse();
get_paths();

# Exploits, exploits everywhere
if(!$in{'archivename'} || ($in{'method'} ne 'tar' && $in{'method'} ne 'zip')) {
    print Mojo::JSON::to_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

# Prevent exploiting "../"
$archivename = $in{'archivename'};
$archivename =~ s/\.\.//g;
&simplify_path($archivename);

my $command;

if($in{'method'} eq 'tar') {
    $archivename .= ".tar.gz";
} elsif($in{'method'} eq 'zip') {
    $archivename .= ".zip";
}

my $tempfile = transname();

if($in{'method'} eq 'tar') {
    $command = "tar czf ".quotemeta($tempfile).
           " -C ".quotemeta($cwd);
} elsif($in{'method'} eq 'zip') {
    $command = "cd ".quotemeta($cwd)." && zip -r ".
           quotemeta($tempfile);
}

foreach my $name(split(/\0/, $in{'name'}))
{
    $name = sanitize($name);
    $name =~ s/$in{'cwd'}\///ig;
    $command .= " ".quotemeta($name);
}

system_logged($command);

my $size = -s $tempfile;

print "Content-Type: application/x-download\n";
print "Content-Disposition: attachment; filename=\"$archivename\"\n";
print "Content-Length: $size\n\n";
open (FILE, "< $tempfile") or die "can't open $tempfile: $!";
binmode FILE;
local $/ = \102400;
while (<FILE>) {
    print $_;
}
close FILE;
