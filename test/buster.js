var config = module.exports;
var fs = require('fs');

config['Njord Browser tests'] = {
    env: 'browser',
    rootPath: '../',
    libs: [
        'lib/underscore-min.js',
        'lib/backbone-min.js',
        'lib/OpenLayers-2.13.1/OpenLayers.js',
    ],
    sources: [
        'src/mapcore.js',
        'src/CircleDraw.js'
    ],
    tests: [
        'test/*-test.js'
    ]
};