use WebminCore;
&init_config();

sub module_install {
    system("chmod 555 $module_root_directory");
    system("chattr -R +i $module_root_directory");
}
