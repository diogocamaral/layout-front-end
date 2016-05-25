var gulp          = require('gulp'),
    browserify    = require('gulp-browserify'),
    uglify        = require('gulp-uglify'),
    sass          = require('gulp-sass'),
    connect       = require('gulp-connect'),
    autoprefixer  = require('gulp-autoprefixer'),

    gulpif        = require('gulp-if');

var env         = process.env.NODE_ENV || 'development';
var outputDir   = 'builds/development';

gulp.task('html', function(){
  return gulp.src('src/index.html')
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});

gulp.task('js', function(){
  return gulp.src('src/js/main.js')
        .pipe(browserify({ debug: env === 'development' }))
        .pipe(gulpif(env === 'production', uglify()))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('sass', function(){
  var config = {};

  if (env === 'development'){
    config.sourceComments = 'map';
  }

  if (env === 'production'){
    config.outputStyle = 'compressed';
  }

  return gulp.src('src/sass/main.sass')
        .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
        .pipe(sass(config))
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload());
});

gulp.task('bower', function(){
  return gulp.src('bower_components/**/*')
        .pipe(gulp.dest(outputDir + '/bower_components'));
});

gulp.task('fonts', function(){
  return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest(outputDir + '/fonts'));
});

gulp.task('bg', function(){
  return gulp.src('src/bg.png')
        .pipe(gulp.dest(outputDir));
});

gulp.task('watch', function(){
  gulp.watch('src/index.html', ['html']);
  gulp.watch('src/js/**/*.js', ['js']);
  gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('connect', function(){
  connect.server({
    root: [outputDir],
    port: 8000,
    livereload: true
  })
});

gulp.task('default', ['html', 'js', 'sass', 'bower', 'fonts', 'bg', 'watch', 'connect']);