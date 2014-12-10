var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.Layer = function(config){
    var defaults = {
        subLayers: [],
        name: '',
        categoryId: 0,
        visibleOnLoad: true,
        isVisible: false, // Holds current state, will be set to true on factory.Init if VisibleOnLoad = true
        id: new BW.Utils.Guid().newGuid(),
        isBaseLayer: false,
        previewActive: false,
        opacity: 1,
        mapLayerIndex: -1,
        legendGraphicUrls: [],
        selectedLayerOpen: false //todo johben temp
    };
    var layerInstance = $.extend({}, defaults, config); // layerInstance

    var subLayers = [];
    for(var i = 0; i < config.subLayers.length; i++){
        subLayers.push(new BW.Domain.SubLayer(config.subLayers[i]));
    }

    layerInstance.subLayers = subLayers;

    return layerInstance;
};