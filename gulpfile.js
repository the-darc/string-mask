var path = require('path'),
	gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
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
	gulp.src([config.src.files, config.test.files])
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});


gulp.task('jscs', function() {
	gulp.src([config.src.files, config.test.files])
	.pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('jscs-fix', function() {
	gulp.src(config.src.files)
	.pipe(jscs({fix: true}))
    .pipe(gulp.dest('src'));

	gulp.src(config.test.files)
	.pipe(jscs({fix: true}))
    .pipe(gulp.dest('test'));
});

function mochaRunnerFactory(reporter) {
	return plugins.mocha({
		reporter: reporter || config.reporter
	});
}

gulp.task('test-dot', function() {
	gulp.src(config.test.files, {read: false})
	.pipe(mochaRunnerFactory('dot'))
	.on('error', console.warn.bind(console));
});

gulp.task('test-spec', function() {
	gulp.src(config.test.files, {read: false})
	.pipe(mochaRunnerFactory('spec'))
	.on('error', console.warn.bind(console));
});

gulp.task('test', ['jshint', 'jscs', 'test-spec']);

gulp.task('watch', ['jshint', 'jscs', 'test-dot'], function() {
    gulp.watch(config.src.files, ['jshint', 'jscs', 'test-dot']);
});

gulp.task('default', ['watch']);

gulp.task('test-coverage', function(done) {
	gulp.src(config.src.files)
	.pipe(plugins.istanbul())
	.pipe(plugins.istanbul.hookRequire())
	.on('finish', function() {
		gulp.src(config.test.files, {
			cwd: process.env.PWD,
			read: false
		})
		.pipe(mochaRunnerFactory('dot'))
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

gulp.task('pre-commit', ['jshint', 'jscs', 'test-coverage']);

gulp.task('pre-push', ['jshint', 'jscs', 'test-coverage'], function() {
	var coverageEnforcer = require('gulp-istanbul-enforcer');

	var options = {
		thresholds: {
			statements: 95,
			branches: 95,
			lines: 95,
			functions: 95
		},
		coverageDirectory: 'coverage',
		rootDirectory: process.env.PWD
	};

	return gulp.src('.')
		.pipe(coverageEnforcer(options));
});
