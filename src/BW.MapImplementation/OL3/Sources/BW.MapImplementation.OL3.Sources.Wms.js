var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Wms = function(bwSubLayer){
    if (bwSubLayer.tiled) {
        return new ol.source.TileWMS({
            params: {
                LAYERS: bwSubLayer.name,
                VERSION: "1.1.1"
            },
            url: bwSubLayer.url,
            format: bwSubLayer.format,
            crossOrigin: 'anonymous',
            transparent: bwSubLayer.transparent
        });
    } else {
        return new ol.source.ImageWMS({
            params: {
                LAYERS: bwSubLayer.name,
                VERSION: "1.1.1"
            },
            url: bwSubLayer.url,
            format: bwSubLayer.format,
            crossOrigin: 'anonymous',
            transparent: bwSubLayer.transparent
        });
    }
};
