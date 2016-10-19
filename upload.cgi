#!/usr/bin/perl

require './filemin-lib.pl';
use Cwd 'abs_path';
use lib './lib';

&ReadParse(\%in, "GET");
get_paths();

my @errors;
$line = "";

print_ajax_header();

# Get multipart form boundary
$ENV{'CONTENT_TYPE'} =~ /boundary=(.*)$/ || push @rrors, $text{'readparse_enc'};
$boundary = $1;

# Comment right now
#if ($ENV{'CONTENT_LENGTH'} && $max && $ENV{'CONTENT_LENGTH'} > $max) {
#      &error($err);
#}

#Read the data
while(index($line,"$boundary--") == -1) {
    #reset vars on each loop
    $file = undef;
    $rest = undef;
    $prevline = undef;
    $header = undef;
    $line = <STDIN>;
    $got += length($line);
    if ($upload_max && $got > $upload_max) {
          push @errors, &text('error_upload_emax', &nice_size($upload_max));
          last;
    }
    if ($line =~ /(\S+):\s*form-data(.*)$/) {
                $rest = $2; # We found form data definition, let`s check it
    } else {
        next;
    }
    # Check if current form data part is file
    while ($rest =~ /([a-zA-Z]*)=\"([^\"]*)\"(.*)/) {
        if ($1 eq 'filename') {
            $file = $2;
        }
        $rest = $3;
    }

    if(defined($file)){
        # OK, we have a file, let`s save it
        if (-e "$cwd/$file" and !$in{'overwrite'}) { # Just in case
            push @errors, "$path/$file $text{'error_exists'}";
            last;
        } else {
            if (!open(OUTFILE, ">$cwd/$file")) {
                push @errors, "$text{'error_opening_file_for_writing'} $path/$file - $!";
                last; # Something went wrong, abort!
            } else {
                binmode(OUTFILE);
                # Skip "content-type" as we work in binmode anyway and skip empty line
                <STDIN>; <STDIN>;
                # Read all lines until next boundary or form data end
                while(1) {
                    $line = <STDIN>;
                    if(!length($line)) { # Connection lost or file upload was cancelled, abort!
                        close(OUTFILE);
                        # &rename_file("$cwd/$file", "$cwd/$file~");
                        &unlink_file("$cwd/$file");
                        die;
                    };
                    # Calculate data got
                    $got += length($line);
                    # Some brainf###ing to deal with last CRLF
                    if(index($line,"$boundary") != -1 || index($line,"$boundary--") != -1) {
                        chop($prevline);
                        chop($prevline);
                        if (!print OUTFILE $prevline) {
                            push @errors, "text{'error_writing_file'} $path/$file";
                            last;
                        }
                        last;
                    } else {
                        if (!print OUTFILE $prevline) {
                            push @errors, "text{'error_writing_file'} $path/$file";
                            last;
                        }
                        $prevline = $line;
                    }
                }
                # File saved, let`s go further
                close(OUTFILE);
            }
        }
    } else {
        # Just skip everything until next boundary or form data end
        while(index($line,"$boundary") == -1 or index($line,"$boundary--") == -1) {
            $line = <STDIN>;
        }
    }
}

if (scalar(@errors) > 0) {
    print status('error', \@errors);
} else {
    print status('success', 1);
}
