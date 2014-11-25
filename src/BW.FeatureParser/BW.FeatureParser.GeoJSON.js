var BW = BW || {};
BW.FeatureParser = BW.FeatureParser || {};

BW.FeatureParser.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            crs = result.crs.type + ':' + result.crs.properties.code;
        }

        var features = result.features;
        for(var i = 0; i < features.length; i++){
            var feature = features[i];

            var responseFeature = new BW.FeatureParser.FeatureResponse();
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
