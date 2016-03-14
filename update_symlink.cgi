#!/usr/bin/perl

require './filemin-lib.pl';
use lib './lib';
use JSON;

&ReadParse();

if(!$in{'name'}) {
    print("{\"error\": \"1\"}");
}

my @errors;

get_paths();

print_ajax_header();

# Remove exploiting "../" in new file names
$name = $in{'name'};
$name =~ s/\.\.//g;
&simplify_path($name);

$link = $in{'link'};
if(-e $link) {
    $target = $link;
} elsif(-e "$cwd/$link") {
    $target = &simplify_path("$cwd/$link")
} else {
    push @errors, $text{'invalid_symlink_target'};
}

if($target) {
    my $error = 1;
    for $allowed_path (@allowed_paths) {
        if (&is_under_directory($allowed_path, $target) ||
            $allowed_path =~ /^$target/) {
            $error = 0;
        }
    }
    if ($error) {
        push @errors, &text('notallowed',
                            &html_escape($target),
                            &html_escape(join(" , ", @allowed_paths)));
    }
}

if (scalar(@errors) > 0) {
    print encode_json({'error' => \@errors});
} else {
    my $command = "ln -sfn ".quotemeta($link)." ".quotemeta("$cwd/$name");
    system($command) == 0 or push @errors, $target." $text{'error_symlink'} $!";
    print encode_json({'success' => '1'});
}
