var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            var crsObject = result.crs;
            if(crsObject.properties.code){
                crs = crsObject.type + ':' + crsObject.properties.code;
            }
            else if(crsObject.properties.name){
                // pattern name=urn:ogc:def:crs:EPSG::32633
                crs = crsObject.properties.name.substring(crsObject.properties.name.indexOf('EPSG'), crsObject.properties.name.length);
            }
        }

        var features = result.features;
        for(var i = 0; i < features.length; i++){
            var feature = features[i];

            var responseFeature = new BW.Domain.FeatureResponse();
            responseFeature.crs = crs;
            responseFeature.geometryObject = feature;
            responseFeature.attributes = _getAttributesArray(feature.properties);

            responseFeatureCollection.push(responseFeature);
        }

        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
