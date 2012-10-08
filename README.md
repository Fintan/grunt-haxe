# Grunt-Haxe

Compile Haxe to JavaScript

Haxe is a open-source, multi-platform programming language with many advanced features.  Visit the [Haxe website] [haxe_www] to learn more.  A list of advanced features can be found [here][haxe_features].

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-haxe`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-haxe');
```

[grunt]: https://github.com/gruntjs/grunt
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md
[haxe_compiler_doc]: http://haxe.org/doc/compiler
[haxe_www]: http://haxe.org
[haxe_features]: http://haxe.org/doc/features#language-features

## Documentation

###Overview

Inside your grunt.js file, add a section named haxe.  Use this section to define the arguments that will be passed the [Haxe compiler][haxe_compiler_doc]


###Config Examples

Then add some configuration for the plugin like so:

#### Minimal Example

As a minimum a project requires 3 properties to be specified in order to successfully compile:

``` javascript
haxe: {
	minimal_example: {
		main: 'Main', /*name of the startup class*/
		classpath:['app'],/*specify folder/s where source code is located*/
		output:'dist/output.js' /*compile to this file*/
	}
}
```
The Haxe project can then be compiled using the following command:

```
$ grunt haxe:minimal_example
```

#### Complete Example

This example show all available options for configuring your project

``` javascript
haxe: {
	complete_example: {
		main: 'Main',
		classpath:['app'],
		libs:['casalib'], /*specify haxelib libraries */
		flags:['something', 'createjs'], /* define a conditional compilation flags */
		macros:['mymacro.doSomethingCool()'], /*call the given macro*/
		resources:['activity/xml/map-layout.json@map_layout'], /*define named resource files*/
		misc:['-debug', "--dead-code-elimination", "--js-modern"],/* add any other arguments*/
		output:'app/scripts/output.js',
		onError: function (e) {
			/*custom error message */
			console.log( 'There was a problem...\n' + e );
		}
	}
}
```

#### Composite Example

The value of the option property is typically a string that defines the name and location of a file to compile to but it can also be an object literal that in turn contains an output property.  The following example shows how to configure debug and release builds for a project by defining common properties to both in a single place.  Unique settings for each build can also defined;


``` javascript
haxe: {
	multi_target_example: {
		main: 'Main',
		classpath:['app'],
		output:{
			debug:{
				misc:['-debug'],/*-debug results in a js source map*/
				output: 'dist/output.js'
			},
			release: {
				misc:["--dead-code-elimination", "--js-modern"],
				output: 'app/scripts/output.js'
			}
		}
	}
}
```

## License
Copyright (c) 2012 Fintan Boyle  
Licensed under the MIT license.
