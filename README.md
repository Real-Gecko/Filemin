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
* [**Fancytree**](https://github.com/mar10/fancytree)
* [**markdown-js**](https://github.com/evilstreak/markdown-js)

###Developed with
[**Codiad Web IDE**](https://github.com/Codiad/Codiad)

###Icon theme by Matthieu James
[**Faenza Icon Theme**](https://code.google.com/archive/p/faenza-icon-theme)

##Contributors
* [**Real-Gecko**](https://github.com/Real-Gecko)
* [**Jamie Cameron**](https://github.com/jcameron)
* [**Ilia Rostovtsev**](https://github.com/qooob)
* [**Zen4All**](https://github.com/Zen4All)
* [**ffrewer**](https://github.com/ffrewer)
* [**SavageCore**](https://github.com/SavageCore)
* [**Piotr Kozica**](https://github.com/vipkoza)

##Installation:
Package for installation through Webmin interface
For [**Linux**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-2.0.2.linux.wbm.gz) distributions and for [**FreeBSD**](https://github.com/Real-Gecko/filemin/raw/master/distrib/filemin-2.0.2.freebsd.wbm.gz).

[**Ubuntu**](https://github.com/Real-Gecko/filemin/raw/master/distrib/webmin-filemin_2.0.2_all.deb) and [**Debian**](https://github.com/Real-Gecko/filemin/raw/master/distrib/webmin-filemin_2.0.2_all.deb) users may prefer to install with

`dpkg -i webmin-filemin_2.0.2_all.deb`.

Note that _dpkg_ way simply updates module without creating concurrent versions like installation from Webmin interface do.

## Update
As of version 1.1.0 Filemin automatically checks for udpate and offers to install it if available.
However currently Webmin itself bundles outdated 0.9 branch of the module and new version of Filemin is always downgraded with Webmin update.
To avoid the issue since version 2.0.0 Filemin installs additional Filemin Updater module. Just click "Filemin Updater" option in "Others" menu of Webmin to reinstall Filemin.

##Note for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-info_ package.

`pkg install shared-mime-info`

Otherwise mime recognition will fail resulting usability reduction.
