var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.SubLayer = function(config){
    var defaults = {
        name: '',
        providerName: '',   //f.eks Fiskeridirektoratet
        source: BW.Domain.SubLayer.SOURCES.wmts,
        url: '',
        format: BW.Domain.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: new BW.Utils.Guid().newGuid(),
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        featureInfo: new BW.Domain.FeatureInfo()
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    if(instance.url.indexOf('?') == -1){
        instance.url += '?';
    }

    var legendGraphic = new BW.Domain.LegendGraphic({ url: instance.url, layer: instance.name });
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();

    return instance;
};

BW.Domain.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms"
};

BW.Domain.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg",
    geoJson: "application/json"
};