# AddFileExtension
## Purpose
Allows you to add files to your working folder by typing in a path relative to the working folder.
Missing subfolders are created automatically.
## Usage

Using the command palette:

* Bring up the command palette, and select "Folder: Add file".
* In the input box, type the path to your file, according to behaviour table below.
* Press [Enter] to confirm, or [Escape] to cancel.

Keyboard shortcut:

* Add a user keyboard shortcut for command "addfileextension.addFile"

Table of behaviors:

Project folder open | Text editor open | Given path begins with '/' | Behavior
---|----|----|----
✓ | ✓ | ✓ | Create path relative to workspace root
✓ | ✓ | ✗ | Create path relative to active file
✓ | ✗ | ✓ | Create path relative to workspace root
✓ | ✗ | ✗ | Create path relative to workspace root
✗ | ✓ | ✓ | Error message: "Paths beginnning with '/' not allowed when no project folder is open"
✗ | ✓ | ✗ | Create path relative to active file
✗ | ✗ | N/A | Falls back on the built-in new file command

Your file will be opened in a new editor window, and shown in working files.

You may now save the file, which will add it to your working folder (along with any directory that needs to be created), or dismiss the editor and discard the unsaved file in working files if you changed your mind.

### Windows

You may use Unix-like path separators if you like (you do not have to, but they can sometimes be easier to type on international keyboards), e.g. 'foo/bar/myfile.ts' if you intend to add 'foo\bar\myfile.ts'.
