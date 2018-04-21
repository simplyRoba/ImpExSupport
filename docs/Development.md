# Development

Table  of Contents

* [Requirements](#requirements)
* [Build](#build)
* [Run](#run)
* [Test](#test)

## Requirements

You'll need _Node.js_ and _npm_ download it [direct](https://nodejs.org/) or through a [package manager](https://nodejs.org/en/download/package-manager/).

ImpEx-Support uses _gulp_, install it with following command `npm install gulp-cli -g`. Read more about gulp [here](https://gulpjs.com).

To package the extension you'll need _vsce_ the VSCode Extension Manager, install it with following command `npm install vsce -g`. Read more about vsce [here](https://code.visualstudio.com/docs/extensions/publish-extension).

## Build

To build the extension clone the repository and run `gulp build` in the root directory. This will clean all artifacts and call the typescript compiler.

## Run

There are two posibilities to run the extension, directly through a VS Code launch configuration or by packaging and installing it.

On mac press `Shift+⌘+D` or `Ctrl+Shift+D` on windows to open the _Debug View_, select the **run extension** launch configuration and start it. If you run the extension by this method it is possible to set breakpoints and the debug the extension.

If you only want to run the extension, you can package and install it as well. Run `vsce package`in the root directory. This will create a _vsix_ file, which can be installed as described [here](../README.md#installation).

## Test

The tests are split into unit tests that do no need the VS Code API and integration tests that need the API to run. The names indicate the kind `*.unit.test.ts` for unit and `*.integration.test.ts`for integration tests. Read more [here](https://code.visualstudio.com/docs/extensions/testing-extensions) The unit tests can be run by every test runner you want. Integration tests need necessarily to be run by one of the following methodes.

There are also two posibilities to run the tests. The first again is a lauch configuration. It's the **run extension tests** configuration. Read above how to run a launch configuration.

You can also run the tests without having VS Code installed. Just run `gulp test`in the root directory. This will download a VS Code executable and the tests.