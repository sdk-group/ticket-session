'use strict'

global.expect = require('chai')
	.expect;
global._ = require('lodash');
global.Promise = require('bluebird');

var gulp = require("gulp");
var mocha = require('gulp-mocha');

gulp.src('test/**/*.test.js', {
		read: false
	})
	.pipe(mocha());