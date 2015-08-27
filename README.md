##File manager for Webmin written in Perl.

##Installation:
Package for installation through Webmin interface
For [**Linux**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-0.9.6.linux.wbm.gz) distributions and for [**FreeBSD**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-0.9.6.freebsd.wbm.gz).

**Ubuntu** and **Debian** users may prefer to install with

`dpkg -i [webmin-filemin_0.9.6_all.deb](https://github.com/Real-Gecko/filemin/raw/master/distrib/webmin-filemin_0.9.6_all.deb)`.

Note that _dpkg_ way simply updates module without creating concurrent versions like installation from Webmin interface do.

##Notes for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-info_ package.

`pkg install shared-mime-info`

Otherwise mime recognition will fail resulting usability reduction.
