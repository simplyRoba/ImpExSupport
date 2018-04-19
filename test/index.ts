
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.
// https://code.visualstudio.com/docs/extensions/testing-extensions

import * as paths from "path";
import * as glob from "glob";
import * as Mocha from "mocha";

// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implementt he method statically
let tty = require("tty");
if (!tty.getWindowSize) {
    tty.getWindowSize = function () { return [80, 75]; };
}

let opts: MochaSetupOptions = {
    ui: "tdd",
};

let mocha = new Mocha(opts);

export function run(testsRoot: string, clb: (error, failures?: number) => void): void {

    // Enable source map support
    require("source-map-support").install();

    // Glob test files
    glob("**/**.test.js", { cwd: testsRoot }, (error, files) => {
        if (error) {
            return clb(error);
        }

        try {

            // Fill into Mocha
            files.forEach(f => mocha.addFile(paths.join(testsRoot, f)));

            // Run the tests
            mocha.run((failures) => {
                clb(null, failures);
            });
        } catch (error) {
            return clb(error);
        }
    });
}
