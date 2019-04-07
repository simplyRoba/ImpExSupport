# Change Log

### [Unreleased]

* column multicursor
* shrink modifier for better readability

## [0.2.6] - 2018-xx-xx

### Fixed

* removed a trailing comma in language configuration [#36](https://github.com/simplyRoba/ImpExSupport/issues/36)

## [0.2.5] - 2018-06-06

### Changed

* column highlighting seems to work properly - its enabled by default now
* migrated to gulp v4

### Security

* a lot under the hood changes and test automation (a step further to a complete automated deployment process)

## [0.2.4] - 2018-05-01

### Fixed

* fixed the parsing of strings that are side by side [#20](https://github.com/simplyRoba/ImpExSupport/issues/20)
* fixed a bug where the last column was not recognized 

## [0.2.3] - 2018-04-28

### Fixed

* fixed the parsing of strings [#8](https://github.com/simplyRoba/ImpExSupport/issues/8)

## [0.2.2] - 2018-04-19

### Fixed

* some small improvments

## [0.2.1] - 2018-04-16

### Fixed

* remove syntax highlightng of single quotes [#7](https://github.com/simplyRoba/ImpExSupport/issues/7)
* comments are only at start of a line [#6](https://github.com/simplyRoba/ImpExSupport/issues/6)

## [0.2.0] - 2018-04-15

### Added

* higlight the data lines whne clicking on a header column
* highlight the next semicolon if possible on an empty column

### Fixed

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
