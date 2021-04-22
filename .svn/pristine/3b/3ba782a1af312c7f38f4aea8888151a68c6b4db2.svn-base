var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var reload = browserSync.reload;


gulp.task('nodemon', function(cb) {
    // nodemon({
    //     script: 'node .',
    //     ext: 'js html',
    //     env: {
    //         'NODE_ENV': 'development'
    //     }
    // });
    var started = false;
    return nodemon({
        script: 'index.js'
    }).on('start', function() {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('browser-sync', ['nodemon'], function() {
    var files = [
        'src/webapp/**/*.html',
        'src/webapp/**/*.js',
        'src/webapp/**/*.css',
    ];

    browserSync.init(files, {
        proxy: 'http://localhost:8888',
        browser: 'chrome',
        notify: false,
        port: 6666
    });
    // browserSync.init(files, {
    //     server: {
    //         baseDir: './src/proxy/proxy2.js'
    //     }
    // });


    gulp.watch(files).on("change", reload);
});

gulp.task('default', ['browser-sync'], function() {
    console.log('gulp.......');
});