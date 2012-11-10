/*
 * grunt-plugins
 * https://github.com/Fintan/grunt-haxe
 *
 * Copyright (c) 2012 Fintan Boyle
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
	'use strict';

	var _ = grunt.utils._;
	var log = grunt.log;

	grunt.registerMultiTask('haxe', 'Compile Haxe projects', function(param) {

		var data = this.data;
		var done = this.async();

		validateEssentialConfigData(data);

		if (_.isString(data.output)) {
			//simple single target project
			buildApp(data, done);

		} else {
			//multi-target project
			buildApp(buildMultiAppCmd(data, done, param), done);

		}

	});

	var validateEssentialConfigData = function(data) {

			var dataKeys = _.keys(data);

			var isMissingProps = false;
			var missingPropsStr = "";
			var hasValueProb = false;
			var valueProbStr = "";

			if (!_.contains(dataKeys, "main")) {

				isMissingProps = true;
				missingPropsStr += " 'main' ";

			} else if (!_.isString(data.main)) {

				hasValueProb = true;
				valueProbStr += "\nmain value is not a string";

			}

			if (!_.contains(dataKeys, "classpath")) {

				isMissingProps = true;
				missingPropsStr += " 'classpath' ";

			} else if (!_.isArray(data.classpath)) {

				hasValueProb = true;
				valueProbStr += "\nclasspath is not an array";

			} else if (data.classpath.length === 0) {

				hasValueProb = true;
				valueProbStr += "\nclasspath array is empty; requires at least one classpath";

			}

			if (!_.contains(dataKeys, "output")) {

				isMissingProps = true;
				missingPropsStr += " 'output' ";

			}

			if (isMissingProps) {
				grunt.fatal("Missing the following essential properties in Haxe config: " + missingPropsStr);
			}

			if (hasValueProb) {
				grunt.fatal("Problems identified in the following values in Haxe config: " + valueProbStr);
			}

		};

	var buildMultiAppCmd = function(data, done, param) {

			var outputKeys = _.keys(data.output);

			//expecting param to be the name of an output target if it is specified
			if (param && _.indexOf(outputKeys, param) === -1) {
				grunt.fatal("'" + param + "' as an output target does not exist");
			}

			var cmd = '';

			_.forEach(outputKeys, function(outputKey) {

				var item = data.output[outputKey];

				//build all targets unless param is specified
				if (!param || param === outputKey) {

					var keys = _.keys(item);

					_.forEach(keys, function(key) {
						if (_.isArray(item[key]) && _.isArray(data[key])) {
							//concating data[key] to item[key] 
							item[key] = _.union(item[key], data[key]);
						}
					});

					var dat = _.extend({}, omit(data, 'output'), item);

					if (_.isString(item.output)) {

						cmd += assembleCommand(dat) + " --next ";

					} else {
						//handle deeply nested output settings
						cmd += buildMultiAppCmd(dat, done, param);

					}

				}

			});

			return cmd;

		};
/*
		data can be either a formatted string or an object literal
	*/
	var buildApp = function(data, done) {
			var exec = require('child_process').exec;
			var dataErr = data.onError;
			var cmd;
			if (_.isString(data)) {
				cmd = "haxe " + data;
			} else {
				cmd = "haxe " + assembleCommand(data);
			}

			//log.write('\nBuilding Haxe project... \n' + cmd + '\n');
			exec(cmd, data.execOptions, function(err, stdout, stderr) {

				log.write('\nBuilding Haxe project... \n' + cmd + '\n');
				log.write(stdout + '\n\n');

				if (stdout) {
					log.write(stdout);
				}

				if (err) {
					if (_.isFunction(dataErr)) {
						dataErr(stderr);
					} else if (data.failOnError !== false) {
						grunt.fatal(err);
					} else {
						log.error(err);
					}
				}

				done();
			});

		};

	var assembleCommand = function(data) {

			var dirs = assemblePart(data.classpath, '-cp'),
				libs = assemblePart(data.libs, '-lib'),
				flags = assemblePart(data.flags, '-D'),
				macros = assemblePart(data.macros, '--macro'),
				resources = assemblePart(data.resources, '-resource'),
				misc = assemblePart(data.misc, '').split("  ").join(" "),
				outputType;

			if (data.output.indexOf('.js') !== -1) {
				outputType = ' -js ';
			} else if (data.output.indexOf('.swf') !== -1) {
				outputType = ' -swf ';
			} else if (data.output.indexOf('.php') !== -1) {
				outputType = ' -php ';
			} else if (data.output.indexOf('.n') !== -1) {
				outputType = ' -neko ';
			} else {
				outputType = ' -cpp ';
			}

			return '-main ' + data.main + outputType + data.output + dirs + libs + flags + macros + resources + misc;

		};

	var assemblePart = function(arr, label) {

			var str = '';
			if (_.isArray(arr)) {
				_.forEach(arr, function(val) {
					str += ' ' + label + ' ' + val + ' ';
				});
			}
			return str;

		};

	// Return a copy of the object without the blacklisted properties. (from Underscore)
	var omit = function(obj) {
			var copy = {};
			var keys = _.flatten(Array.prototype.slice.call(arguments, 1));
			for (var key in obj) {
				if (!_.include(keys, key)) {
					copy[key] = obj[key];
				}
			}
			return copy;
		};
};
