/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           *
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          *
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */


/*
 * Plugins
 */

var gulp = require('gulp');
var htmlhint = require('gulp-htmlhint');
var htmlmin = require('gulp-htmlmin');
var ngHtml2Js = require('gulp-ng-html2js');

/*
 * Pipes
 */

var validatedTemplates = require('../pipes/validated-templates');


/*
 * Configuration
 */

var pathConfig = require('../config/gulp').paths;
var jshintConfig = require('../config/gulp').jshint;
var htmlminConfig = require('../config/gulp').htmlmin;
var ngHtml2JsConfig = require('../config/gulp').ngHtml2Js;


/*
 * Pipe
 */

module.exports = {
  getPipe: function() {
    return validatedTemplates.getPipe()
      .pipe(htmlhint.failReporter())
      .pipe(htmlmin(htmlminConfig))
      .pipe(ngHtml2Js(ngHtml2JsConfig))
      .pipe(gulp.dest(pathConfig.dest.production));
  }
};
