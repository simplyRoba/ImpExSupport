# Change Log

## [Unreleased]

* column multicursor

## [0.2.1] - 2018-04-16

## Fixed

* remove syntax highlightng of single quotes #7
* comments are only at start of a line #6

## [0.2.0] - 2018-04-15

## Added

* higlight the data lines whne clicking on a header column
* highlight the next semicolon if possible on an empty column

## Fixed

* remove column highlighting on selections
* fixed an error where lines containing only semicolons was not recognized correctly
* fixed an error where the column highlighting wont work when there are lines with less columns then the header

## [0.1.0] - 2018-04-14

### Added

* column highlighting on header (experimental) disabled by default - set `"impex.editor.columnHighlighting.enabled": true` to enable
* default modifier snippet

## [0.0.2] - 2018-04-08

### Added

* [snippets](docs/Snippets.md) for the header
* improved syntax highlighting a bit
* better marketplace presentation

## [0.0.1] - 2018-04-07

### Added

* rudimental syntax higlighting for strings, some keywords and variables

---
Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.
