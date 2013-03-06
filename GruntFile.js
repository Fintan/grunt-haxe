module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
    nodeunit: {
      files: ['test/**/*.js']
    },
    jshint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js'],
      options: {
		jshintrc: '.jshintrc'
	  }
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

};
