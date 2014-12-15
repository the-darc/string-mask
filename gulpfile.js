var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	mocha = require('gulp-spawn-mocha');

var path = {
	src: {
		files: 'src/**/*.js'
	},
	test: {
		files: 'src/**/*.test.js'
	}
}

gulp.task('jshint', function() {
	gulp.src(path.src.files)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

gulp.task('runtestdot', function() {
	gulp.src(path.test.files, {read: false})
	.pipe(mocha({
		reporter: 'dot'
	}))
	.on('error', console.warn.bind(console));
});

gulp.task('runtest', function() {
	gulp.src(path.test.files, {read: false})
	.pipe(mocha({
		reporter: 'spec'
	}))
	.on('error', console.warn.bind(console));
});

gulp.task('default', ['jshint', 'runtestdot'], function() {
    gulp.watch(path.src.files, ['jshint', 'runtestdot']);
});

gulp.task('test', ['jshint', 'runtest']);

gulp.task('test-watch', ['jshint', 'runtest'], function() {
    gulp.watch(path.src.files, ['jshint', 'runtest']);
});
