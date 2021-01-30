module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!\n'+
                ' * jQuery fancyMessenger plugin v<%= pkg.version %>\n'+
                ' * https://github.com/myspace-nu\n'+
                ' *\n'+
                ' * Copyright 2021 Johan Johansson\n'+
                ' * Released under the MIT license\n'+
                ' */\n'
            },
            build: {
                src: 'src/jquery.fancyMessenger.js',
                dest: 'dist/jquery.fancyMessenger.min.js'
            }
        },
        cssmin: {
            target: {
              files: {
                'dist/jquery.fancyMessenger.min.css': ['src/jquery.fancyMessenger.css']
              }
            }
          }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['uglify','cssmin']);
};