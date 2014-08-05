module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            core: {
                src: [
                    'src/mapcore.js'                    
                ],
                dest: 'dist/kartkjerne.js'
            },
            circlecontrol: {
              src: [                    
                    'src/CircleDraw.js'
                ],
                dest: 'dist/circledraw.js'  
            },
            wfslayer: {
              src: [                    
                    'src/WfsLayer.js'
                ],
                dest: 'dist/wfslayer.js'  
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/kartkjerne.min.js': ['<%= concat.core.dest %>']
                }
            },
            circlecontrol: {
                files: {
                    'dist/circledraw.min.js': ['<%= concat.circlecontrol.dest %>']
                }
            },
            wfslayer: {
                files: {
                    'dist/wfslayer.min.js': ['<%= concat.wfslayer.dest %>']
                }
            }
        },
        buster: {
            test: {
                server: {
                    port: 1112
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
   
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-buster');

    grunt.registerTask('default', ['concat', 'uglify']);

};