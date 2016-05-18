# Change Log

## [1.1.3] -
### Fixed
- Fixed #104
- Fixed "Nested quantifiers in regex" caused by some dir names

### Added
- Upload can be cancelled
- Reload button in editor

### Changed
- Upload will interrupt if error occurs

## [1.1.2] - 2016-05-16
### Fixed
- Fixed localization on "copy/cut/paste" messages
- Fixed #102
- Fixed #99

### Added
- Polish translation by [Piotr Kozica](https://github.com/vipkoza)
- "copy/paste" to the same directory will create duplicates like "failo_copy.tar.gz"
- Added message on copy start and end
- Prevent overwriting Filemin with outdated core version of da module

### Changed
- Modified toolbar styling a little
- Made selection highlighting more contrast

## [1.1.1] - 2016-03-25
### Fixed
- Fixed notifications bugs
- Fixed The Unified compatibility
- Fixed filenames escaping on the userside - #98
- Fixed non-latin folder names handling during session load

### Added
- Added 'Checking for update' message
- Added module configuration link to index.cgi
- Dutch translation by [Zen4All](https://github.com/Zen4All)
- Filemin now follows window resize event - #92

### Changed
- Updated Bootstrap Table to version 1.10.1, patch is not needed any more
- Russian translation updated

## [1.1.0] - 2016-02-08
### Fixed
- Fixed HTML special characters decoding - #82
- Fixed relative symlinks navigation in "chroot"
- Checked scripts for incorrect variables usage - #90
- Security tightening
- Modal forms submitted via AJAX on CR key instead of reloading page
- Fixed tooltips width

### Added
- Automagic update - #86
- Multiple navigator tabs
- Treeview folder structure - #68
- Sessions, tabs are saved and restored
- Row is highlighted on context menu call if no other rows selected
- Extended symlinks support
- Images preview
- Listing archive contents
- Get multiple folder sizes - #50
- CodeMirror mode selector

### Changed
- Modified Bootstrap modals appearing style
- Change Log is now in Markdown format
- File sizes are rounded to two decimals
- More contrast notifications
- Check for editable files done on the user side
- Search results are opened in separate tab
- Default left click behavior change - #79
  * Editable files opened for edition
  * Images previewed
  * Archives listed

## [1.0.0] - 2016-01-25
### Changed
- Complete AJAX'ification of the project
- Completely rewrote UI part

## [0.9.6] - 2015-08-27
### Fixed
- Fixed 'Undefined subroutine &filemin::ceil Caused on some systems by not including POSIX package in filemin-lib.pl.
- Fixing conflict with Authentic Theme codeMirror by Ilia. #42
- Working as non UNIX user is now possible. By Jamie Cameron. #52
- Pasting a directory either by copy or cut pasted not the directory, but it's content. #54

### Added
- Added ACL options to allowing running as a specific user, thanks Jamie :)
- Module is now installable from Usermin. When running in Usermin, access is always as the connected user. #46

### Changed
- WARNING: work as root is now DEFAULT behavior.
  IF YOU GRANTED FILEMIN ACCESS TO ANY USERS NOT SUPPOSED TO WORK AS ROOT - GO AND CHECK ACL!!!
- Major Authentic interface improvement by Ilia Rostovtsev
    1. Working sorting files by size (with next Authentic Theme - perfectly, now just alright).
       This fix will also prevent fatal code breaks despite of user settings
    2. Store user chose on columns sorting upon page refresh
    3. Hide paginations when there is nothing to paginate.
    4. Let user navigate with arrows (left/right) when trying to do pagination
- Code cleanup and security tightening by Jamie Cameron

## [0.9.5] - 2015-08-07
### Fixed
- Permissions column configurable and displayable. #35
- README instructions for Debian/Ubuntu fixed. #36

### Added
- Made top level menu items translatable.
- Added https://github.com/Real-Gecko/filemin/pull/29. Selected rows also highlight on hover + color tweaks, by https://github.com/qooob
- Added error message if file saving fails.
- Removed not working "Help" link for now.

### Changed
- Some code cleanup, got rid of Regexp::Common and URI dependencies. Thanks to Jamie Cameron.

## [0.9.4] - 2015-07-31
### Fixed
- Removed Data::Dumper declaration. #31

### Added
- Implemented "Search". Users may search files and folders by name, wildcards supported.
- Added per user configuration.
  Users now can individually configure some display options.
    * Items per page - how many entries to display in one page, OLD THEMES ONLY!.
    * Columns - users can check which columns he/she wants to see.
    * Authentic theme users may disable pagination completely.
    * Choose toolbar style between menu with dropdowns or good old "all in one".
    * Manage personal bookmarks
- Implemented "Bookmarks" functionality.
  Users can now bookmark current directory.
  Bookmarks are managed in per user module settings.
- Added "Save and close" button on file edit page.
  Save button now saves and reopens file for editing again,
  while save and close saves and redirects back to originated folder.
- Added Codemirror to module for syntax highlighting, thanks to https://github.com/pabloko for solution. #21
  Under Authentic 14.01 now works too, thanks to https://github.com/qooob for fix.
- Added new toolbar style - menu-like with dropdowns (Authentic only). #28
- Added zip compression method, user now can select between 'zip' and 'tar' compression methods. #24

### Changed
- Update Russian translation.
- Chmodding now have new option to apply new permissions to: #27
  * Selected directories and files only
  * Selected files and directorires and files in selected directories
  * All (recursive)
  * Selected files and files under selected directories and subdirectories
  * Selected directories and subdirectories
- Symlinked inode-mount-point.png to inode-directory.png. Mount points displayed with 'directory' icon.
- Made toolbar more compact under modern themes.

## [0.9.3] - 2015-07-16
### Added
- Specially for Fireserver developers http://www.fireserver.com.br/index_en.html
  Added "Work as root" option to ACL, if enabled for any particular user he/she will work as 'root',
  but directory access will still be limited to those listed in ACL.
  BEWARE!!! DO NOT ENABLE THIS OPTION FOR ANYONE UNLESS YOU'RE REALLY SURE WHAT ARE YOU DOING!!!
- YAML files are now editable. #17
- Using Perl's '-d' to determine if entry is file or folder. #20

### Changed
- Removed unused CGI dependency.
- "Increased" download speed by increasing buffer length in download.cgi.
- Some syntax errors fixed in english translation, thanks to https://github.com/Zen4All

## [0.9.2] - 2015-06-18
###Fixed
- CRLF is replaced with UNIX style LF while saving a file. #11
- Removed "openlayers" folder. How did it get in here???? :D
- Fixed "select-unselect" checkbox behavior for old themes.
- Fixed copy/cut/paste functionality.

### Added
- THE LONG WAITED! THE MOST WANTED! THE ONE AND ONLY - ACL!!!
  Default ACL behavior sets only one ACL entry '$HOME' for each user. This locks user in $HOME directory.
  To grant full FS access to user replace '$HOME' with '$ROOT' in user's ACL.
  If there's only one entry in ACL then it counts as "home" or "chroot", otherwise user will see accessible dirs relative to "/", just like it is in old FM.
  Avoid trailing slash in ACL entries: "/usr/share/webmin" - gooooood, "/home/test/" - baaaaad.
  Root bypasses ACL completely.
  Note that even though user can be granted full FS access, he still works with his own privileges.
  So anything that requires "root" permissions or "sudo" won't work.
- Switched to Webmin functions for HTTP/FTP Download, so download progress is shown now. Got rid of File::Fetch dependecy in module code.
- HTTP/FTP Download now prompts for username and password on remote server, if any required user can provide it.
- FreeBSD support added.

### Changed
- Completely rewrote upload.cgi. Now upload progress is shown with Webmin's upload tracker.
  Memory usage is low due to direct HD write, even with REALLY big uploads(tested with 3 files totalling 1.61 GB).
  BEWARE: if user reaches his/her disk quota then Webmin simply resets connection with no errors, can do nothing with it right now.
- Updated russian translation.
- Folders go first.
  Rewrote directory listing procedure, now folders appear before files in list as in any other adequate file manager.
  As a result first and second entry in '/' are now visible :)
  Note that sorting table with javascript under Authentic or Framed themes will mix everything again until page reload ;-)
