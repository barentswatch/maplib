var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Wmts = function(bwSubLayer, proxyhost, tokenparameter){
    var projection = new ol.proj.Projection({
        code: bwSubLayer.coordinate_system,
        extent: bwSubLayer.extent,
        units: bwSubLayer.extentUnits
    });

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(bwSubLayer.numZoomLevels);
    var matrixIds = new Array(bwSubLayer.numZoomLevels);
    var numZoomLevels = bwSubLayer.numZoomLevels;
    var matrixSet = bwSubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
           matrixSet=bwSubLayer.coordinate_system;
    }
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = matrixSet + ":" + z;
    }
    
    var url;
    if (tokenparameter) {
        //don't use proxy when using baat token
        url = bwSubLayer.urlPattern ? bwSubLayer.urlPattern : bwSubLayer.url;
        url = url + tokenparameter;
    } else if (proxyhost && !tokenparameter) {
        url = proxyhost + bwSubLayer.url;
    } else if (!proxyhost && !tokenparameter) {
        url = bwSubLayer.urlPattern ? bwSubLayer.urlPattern : bwSubLayer.url;
    }

    return new ol.source.WMTS({
        url: url,
        layer: bwSubLayer.name,
        format: bwSubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: bwSubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    });
};
