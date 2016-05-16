use WebminCore;
&init_config();

sub module_uninstall {
    system("chmod 755 $module_root_directory");
    system("chattr -R -i $module_root_directory");
}
