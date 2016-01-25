##File manager for Webmin written in Perl.
Features modern GUI with the help of numerous JS and CSS libraries. Makes file management on [**Webmin**](https://github.com/webmin/webmin) controlled server much easier.

%100 AJAX - NO page reloads.

### Libraries in use
* [**jQuery**](https://github.com/jquery/jquery)
* [**jQuery UI**](https://github.com/jquery/jquery-ui)
* [**Bootstrap**](https://github.com/twbs/bootstrap)
* [**Font Awesome**](https://github.com/FortAwesome/Font-Awesome)
* [**Bootbox**](https://github.com/makeusabrew/bootbox)
* [**Bootstrap Hover Dropdown Plugin**](https://github.com/CWSpear/bootstrap-hover-dropdown)
* [**Bootstrap-submenu**](https://github.com/vsn4ik/bootstrap-submenu)
* [**Bootstrap Table**](https://github.com/wenzhixin/bootstrap-table)
* [**jQuery File Upload Plugin**](https://github.com/blueimp/jQuery-File-Upload)
* [**PNotify**](https://github.com/sciactive/pnotify)
* [**CodeMirror**](https://github.com/codemirror/CodeMirror)

##Contributors
* [**Real-Gecko**](https://github.com/Real-Gecko)
* [**Jamie Cameron**](https://github.com/jcameron)
* [**Ilia Rostovtsev**](https://github.com/qooob)
* [**Zen4All**](https://github.com/Zen4All)
* [**ffrewer**](https://github.com/ffrewer)
* [**SavageCore**](https://github.com/SavageCore)

##Installation:
Package for installation through Webmin interface
For [**Linux**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-0.9.6.linux.wbm.gz) distributions and for [**FreeBSD**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-0.9.6.freebsd.wbm.gz).

[**Ubuntu**](https://github.com/Real-Gecko/filemin/raw/master/distrib/webmin-filemin_0.9.6_all.deb) and [**Debian**](https://github.com/Real-Gecko/filemin/raw/master/distrib/webmin-filemin_0.9.6_all.deb) users may prefer to install with

`dpkg -i webmin-filemin_0.9.6_all.deb`.

Note that _dpkg_ way simply updates module without creating concurrent versions like installation from Webmin interface do.

##Notes for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-info_ package.

`pkg install shared-mime-info`

Otherwise mime recognition will fail resulting usability reduction.
