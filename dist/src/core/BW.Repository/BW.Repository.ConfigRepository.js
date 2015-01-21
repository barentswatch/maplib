var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.ConfigRepository = function (configFacade, eventHandler) {

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
            layers.push(new BW.Domain.Layer(config.layers[i]));
        }

        result.layers = layers;

        return new BW.Repository.MapConfig(result);
    }

    function getMapConfig(url){
        configFacade.GetMapConfig(url, function (data) {
            var mapConfig = _createConfig(data);
            eventHandler.TriggerEvent(BW.Events.EventTypes.MapConfigLoaded, mapConfig);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};