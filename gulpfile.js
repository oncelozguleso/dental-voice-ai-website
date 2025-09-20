const gulp = require('gulp');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

// Clean dist folder
gulp.task('clean', function() {
  return gulp.src('dist', {read: false, allowEmpty: true})
    .pipe(clean());
});

// Build HTML with includes
gulp.task('html', function() {
  return gulp.src(['src/pages/*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(htmlmin({
      collapseWhitespace: false, // Keep formatting for now
      removeComments: false      // Keep comments for debugging
    }))
    .pipe(gulp.dest('dist/'));
});

// Copy assets (CSS, JS, images)
gulp.task('assets', function() {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets/'));
});

// Copy root files (sitemap, robots.txt, favicon files, etc.)
gulp.task('root-files', function() {
  return gulp.src(['src/sitemap.xml', 'src/robots.txt', 'src/favicon.ico', 'src/favicon-*.png', 'src/apple-touch-icon.png'])
    .pipe(gulp.dest('dist/'));
});

// Build task
gulp.task('build', gulp.series('clean', gulp.parallel('html', 'assets', 'root-files')));

// Development server
gulp.task('serve', function() {
  browserSync.init({
    server: './dist'
  });
  
  gulp.watch('src/**/*.html', gulp.series('html')).on('change', browserSync.reload);
  gulp.watch('src/assets/**/*', gulp.series('assets')).on('change', browserSync.reload);
});

// Development task
gulp.task('dev', gulp.series('build', 'serve'));
