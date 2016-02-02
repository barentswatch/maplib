/*global ol*/
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Vector = function (bwSubLayer) {
    "use strict";
    var source;
    switch (bwSubLayer.format) {
    case BW.Domain.SubLayer.FORMATS.topojson:
        source = new ol.source.Vector({
            url: bwSubLayer.url, //TODO relative?
            format: new ol.format.TopoJSON({defaultDataProjection: bwSubLayer.coordinate_system })
        });
        break;
    }
    return source;
};