File manager for Webmin written in Perl.

Installation:
Ready to install packages can be downloaded from "distrib" directory.
Packages for installation through Webmin interface "filemin-0.9.2.linux.wbm.gz" for Linux distributions
and  "filemin-0.9.2.freebsd.wbm.gz" for FreeBSD.
Ubuntu and Debian users may prefer to install with "dpkg" - webmin-filemin_0.9.2_all.deb.
Note that "deb" way simply updates module without creating concurrent versions like installation from Webmin interface do.

FreeBSD users are recommended to install "shared-mime-inifo" package.
`pkg install shared-mime-info`
Otherwise mime recognition will fail resulting usability reduction.
Module uses Regexp::Common and URI packages to validate URIs in HTTP/FTP download functionality.
Linux distributions usually have them installed while FreeBSD not.
Be sure to install theese to make functionality work.
