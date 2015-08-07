##File manager for Webmin written in Perl.

##Installation:
Ready to install packages can be downloaded from [here](https://github.com/Real-Gecko/filemin/tree/master/distrib).

Packages for installation through Webmin interface `filemin-x.x.x.linux.wbm.gz` for **Linux** distributions and `filemin-x.x.x.freebsd.wbm.gz` for **FreeBSD**.

**Ubuntu** and **Debian** users may prefer to install with

`dpkg -i webmin-filemin_x.x.x_all.deb`.

Note that _dpkg_ way simply updates module without creating concurrent versions like installation from Webmin interface do.

##Notes for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-info_ package.

`pkg install shared-mime-info`

Otherwise mime recognition will fail resulting usability reduction.
