var path = require('path'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	plugins = require('gulp-load-plugins')({
		config: path.join(__dirname, 'package.json')
	});

var config = {
	src: {
		files: 'src/**/*.js'
	},
	test: {
		files: 'test/**/*.test.js'
	}
};

gulp.task('jshint', function() {
	gulp.src(config.src.files)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

function mochaRunnerFactory(reporter) {
	return plugins.mocha({
		reporter: reporter || config.reporter
	});
}

gulp.task('runtestdot', function() {
	gulp.src(config.test.files, {read: false})
	.pipe(mochaRunnerFactory('dot'))
	.on('error', console.warn.bind(console));
});

gulp.task('runtest', function() {
	gulp.src(config.test.files, {read: false})
	.pipe(mochaRunnerFactory('spec'))
	.on('error', console.warn.bind(console));
});

gulp.task('default', ['jshint', 'runtestdot'], function() {
    gulp.watch(config.src.files, ['jshint', 'runtestdot']);
});

gulp.task('test', ['jshint', 'runtest']);

gulp.task('test-watch', ['jshint', 'runtest'], function() {
    gulp.watch(config.src.files, ['jshint', 'runtest']);
});

gulp.task('test-coverage', function(done) {
	gulp.src(config.src.files)
	.pipe(plugins.istanbul())
	.pipe(plugins.istanbul.hookRequire())
	.on('finish', function() {
		gulp.src(config.test.files, {
			cwd: process.env.PWD,
			read: false
		})
		.pipe(mochaRunnerFactory('spec'))
		.pipe(plugins.istanbul.writeReports())
		.on('end', function() {
			if (process.env.TRAVIS) {
				gulp.src('./coverage/**/lcov.info')
				.pipe(plugins.coveralls())
				.on('end', done);
			} else {
				done();
			}
		});
	});
});
