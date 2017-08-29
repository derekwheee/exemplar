const path = require('path');
const gulp = require('gulp');
const cheerio = require('gulp-cheerio');
const concat = require('gulp-concat');
const foreach = require('gulp-foreach');
const pump = require('pump');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const svgmin = require('gulp-svgmin');
const uglify = require('gulp-uglify');
const chalk = require('chalk');

let server;

gulp.task('sass', () => {
    return gulp.src('www/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('www/css'));
});

gulp.task('uglify', (cb) => {
    pump([
        gulp.src([
            'www/scripts/common.js',
        ]),
        uglify(),
        concat('combined.js'),
        gulp.dest('www/scripts')
    ], cb);
});

gulp.task('svg', () => {
    return gulp.src('www/icons/*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
            run: ($, file) => {
                $('svg').addClass(`icon ${file.relative.replace('.svg', '')}`);
            }
        }))
        .pipe(foreach((stream, file) => {
            var fileName = path.basename(file.path, '.svg');
            return stream
                .pipe(replace(/\b(\.)?(cls-\d)|(st\d)\b/g, `$1${fileName}-$2$3`));
        }))
        .pipe(gulp.dest('www/icons/min'));
});

gulp.task('watch', ['uglify', 'sass', 'svg'], () => {
    gulp.watch(['www/scripts/**/*.js', '!www/scripts/combined.js'], ['uglify']);
    gulp.watch('www/scss/**/*.scss', ['sass']);
    gulp.watch('www/icons/*.svg', ['svg']);
});

gulp.task('dev', ['watch'], () => {
    console.log('Ready');
});