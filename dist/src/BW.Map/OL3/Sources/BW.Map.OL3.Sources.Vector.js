var BW = BW || {};
BW.Map = BW.Map || {};
BW.Map.OL3 = BW.Map.OL3 || {};
BW.Map.OL3.Sources = BW.Map.OL3.Sources || {};

BW.Map.OL3.Sources.Vector = function(bwSubLayer, mapProjection){
    var source;
    switch (bwSubLayer.format){
        case BW.Domain.SubLayer.FORMATS.geoJson:
            source = new ol.source.GeoJSON({
                projection: mapProjection
            });
            source.parser = new ol.format.GeoJSON();
            break;
    }
    return source;
};