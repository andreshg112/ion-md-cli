var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var inject = require('gulp-inject');
var copy = require('gulp-copy');
var uglify = require('gulp-uglify');
var del = require('del');

var paths = {
    sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .on('error', sass.logError)
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

// Mis tareas de Gulp

var appScripts = [
    './www/app/app.module.js',
    './www/app/values/*.js',
    './www/app/services/*.js',
    './www/app/app.*.js',
    './www/app/**/*.js',
    './www/js/controllers/*.js'
];

gulp.task('inject', function () {
    //Inyecta los archivos .js en index.html del www, de acuerdo al orden establecido
    gulp.src('./www/index.html')
        .pipe(inject(
            gulp.src(appScripts, { read: false }),
            { relative: true }
        ))
        .pipe(gulp.dest('./www'));
});

gulp.task('clean:build', function () {
    // Eliminar todo dentro de build
    return del([
        'build/**/*'
    ]);
})

gulp.task('copy:www', ['clean:build'], function () {
    //Copiar www sin los archivos js (app).    
    return gulp.src(['./www/**', '!./www/app/**/*.js'])
        .pipe(copy('./build', { prefix: 1 }));
});

gulp.task('uglify:build', ['copy:www'], function () {
    //Concatenar y minificar archivos js
    return gulp.src(appScripts)
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'));
});

gulp.task('inject:build', ['uglify:build'], function () {
    //Inyectar archivo concatenado all.js
    return gulp.src('./build/index.html')
        .pipe(inject(
            gulp.src('./build/js/all.min.js', { read: false }),
            { relative: true }
        ))
        .pipe(gulp.dest('./build'));
});

gulp.task('build', ['inject:build']);