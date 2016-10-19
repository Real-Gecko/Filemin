#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use Mojo::JSON;

&ReadParse();
get_paths();

print_ajax_header();
my @errors;

# Exploits, exploits everywhere
if(!$in{'archivename'} || ($in{'method'} ne 'tar' && $in{'method'} ne 'zip')) {
    print Mojo::JSON::to_json({'error' => $text{'provide_correct_parameters'}});
    exit;
}

# Remove exploiting "../" in new file names
$archivename = $in{'archivename'};
$archivename =~ s/\.\.//g;
&simplify_path($archivename);

my $command;

if($in{'method'} eq 'tar') {
    $command = "tar czf ".quotemeta("$cwd/$archivename.tar.gz").
           " -C ".quotemeta($cwd);
} elsif($in{'method'} eq 'zip') {
    $command = "cd ".quotemeta($cwd)." && zip -r ".
           quotemeta("$cwd/$archivename.zip");
}

foreach my $name(split(/\0/, $in{'name'}))
{
    $name =~ s/\.\.//g;
    &simplify_path($name);
    $name =~ s/$in{'cwd'}\///ig;
    $command .= " ".quotemeta($name);
}

system_logged($command);

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
