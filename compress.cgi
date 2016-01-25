#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();
get_paths();

print_ajax_header();

if(!$in{'archivename'}) {
    print encode_json({'error' => \@errors});
}

# Remove exploiting "../" in new file names
$archivename = $in{'archivename'};
$archivename =~ s/\.\.//g;
&simplify_path($archivename);

my @errors;

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
    $name =~ s/$in{'cwd'}\///ig;
    $command .= " ".quotemeta($name);
}

system_logged($command);

if (scalar(@errors) > 0) {
    print encode_json({'error' => \@errors});
} else {
    print encode_json({'success' => 1});
}
