var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.SubLayer = function(config){
    var defaults = {
        name: '',
        source: BW.MapModel.SubLayer.SOURCES.wmts,
        url: '',
        format: BW.MapModel.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: new BW.Utils.Guid().newGuid(),
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        isQueryable: true,
        parser: new BW.FeatureParser.ResultParser(),
        supportedInfoFormats: []
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    var legendGraphic = new BW.MapModel.LegendGraphic({ url: instance.url, layer: instance.name });
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();

    return instance;
};

BW.MapModel.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms"
};

BW.MapModel.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg"
};