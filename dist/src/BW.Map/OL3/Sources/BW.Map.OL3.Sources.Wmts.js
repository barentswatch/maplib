var BW = BW || {};
BW.Map = BW.Map || {};
BW.Map.OL3 = BW.Map.OL3 || {};
BW.Map.OL3.Sources = BW.Map.OL3.Sources || {};
BW.Map.OL3.Sources.Wmts = function (bwSubLayer) {
  var projection = new ol.proj.Projection({
      code: bwSubLayer.coordinate_system,
      extent: bwSubLayer.extent,
      units: bwSubLayer.extentUnits
    });
  var projectionExtent = projection.getExtent();
  var size = ol.extent.getWidth(projectionExtent) / 256;
  var resolutions = new Array(14);
  var matrixIds = new Array(14);
  var numZoomLevels = 18;
  for (var z = 0; z < numZoomLevels; ++z) {
    resolutions[z] = size / Math.pow(2, z);
    matrixIds[z] = projection.getCode() + ':' + z;
  }
  return new ol.source.WMTS({
    url: bwSubLayer.url,
    layer: bwSubLayer.name,
    format: bwSubLayer.format,
    projection: projection,
    matrixSet: bwSubLayer.coordinate_system,
    crossOrigin: 'anonymous',
    tileGrid: new ol.tilegrid.WMTS({
      origin: ol.extent.getTopLeft(projectionExtent),
      resolutions: resolutions,
      matrixIds: matrixIds
    })
  });
};