var gulp          = require('gulp');
var sass          = require('gulp-sass');
var nano          = require('gulp-cssnano');
var plumber       = require('gulp-plumber');
var sourcemaps    = require('gulp-sourcemaps');
var autoprefixer  = require('gulp-autoprefixer');
var dev           = require('./dev');
var stylelint     = require('stylelint');

gulp.task('styles', function() {
  return gulp.src('src/scss/app.scss')
    .pipe(dev(sourcemaps.init()))
    .pipe(sass())
    .on('error', function(err) {
      console.log(err);
      this.emit('end');
    })
    .pipe(autoprefixer())
    .pipe(nano())
    .pipe(dev(sourcemaps.write()))
    .pipe(gulp.dest('./src/css/'))
  ;
});


gulp.task('styles:lint', function() {
  return stylelint.lint({
    files: ['src/scss/**/*.scss', '!src/scss/vendor/*.scss'],
    syntax: "scss",
    formatter: "string"
  })
  .then(function(data) {
    if(data.errored) {
      console.error(data.output);
    }
  })
  .catch(function(err) {
    console.error(err.stack);
  });
});

gulp.task('styles:watch', ['styles'], function(done) {
  gulp.watch('src/scss/**/*.scss', ['styles:lint', 'styles']);
  done();
});
