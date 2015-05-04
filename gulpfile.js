var gulp         = require('gulp'),
    jshint       = require('gulp-jshint'),
    sass         = require('gulp-sass'),
    sourcemaps   = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    livereload   = require('gulp-livereload'),
    htmlreplace  = require('gulp-html-replace'),
    uglify       = require('gulp-uglifyjs'),
    beep         = require('beepbeep'),
    chalk        = require('chalk');

gulp.task('copy', function(){
    console.log(chalk.magenta.bold('[html-replace]') + ' Replacing some HTML');

    return gulp.src([
            'src/components/**/*',
            'src/img/**/*',
            'src/*.*'
        ], { base: './src' })
        .pipe(gulp.dest('dist/'));
});

gulp.task('html-replace', ['copy', 'uglify'], function() {

    console.log(chalk.magenta.bold('[html-replace]') + ' Replacing some HTML');

    return gulp.src('src/index.html')
        .pipe(htmlreplace({
            'js': 'js/scripts.min.js'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('lint', function() {

    console.log(chalk.magenta.bold('[lint]') + ' Linting JavaScript files');

    return gulp.src(['./src/**/*.js', '!./src/**/*.min.js', '!./src/components/**/*.js', '!./src/js/vendor/**/*.js', '!./node_modules/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));

});

gulp.task('sass:dev', function () {

    console.log(chalk.magenta.bold('[sass]') + ' Compiling development CSS');

    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            sourceMap: true
        }))
        .on('error', function (error) {
            beep();
            console.log(chalk.magenta.bold('[sass]') + ' There was an issue compiling Sass'.bold.red);
            console.error(error.message);
            this.emit('end');
        })
        // Should be writing sourcemaps AFTER autoprefixer runs,
        // but that breaks everything right now.
        .pipe(sourcemaps.write())
        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie 9']
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(livereload());
});

gulp.task('sass:prod', function () {

    console.log(chalk.magenta.bold('[sass]') + ' Compiling production CSS');

    return gulp.src('src/scss/*.scss')

        .pipe(sass({
            outputStyle: 'compressed',
            sourcemap: false
        }))

        .on('error', function (error) {
            beep();
            console.error(error);
            this.emit('end');
        })

        .pipe(autoprefixer({
            browsers: ['last 3 versions', 'ie 9']
        }))

        .pipe(gulp.dest('./dist/css'));
});

gulp.task('uglify', function() {

    console.log(chalk.magenta.bold('[uglify]') + ' Concatenating JavaScript files');

    return gulp.src([
            'src/components/jquery/dist/jquery.js',
            'src/js/plugins.js',
            'src/js/main.js'
        ])
        .pipe(uglify('scripts.min.js'))
        .pipe(gulp.dest('./dist/js/'));
});

// Watch files for changes
gulp.task('watch', function () {

    console.log(chalk.magenta.bold('[watch]') + ' Watching all the files for changes');

    livereload.listen();
    gulp.watch(['src/scss/**/*.scss'], ['sass:dev']);
    gulp.watch(['src/**/*.js', '!src/components/**/*.js', '!src/js/vendor/**/*.js', '!node_modules/**/*.js'], ['lint']);
    gulp.watch(['src/**/*.html'], ['html-replace']);

});

// Generate Sass files for SVG icons
gulp.task('icons', ['iconify-file-cleanup']);

// Compile Sass and watch for file changes
gulp.task('dev', ['lint', 'sass:dev', 'html-replace', 'watch'], function () {
    return console.log(chalk.magenta.bold('\n[dev]') + chalk.bold.green(' Ready for you to start doing things\n'));
});

// Compile production Sass
gulp.task('build', ['sass:prod', 'html-replace', 'lint'], function () {
    return console.log(chalk.magenta.bold('\n[build]') + chalk.bold.green(' Project successfully built\n'));
});
