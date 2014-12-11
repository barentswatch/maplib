module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: '\n'
            },
            core: {
                src: [
                    'src/ol2/Mapcore.js'
                ],
                dest: 'dist/kartkjerne.js'
            },
            circlecontrol: {
              src: [
                    'src/ol2/CircleDraw.js'
                ],
                dest: 'dist/circledraw.js'
            },
            wfslayer: {
              src: [
                    'src/ol2/WfsLayer.js'
                ],
                dest: 'dist/wfslayer.js'
            },
            clusterstyle: {
              src: [
                    'src/ol2/ClusterStyle.js'
                ],
                dest: 'dist/clusterstyle.js'
            },
            wmshttpsproxy: {
              src: [
                    'src/ol2/WmsHttpsProxy.js'
                ],
                dest: 'dist/wmshttpsproxy.js'
            },
            ol3core: {
              src: [
                    'src/BW.Facade/BW.Facade.JSONConfigFacade.js',
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
                    'src/ol3/ParserWrapper.js'
                ],
                dest: 'dist/ol3core.js'
            },
            ol3listmap: {
              src: [
                    'src/ol3/FeatureCollection.js',
                    'src/ol3/ListMapView.js'
                ],
                dest: 'dist/ol3listmap.js'
            },
            ol3markers: {
              src: [
                    'src/ol3/Markers.js'
                ],
                dest: 'dist/ol3markers.js'
            },
            ol3selectevents: {
              src: [
                    'src/ol3/SelectEvents.js'
                ],
                dest: 'dist/ol3selectevents.js'
            }
        },
        uglify: {
            options: {
                sourceMap: true,
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
            },
            ol3listmap: {
              files: {
                    'dist/ol3listmap.min.js': ['<%= concat.ol3listmap.dest %>']
                }
            },
            ol3markers: {
              files: {
                    'dist/ol3markers.min.js': ['<%= concat.ol3markers.dest %>']
                }
            },
            ol3selectevents: {
              files: {
                    'dist/ol3selectevents.min.js': ['<%= concat.ol3selectevents.dest %>']
                }
            }
        },
        buster: {
            test: {
                server: {
                    port: 1112
                }
            }
        },
        build: {
            tasks: ['default'],
            gitAdd: 'package.json bower.json dist/*'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-buster');
    grunt.loadNpmTasks('grunt-bump-build-git');
    grunt.registerTask('default', ['concat', 'uglify']);

};
