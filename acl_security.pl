require 'filemin-lib.pl';

sub acl_security_form {
    my ($access) = @_;
#    print &ui_columns_start();
#    print &ui_table_row("Allow creation of websites?", ui_yesno_radio("create", $access->{'create'}));
    print &ui_table_row($text{'acl_allowed_paths'}, ui_textarea("allowed_paths", join("\n", split(/\s+/, $access->{'allowed_paths'})), 10, 80, undef, undef, "style='width: 100%'"));
#    print &ui_columns_end();
}

sub acl_security_save {
    my ($access, $in) = @_;
    local @allowed_paths = split(/\s+/, $in->{'allowed_paths'});
    for $path(@allowed_paths) {
        if (!-e $path) {
            &error("$path does not exist");
        }
    }
    $access->{'allowed_paths'} = join(" ", @allowed_paths);
}