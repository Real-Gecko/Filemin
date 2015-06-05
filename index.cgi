#!/usr/bin/perl
# File manager written in perl

#$unsafe_index_cgi = 1;
require './filemin-lib.pl';
use lib './lib';
use File::MimeInfo;
use POSIX;
use File::Basename;

&switch_to_remote_user();
&init_config();

&ReadParse();

get_paths();

%access = &get_module_acl();
use Data::Dumper;

unless (opendir ( DIR, $cwd )) {
    $path="";
    print_errors("$text{'error_opendir'} $cwd $!");
} else {

    &ui_print_header(undef, "Filemin", "");
##########################################
#---------LET DA BRAINF###ING BEGIN----------BANG
#    print Dumper(\%access);
    @allowed_paths = split(/\s+/, $access{'allowed_paths'});
#    print Dumper(\@allowed_paths);

    @list2 = readdir(DIR);
    closedir(DIR);
    @list2 = sort(@list2);
    $level = scalar(split("/", " $cwd"));
#    print Dumper($level);
    shift(@list2);
    shift(@list2);
    $cwd2 = $cwd;
    $cwd2 =~ s/(.*)\/$//g;
    @list2 = map {"$cwd2/$_"} @list2;
#    @list2 = grep {$_ eq '/home' || $_ eq '/root' || $_ eq '/usr'} @list2;
#    for $path
#    my @list3 = ();
    for $path(@allowed_paths) {
        push @list3, grep {$path =~ /$_/ || $_ =~ /$path\//} @list2;
    }
    map {$_ =~ s/$cwd//} @list3;
    @list = @list3;

#    print '<pre>';
#    print Dumper(\@list);
#    print '</pre>';    
#    exit();
#########################################
#    opendir ( DIR, $cwd );
#    @list = readdir(DIR);
#    closedir(DIR);
#    @list = sort(@list);

    #remove '.' and '..' from file list
#    shift(@list);
#    shift(@list);

    if ($current_theme eq 'authentic-theme' or $current_theme eq 'bootstrap') {
        print_interface();
    } else {
        print_legacy_interface();
    }

    &ui_print_footer("/", $text{'index'});
}
