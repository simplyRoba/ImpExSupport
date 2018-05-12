
var gulp = require("gulp");
var gutil = require("gulp-util");
var ts = require("gulp-typescript");
var sourcemaps = require("gulp-sourcemaps");
var tslint = require("gulp-tslint");
var del = require("del");
var path = require("path");
var runSequence = require("run-sequence");
var childProcess = require("child_process");

gulp.task("lint", () => {
    gulp.src(["./src/*.ts", "./src/**/*.ts", "./test/**/*.ts", "./test/*.ts"])
        .pipe(tslint())
        .pipe(tslint.report());
});

gulp.task("compile", () => {
    const tsProject = ts.createProject("./tsconfig.json");
    return tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write(".", {
            mapSources: (sourcePath, file) => {
                // Correct source map path.
                const relativeSourcePath = path.relative(path.dirname(file.path), path.join(file.base, sourcePath));
                return relativeSourcePath;
            }
        }))
        .pipe(gulp.dest("out"));
});

gulp.task("test", (done) => {

    const child = childProcess.spawn("node", ["./node_modules/vscode/bin/test"], {
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

gulp.task("clean", (done) => {
    return del(['out', 'coverage'], done);
});

gulp.task("build", (done) => {
    runSequence("clean", "compile", done);
});

gulp.task("watch", () => {
    gulp.watch(["./src/*.ts", "./src/**/*.ts", "./test/**/*.ts", "./test/*.ts"], ["compile"]);
});