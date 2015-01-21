var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Vector = function(bwSubLayer, mapProjection){
    var source;
    switch (bwSubLayer.format){
        case BW.Domain.SubLayer.FORMATS.geoJson:
            source = new ol.source.GeoJSON({
                projection: mapProjection,
                strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                    maxZoom: 19
                }))
            });
            source.parser = new ol.format.GeoJSON();
            break;
    }
    return source;
};