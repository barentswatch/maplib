var config = module.exports;
var fs = require('fs');

config['Njord Browser tests'] = {
    env: 'browser',
    rootPath: '../',
    libs: [
        'lib/underscore/underscore-min.js',
        'lib/backbone/backbone.js',
        'lib/OpenLayers-2.13.1/OpenLayers.js',
    ],
    sources: [
        'src/ol2/Mapcore.js',
        'src/ol2/CircleDraw.js'
    ],
    tests: [
        'test/*-test.js'
    ]
};
