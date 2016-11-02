'use strict'

let gulp = require("gulp");
let babel = require("gulp-babel");
let watch = require('gulp-watch');
let changed = require('gulp-changed');
let nodemon = require('gulp-nodemon');
let plumber = require('gulp-plumber');
let path = require('path');
let demon;


gulp.task("default", ['es6']);


gulp.task("es6", function () {
	return gulp.src(["src/**/*.js", "src/**/*.json"])
		.pipe(changed("build"))
		.pipe(plumber({
			errorHandler: function (e) {
				console.log('error', e);
			}
		}))
		.pipe(gulp.dest("build"))
		.on('end', function () {
			console.log('end build');
		});
});

gulp.task('upd', ['es6'], function () {
	return gulp.src(["build/**/*.js"])
		.pipe(gulp.dest("../iris-v2/node_modules/ticket-session/build"));
});

gulp.task('test-upd', ['start-test'], function () {
	gulp.watch(["src/**/*.js", "test/**/*.js"], ['upd']);
});

gulp.task('test', ['start-test'], function () {
	gulp.watch(["src/**/*.js", "test/**/*.js"], ['es6']);
});

gulp.task('start-test', function () {
	demon = nodemon({
		script: 'test/run.js',
		watch: ['build/', 'test/'],
		execMap: {
			"js": "node  --harmony "
		},
		env: {
			'NODE_ENV': 'development'
		}
	});
});