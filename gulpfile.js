
var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var jeditor = require("gulp-json-editor");
var tslint = require("gulp-tslint");
var del = require("del");
var path = require("path");
var cp = require("child_process");

gulp.task("lint", () => {
    pump([
        gulp.src(["./src/*.ts", "./src/**/*.ts", "./test/**/*.ts", "./test/*.ts"]),
        tslint(),
        tslint.report()
    ]);
});

gulp.task("compile", (done) => {
    const tsProject = ts.createProject("./tsconfig.json");
    pump([
        tsProject.src(),
        sourcemaps.init(),
        tsProject(),
        sourcemaps.write(".", {
            mapSources: (sourcePath, file) => {
                // Correct source map path.
                const relativeSourcePath = path.relative(path.dirname(file.path), path.join(file.base, sourcePath));
                return relativeSourcePath;
            }
        }),
        gulp.dest("out")
    ], done);
});

gulp.task("test", (done) => {

    const child = cp.spawn("node", ["./node_modules/vscode/bin/test"], {
        cwd: __dirname
    });

    child.stdout.on("data", (data) => {
        gutil.log(data.toString().trim());
    });

    child.stderr.on("data", (data) => {
        gutil.log(gutil.colors.red(data.toString().trim()));
    });

    child.on("error", (error) => {
        gutil.log(gutil.colors.red(error));
    });

    child.on("exit", (code) => {
        if (code === 0) {
            done();
        } else {
            done(code);
        }
    });
});

gulp.task('cover:enable', (done) => {
    pump([
        gulp.src("./coverconfig.json"),
        jeditor(function(json) {
            json.enabled = true;
            return json; // must return JSON object.
        }),
        gulp.dest("./", {'overwrite':true})
    ], done);
});

gulp.task('cover:disable', () => {
    pump([
        gulp.src("./coverconfig.json"),
        jeditor(function(json) {
        json.enabled = false;
        return json; // must return JSON object.
        }),
        gulp.dest("./", {'overwrite':true})
    ]);
});

gulp.task("clean", (done) => {
    return del(['out', 'coverage'], done);
});

gulp.task("build", (done) => {
    runSequence("clean", "compile", done);
});

gulp.task("watch", () => {
    gulp.watch(["./src/*.ts", "./src/**/*.ts", "./test/**/*.ts", "./test/*.ts"], ["compile"]);
});