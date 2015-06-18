require 'filemin-lib.pl';

sub acl_security_form {
    my ($access) = @_;
    print &ui_table_row($text{'acl_allowed_paths'}, ui_textarea("allowed_paths", join("\n", split(/\s+/, $access->{'allowed_paths'})), 10, 80, undef, undef, "style='width: 100%'"));
}

sub acl_security_save {
    my ($access, $in) = @_;
    local @allowed_paths = split(/\s+/, $in->{'allowed_paths'});
    if (scalar(@allowed_paths) == 0) { &error("No allowed paths defined"); }
    for $path(@allowed_paths) {
        if (!-e $path && $path ne '$HOME' && $path ne '$ROOT') {
            &error("$path does not exist");
        }
    }
    $access->{'allowed_paths'} = join(" ", @allowed_paths);
}
