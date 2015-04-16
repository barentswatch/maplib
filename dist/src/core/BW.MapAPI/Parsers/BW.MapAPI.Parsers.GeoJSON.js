var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};
var mapObj = {
    "j.pattedyr": "jøpattedyr",
    "mr.de": "mråde",
    ".kjerring": "åkjerring"
};

BW.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];
        var replaceFeatures = [];
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
            // remove symbols
            var replaced = [];
            for (var j in responseFeature.attributes) {
                replaced = responseFeature.attributes[j];
                if (replaced != null) {
                    replaceFeatures.push(replaceUtfError(replaced));
                }
            }
            responseFeature.attributes = replaceFeatures;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }
    function replaceUtfError(element) {
        var sub = [];
        var replacedValue = "";
        var attributeName = "";
        if (element!= null) {
            if (typeof element[1]== "number") {
                replacedValue = element[1].toString();
            }

            if (typeof element[1] == "string") {
                var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
                replacedValue = element[1].replace(re, function (matched) {
                    return mapObj[matched];
                });
            }
            if (element[0]!=="") {
                attributeName = element[0];
            }
        }
        sub.push(attributeName);
        sub.push(replacedValue);
        return sub;
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
