var gulp = require('gulp'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver'),
    ts = require('gulp-typescript'),
    merge = require('merge2'),
    gulpTypings = require("gulp-typings"),
    del = require('del'),
    tslint = require('gulp-tslint'),
    tsconfigGlob = require('tsconfig-glob'),
    bump = require('gulp-bump'),
    git = require('gulp-git'),
    sass = require('gulp-ruby-sass'),
    inject = require('gulp-inject'),
    rev = require('gulp-rev'),
    runSequence = require('run-sequence'),
    notify = require("gulp-notify") ,
    sourcemaps = require('gulp-sourcemaps');

const tscConfig = require('./tsconfig.json');

// move dependencies into dist dir
gulp.task('dependencies', function () {
  return gulp.src([
    'node_modules/es6-shim/es6-shim.min.js',
    'node_modules/systemjs/dist/system-polyfills.js',
    'node_modules/angular2/es6/dev/src/testing/shims_for_IE.js',
    'node_modules/angular2/bundles/angular2-polyfills.js',
    'node_modules/systemjs/dist/system.src.js',
    'node_modules/rxjs/bundles/Rx.js',
    'node_modules/angular2/bundles/angular2.dev.js',
    'node_modules/angular2/bundles/router.dev.js',
    'node_modules/ng2-bootstrap/bundles/ng2-bootstrap.min.js',
    'node_modules/moment/moment.js',
    'node_modules/angular2/bundles/http.dev.js'
  ])
    .pipe(gulp.dest('dist/lib'));
});

var tsProject = ts.createProject('tsconfig.json');

gulp.task('tsconfig-glob', function () {
  return tsconfigGlob({
    configPath: '.',
    indent: 2
  });
});

// clean the contents of the distribution directory
gulp.task('clean', function () {
  return del('dist/**/*');
});

gulp.task('tslint', function() {
  return gulp.src('app/**/*.ts')
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('scripts', function() {
  // return gulp.src("src/app/**/*.ts")
  //   .pipe(ts(tscConfig.compilerOptions))
  //   .pipe(gulp.dest('dist/app'));

  var tsResult = gulp.src(["src/app/**/*.ts", "typings/main.d.ts"])
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject));

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
    tsResult.dts.pipe(gulp.dest('dist/definitions')),
    tsResult.js.pipe(gulp.dest('dist/app'))
  ]);
});

gulp.task("installTypings",function(){
  return gulp.src("./typings.json")
    .pipe(gulpTypings()); //will install all typingsfiles in pipeline.
});


gulp.task('watch', ['scripts'], function() {
  gulp.watch('src/**/*.ts', ['scripts', 'tsconfig-glob']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.scss', ['scss']);
});

// move html
gulp.task('html', function () {
  return gulp.src('src/app/**/*.html')
    .pipe(gulp.dest('dist/app'))
});

// move css
function getScss () {
  return sass('src/styles/main.scss', {
      style: 'compressed',
      loadPath: [
        'src/styles/modules',
        'src/styles/partials',
        'src/styles/vendor',
        'node_modules/bootstrap-sass/assets/stylesheets',
        'node_modules/font-awesome/scss'
      ]
    })
      .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
      }))
    .pipe(rev())
    .pipe(gulp.dest('dist/css'));
}

gulp.task("scss", function () {
  var scssStream = getScss();


  gulp.src("./src/index.html")
    .pipe(inject(scssStream, {relative:false, ignorePath: '/dist'}))
    .pipe(gulp.dest("dist"));
});

gulp.task('icons', function() {
  return gulp.src('node_modules/font-awesome/fonts/*.*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('bump', function(version){
  var now = new Date();
  return gulp.src(['./package.json'])
    .pipe(bump({version: version}))
    .pipe(jeditor({'lastReleaseDate' : dateFormat(now, "yyyy-mm-dd")}))
    .pipe(gulp.dest('./'))
    .pipe(git.commit('bumps package version'));
});

/**
 *
 * Main TASKS
 *
 */

// run init tasks
gulp.task('default', function(){
  return runSequence('clean', 'installTypings', 'tsconfig-glob', ['icons', 'tslint', 'dependencies', 'scripts', 'html', 'scss']);
});

// run development task
gulp.task('dev', ['watch', 'serve']);

// serve the dist dir
gulp.task('serve', function () {
  gulp.src('dist')
    .pipe(webserver({
      open: true,
      reload: true
    }));
});
