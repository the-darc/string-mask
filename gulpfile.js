var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish');

var path = {
	api: {
		files: 'api/**/*.js'
	}
}

gulp.task('api', function() {
	gulp.src(path.api.files)
	.pipe(jshint('.jshintrc'))
	.pipe(jshint.reporter(jshintReporter));
});

gulp.task('default', ['api'], function() {
    gulp.watch(path.api.files, ['api']);
});
