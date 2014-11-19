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
            },
            clusterstyle: {
              src: [
                    'src/ClusterStyle.js'
                ],
                dest: 'dist/clusterstyle.js'
            },
            wmshttpsproxy: {
              src: [
                    'src/WmsHttpsProxy.js'
                ],
                dest: 'dist/wmshttpsproxy.js'
            },
            ol3core: {
              src: [
                    'src/BW.Map/BW.Map.OL3Map.js',
                    'src/BW.Utils/BW.Utils.Guid.js',
                    'src/BW.Events/BW.Events.EventHandler.js',
                    'src/BW.MapModel/BW.MapModel.Layer.js',
                    'src/BW.MapModel/BW.MapModel.Map.js',
                    'src/BW.MapModel/BW.MapModel.SubLayer.js',
                    'src/BW.MapModel/BW.MapModel.LegendGraphic.js',
                    'src/BW.MapModel/BW.MapModel.CustomCrsLoader.js',
                    'src/BW.Repository/BW.Repository.ConfigRepository.js',
                    'src/BW.Repository/BW.Repository.MapConfig.js',
                    'src/BW.FeatureParser/BW.FeatureParser.ResultParser.js',
                    'src/ol3wrapper.js'
                ],
                dest: 'dist/ol3core.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy HH:MM") %> */\n'
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
            },
            clusterstyle: {
                files: {
                    'dist/clusterstyle.min.js': ['<%= concat.clusterstyle.dest %>']
                }
            },
            wmshttpsproxy: {
                files: {
                    'dist/wmshttpsproxy.min.js': ['<%= concat.wmshttpsproxy.dest %>']
                }
            },
            ol3core: {
                files: {
                    'dist/ol3core.min.js': ['<%= concat.ol3core.dest %>']
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
