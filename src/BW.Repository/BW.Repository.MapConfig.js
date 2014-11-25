var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.MapConfig = function(config){
    var defaults = {
        numZoomLevels: 10,
        newMaxRes: 20000,
        renderer: BW.Map.OL3Map.RENDERERS.canvas,
        center: [-1, 1],
        zoom: 5,
        layers:[],
        coordinate_system: "EPSG:32633",
        extent: [-1, -1, -1, -1],
        extentunits: 'm',
        proxyHost: ""
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};