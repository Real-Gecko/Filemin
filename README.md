## File manager for Webmin written in Perl.
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

### Developed with
[**Codiad Web IDE**](https://github.com/Codiad/Codiad)

### Icon theme by Matthieu James
[**Faenza Icon Theme**](https://code.google.com/archive/p/faenza-icon-theme)

## Contributors
* [**Real-Gecko**](https://github.com/Real-Gecko)
* [**Jamie Cameron**](https://github.com/jcameron)
* [**Ilia Rostovtsev**](https://github.com/qooob)
* [**Zen4All**](https://github.com/Zen4All)
* [**ffrewer**](https://github.com/ffrewer)
* [**SavageCore**](https://github.com/SavageCore)
* [**Piotr Kozica**](https://github.com/vipkoza)
* [**Denis Kanchev**](https://github.com/Demayl)

## Installation:
Package for installation through Webmin interface
For [**Linux**](https://github.com/Real-Gecko/Filemin/releases/download/2.2.0/filemin-2.2.0.linux.full.wbm.gz) distributions and for [**FreeBSD**](https://github.com/Real-Gecko/Filemin/releases/download/2.2.0/filemin-2.2.0.freebsd.full.wbm.gz).

## Flavours
Filemin comes in different flavours such as:

### Full
Complete installation with all required dependencies, will work literally everywhere even on servers with no acces to Internet.

### Builtin version
Same as **Full**, but opens Filemin in the same tab as Webmin. Works with every theme except Authentic.

### CDN
Sames as full but all required librares are delivered from [cdnjs](https://cdnjs.com/). Takes less space, but requires internet connection to get required JS libraries.

## Update
As of version 1.1.0 Filemin automatically checks for update and offers to install it if available.
However currently Webmin itself bundles outdated 0.9 branch of the module and new version of Filemin is always downgraded with Webmin update.
To avoid the issue since version 2.0.0 Filemin installs additional Filemin Updater module. Just click "Filemin Updater" option in "Others" menu of Webmin to reinstall Filemin.

## Note for FreeBSD users.
FreeBSD users are recommended to install _shared-mime-info_ package.

`pkg install shared-mime-info`

Otherwise mime recognition will fail resulting usability reduction.
