#!/usr/bin/perl
# File manager written in perl

require './filemin-lib.pl';
use lib './lib';

&ReadParse();
get_paths();

# Print header
print "Content-Security-Policy: script-src 'self' cdnjs.cloudflare.com 'unsafe-inline'; frame-src 'self'\n";
print "Content-type: text/html; Charset=utf-8\n\n";

# Set 'root' icon
if($base eq '/') {
    $root_icon = "<i class='fa fa-hdd-o'></i>";
} else {
    $root_icon = "<i class='fa fa-user text-light'></i>";
}

# Load user bookmarks
$bookmarks = get_bookmarks();

# Transfer Filemin locale to JSON
my $user = $remote_user_info[0];
my $language;

if($gconfig{'lang_'.$user}) {
    $language = $gconfig{'lang_'.$user}
} else {
    $language = $gconfig{'lang'};
}

%user_locale = ();
%en_locale = ();

&read_file_cached("./lang/en", \%en_locale);

if(-e "./lang/$language") {
    &read_file_cached("./lang/$language", \%user_locale);
}

# Fill up untranslated strings with "en" strings
for my $key(keys %en_locale) {
    if(!exists $user_locale{$key}) {
        $user_locale{$key} = $en_locale{$key};
    }
}

$text_to_js = Mojo::JSON::to_json(\%user_locale);

# Load interface templates
$main_menu = get_template('main_menu.html');
$context_menu = get_template('context_menu.html');
$context_menu_search = get_template('context_menu_search.html');
$ dialogs = get_template('dialogs.html');

# Print main interface
print_template('index.html');
