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
const argv = require('yargs').argv;
const spawn = require('cross-spawn');
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

gulp.task('server', () => {
    console.log(chalk.green.bold('Starting development server'));
    server = spawn('node', ['server/index']);
    server.stdout.on('data', (data) => {
        console.log(chalk.gray(`${data}`));
    });
      
    server.stderr.on('data', (data) => {
        if (data.toString().includes('EADDRINUSE')) return;

        console.log(chalk.gray(`${data}`));
    });
      
    server.on('close', (code) => {
        console.log(chalk.gray(`Server already running`));
    });
});

gulp.task('run', () => {
    // TODO: This doesn't handle server restarts gracefully

    let processes;

    if (!argv.t) {
        console.warn(chalk.red.bold('You must specify a task to run'));
        return;
    }

    gulp.watch('gulpfile.js', spawnChildren);
    spawnChildren();
    
    function spawnChildren(e) {
        if (e) {
            console.log(chalk.yellow('Gulpfile has changed. Restarting...'));
        }

        if (processes) {
            console.log(chalk.gray('Stopping existing processes'));
            processes.kill();
        }

        processes = spawn('gulp.cmd', [argv.t], {stdio: 'inherit'});
    }
});

gulp.task('dev', ['server', 'watch'], () => {
    console.log('Ready');
});