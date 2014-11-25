var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.ConfigRepository = function (configFacade) {

    var config;

    function _createConfig(config) {
        var result = {
            numZoomLevels: 18,
            newMaxRes: 21664.0,
            center: [-20617, 7661666],
            zoom:  4,
            extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
            layers: [],
            proxyHost: "https://www.barentswatch.no/proxy?url=",
            tools: []
        };
        $.extend(result, config);

        var layers = [];
        for(var i = 0; i < config.layers.length; i++){
            layers.push(new BW.MapModel.Layer(config.layers[i]));
        }

        result.layers = layers;

        return result;
    }

    function _getMapConfig(url, callback) {
        configFacade.getMapConfig(url, function (data) {
            config = data;
            var mapConfig = new BW.Repository.MapConfig(_createConfig(config));
            callback(mapConfig);
        });
    }

    return {
        GetMapConfig: _getMapConfig
    };
};