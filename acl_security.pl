require 'filemin-lib.pl';

sub acl_security_form {
    my ($access) = @_;

    # Directories the user can access
    print &ui_table_row($text{'acl_allowed_paths'},
	ui_textarea("allowed_paths",
		    join("\n", split(/\s+/, $access->{'allowed_paths'})),
		    10, 80, undef, undef, "style='width: 100%'"), 2);

    # Run as Unix user
    print &ui_table_row($text{'acl_work_as'},
	ui_radio_table("user_mode", $access->{'work_as_root'} ? 0 :
			            $access->{'work_as_user'} ? 2 : 1,
	       [ [ 0, $text{'acl_root'} ],
		 [ 1, $text{'acl_same'} ],
		 [ 2, $text{'acl_user'},
		   ui_user_textbox("acl_user", $access->{'work_as_user'}) ] ]));
}

sub acl_security_save {
    my ($access, $in) = @_;
    local @allowed_paths = split(/\s+/, $in->{'allowed_paths'});
    if (scalar(@allowed_paths) == 0) { &error("No allowed paths defined"); }
    for $path(@allowed_paths) {
        if (!-e $path && $path ne '$HOME' && $path ne '$ROOT') {
            &error(&text('acl_epath', &html_escape($path)));
        }
    }
    $access->{'allowed_paths'} = join(" ", @allowed_paths);
    if ($in->{'user_mode'} == 0) {
        $access->{'work_as_root'} = 1;
        $access->{'work_as_user'} = undef;
    } elsif ($in->{'user_mode'} == 1) {
        $access->{'work_as_root'} = 0;
        $access->{'work_as_user'} = undef;
    } else {
	defined(getpwnam($in->{'acl_user'})) || &error($text{'acl_euser'});
        $access->{'work_as_root'} = 0;
        $access->{'work_as_user'} = $in->{'acl_user'};
    }
}
