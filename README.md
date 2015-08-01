##File manager for Webmin written in Perl.

##Installation:
Ready to install packages can be downloaded from [here](https://github.com/Real-Gecko/filemin/tree/master/distrib).

Packages for installation through Webmin interface _filemin-x.x.x.linux.wbm.gz_ for **Linux** distributions and _filemin-x.x.x.freebsd.wbm.gz_ for **FreeBSD**.

**Ubuntu** and **Debian** users may prefer to install with _dpkg_ - _webmin-filemin_x.x.x_all.deb_.

Note that _dpkg_ way simply updates module without creating concurrent versions like installation from Webmin interface do.

##Notes for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-inifo_ package.
`pkg install shared-mime-info`
Otherwise mime recognition will fail resulting usability reduction.

Module uses _Regexp::Common_ and _URI_ packages to validate URIs in HTTP/FTP download functionality.
Linux distributions usually have them installed while FreeBSD not.
Be sure to install theese to make functionality work.
