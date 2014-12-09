var BW = BW || {};
BW.Map = BW.Map || {};
BW.Map.OL3 = BW.Map.OL3 || {};
BW.Map.OL3.Utilities = function () {
  function convertGmlToGeoJson(gml) {
    var xmlParser = new ol.format.WMSCapabilities();
    var xmlFeatures = xmlParser.read(gml);
    var gmlParser = new ol.format.GML();
    var features = gmlParser.readFeatures(xmlFeatures);
    var jsonParser = new ol.format.GeoJSON();
    return jsonParser.writeFeatures(features);
  }
  function extentToGeoJson(x, y) {
    var point = new ol.geom.Point([
        x,
        y
      ]);
    var feature = new ol.Feature();
    feature.setGeometry(point);
    var geoJson = new ol.format.GeoJSON();
    return geoJson.writeFeature(feature);
  }
  return {
    ConvertGmlToGeoJson: convertGmlToGeoJson,
    ExtentToGeoJson: extentToGeoJson
  };
};