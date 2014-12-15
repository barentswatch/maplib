var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};

BW.MapModel.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            if(result.crs.properties.code){
                crs = result.crs.type + ':' + result.crs.properties.code;
            }
            else if(result.properties.name){
                // pattern name=urn:ogc:def:crs:EPSG::32633
                crs = result.properties.name.substring(result.properties.name.indexOf('EPSG'), result.properties.name.length);
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
