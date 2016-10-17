var gulp = require('gulp'),
    del = require('del'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    ngAnnotate = require('gulp-ng-annotate'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    critical = require('critical'),
    imagemin = require('gulp-imagemin'),
    changed = require('gulp-changed'),
    jsonminify = require('gulp-jsonminify'),
    cache = require('gulp-cached'),
    browserSync = require('browser-sync').create(),
    sequence = require('gulp-sequence'),
    plumber = require('gulp-plumber'),
    notify = require('gulp-notify'),
    proxy = require('proxy-middleware'),
    browserSync = require('browser-sync'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore');

	var data = {
		paths: {
  				root:"",
          build: "build",
  				css:"build/css",
          css_src: "css",
  				scss:"css/*.scss",
          fancybox_css: "bower_components/fancybox/source/*.css",
  				js:"build/js",
          js_src:"js",
          js_libs: 'build/js/libs',
  				img:"build/images",
          img_src:"images",
          bower: "bower_components",
          testing:"tests",
          svgs_src: "html/svgs/src",
          svgs_dest: "html/svgs/dest"
        }
    };

var filesToCopy =  data.paths.bower + '/fancybox/source/*.{png,gif,css}',
    filesToCopy_tests = data.paths.js_src + '/data.json' ;

  // plumber error handler to stop things from breaking on errors
	var errorHandler = {
		errorHandler : notify.onError
		(
			{
				title		: "Gulp",
				message		: "Error: <%= error.message %>"
			}
		)
	};


// =============================================================================
// Copy
// =============================================================================

gulp.task('copy-tests', function() {
    return gulp.src(filesToCopy_tests)
        .pipe(gulp.dest(data.paths.testing));
});

gulp.task('copy', ['copy-tests'], function() {
    return gulp.src(filesToCopy)
        .pipe(gulp.dest(data.paths.css));
});

// =============================================================================
// Styles
// =============================================================================

gulp.task('css', function() {

    var processors = [
        autoprefixer({
            browsers: ['last 2 versions']
        }),
        cssnano(),
    ];

    return gulp.src([data.paths.scss, data.paths.fancybox_css])
        .pipe(plumber(errorHandler))
        .pipe(sass({
            outputStyle: "expanded",
            errLogToConsole: true,
            indentType: 'tab',
            indentWidth: 1
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest(data.paths.css))
        .pipe(postcss(processors))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(data.paths.css))
});

gulp.task('clean:styles', function () {
  return del([
    data.paths.css + "/*.css"
  ]);
});

gulp.task('styles', ['css'], function() {

    critical.generate({
        inline: true,
        base: './',
        src: 'index.html',
        dest: 'index-critical.html',
        css: [
            data.paths.css + '/main.min.css'
        ],
        minify:true,
        width: 1920,
        height: 1080
    });

});

// =============================================================================
// Scripts
// =============================================================================

gulp.task('scripts:source', function() {
    return gulp.src(data.paths.js_src + '/src/*.js')
        .pipe(plumber(errorHandler))
        .pipe(ngAnnotate())
        .pipe(concat('source.js'))
        .pipe(gulp.dest(data.paths.js))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename('source.min.js'))
        .pipe(gulp.dest(data.paths.js))
});

gulp.task('scripts:libraries', function() {
    return gulp.src([
            data.paths.bower + '/jquery/dist/jquery.min.js',
            data.paths.js_src + '/plugins/*.js',
            data.paths.bower + '/fancybox/source/jquery.fancybox.js',
            data.paths.bower + '/fancybox/source/jquery.fancybox-buttons.js',
            data.paths.bower + '/angular/angular.min.js', data.paths.bower + '/angular-ui-router/release/angular-ui-router.min.js',
            data.paths.bower + '/angular-sanitize/angular-sanitize.min.js', data.paths.bower + '/angular-aria/angular-aria.min.js', data.paths.bower + '/angular-animate/angular-animate.min.js',
            data.paths.bower + '/slideout.js/dist/slideout.min.js'
        ])
        .pipe(cache('libs'))
        .pipe(concat('libs.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(gulp.dest(data.paths.js_libs))
});

gulp.task('scripts:combine', function() {
  return gulp.src([data.paths.js_libs + '/libs.js', data.paths.js + '/source.min.js'])
      .pipe(concat('production.min.js'))
      .pipe(gulp.dest(data.paths.js))

});

gulp.task('clean:scripts', function() {
    return del([
        data.paths.js + "/*.js"
    ]);
});

gulp.task('scripts', function(callback) {
   sequence('scripts:libraries', 'scripts:source', 'scripts:combine')(callback)
});

gulp.task('js-watch', ['scripts'], function() {
     browserSync.reload();
});

// =============================================================================
// JSON
// =============================================================================

gulp.task('json', function () {
    return gulp.src(data.paths.js_src + '/data.json')
        .pipe(jsonminify())
        .pipe(rename('data.min.json'))
        .pipe(gulp.dest(data.paths.js_src));
});

// =============================================================================
// Images
// =============================================================================

gulp.task('images', function() {
  return gulp.src(data.paths.img_src + '/**/*')
      .pipe(changed(data.paths.img))
      .pipe(cache(imagemin()))
      .pipe(gulp.dest(data.paths.img))
});


gulp.task('svgs', function() {
  return gulp.src(data.paths.svgs_src + '/*.svg')
      .pipe(svgmin())
      .pipe(svgstore())
      .pipe(gulp.dest(data.paths.svgs_dest))
});


// =============================================================================
// Watching and Nodemon
// =============================================================================

gulp.task('css-watch', ['styles'], function() {
     browserSync.reload();
});

var url = require('url');

var proxyOptions = url.parse('http://localhost:3000');
proxyOptions.route = '/api';

gulp.task('watch', ['nodemon'], function() {

    browserSync.init({
        port: 8081,
        server: {
            baseDir: "." // Change this to your web root dir
        },
        middleware: [proxy(proxyOptions)]
    });

    gulp.watch(data.paths.js_src + '/*src/*js', ['js-watch']);
    gulp.watch(data.paths.css_src  + '/**/*.scss', ['css-watch']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task("nodemon", function(){

  return nodemon({
    script: 'api/index.js',
    env: {
        port: '3000'
    },
    watch: 'api/*'
  })
  .on('restart', function () {
     setTimeout(function () {
       browserSync.reload();
    }, 1000);
  });

});

// =============================================================================
// Clean all
// =============================================================================

gulp.task('clean:start', function () {
  return del([
    data.paths.build + "/{css,js}/*{.css,.js}"
  ]);
});

gulp.task('default', sequence('clean:start', 'copy', 'json','images','svgs','styles','scripts', 'watch'));