- Major code cleanup of rendering procedure.
  Module uses Regexp::Common and URI packages to validate URIs in HTTP/FTP download functionality.
  Be sure to install theese to make functionality work.
  Admin user created during Webmin installation is not UNIX user, so module won't work for him.
  If you want to provide some "system" file operations then convert "root" to Webmin user.

## [0.9.1] - 2015-05-29
### Fixed
- Not sure if it was an issue, cause I was unable to reproduce "User without $HOME" scenario. However added some code to handle this, just in case. #8

### Added
- Added BWTheme support.
- Major interface imprevements for legacy dialogs, jQuery and jQueryUI shipped with the module for this purpose.
- Added $in{'...'} parameters check in some operations to prevent errors if user submits emtpy form by hitting "Enter".
- Added sticky bit and setgid to chmod.
- Added .deb package for distribution flexibility.
- Added HDD icon for "/" while under root for legacy themes. #5

### Changed
- Changed license to BSD style.
- Chown now asks for group too.
- Slight interface improvements for modern dialogs.
- Changed textarea font to monospace.
- Chmod and chown can be done recursively.
- Made list table more compact for Bootstrap enabled themes.
- Removed group column, group is displayed now within "Owner User" column: "root:root", "realgecko:users" etc.
- Modified date/time display format for better sorting under Authentic theme.
- Added "Refresh" quick button for modern themes, just for fun :D
- Added a work around to fix JS hell provided by Framed Theme family with "onmouseover" and "onmouseout" events, that led to unselectable rows by "Select All" and "Inverse Selection" operations.
- Using the same class to highlight rows as Authentic.
- Moved icons to images folder, as Authentic Theme author improved third party modules' files handling.
- Switched to Regexp::Common for URI validation in "HTTP Download" operation to avoid additional dependencies. #6
- Removed Archive::* dependencies, all archive extraction procedures now go through system calls. *.tar.gz, *.tar.xz, *.tar.bz2, *.zip archive types tested. #7

## [0.9] - 2015-05-08
### Mielstone reached
- Checks for overwrites while using paste, new folder, new file, upload, http download ... at last :D
  If file exists it will not be overwritten.
- BEWARE: uncompressing archive still overwrites existing files!

### Fixed
- Some misspellings fixed. #3
- Minor tweaks for modern interface
- More verbose output on errors

### Changed
- After long discussion upper-left toolbar finally looks good in modern interface. #1
  Thanks to https://github.com/Goeny for his brilliant solution and https://github.com/qooob for debugging
- Replaced '~' for '/' directory with FontAwesome's HDD icon, still open for discussion... #5

## [0.8.3] - 2015-05-06
### Added
- Added tooltips for icons on toolbar
- Message appears if nothing selected and user tries copy/cut/compress/chmod/chown/delete

## [0.8.2] - 2015-05-06
### Fixed
- Various bug fixes

### Added
- Added Authentic Theme support
- Check for overwrites during http download, and only there for now...

### Changed
- "root" is not locked in his "~" dir anymore

## [0.8.1] - 2015-05-04
- Initial release
