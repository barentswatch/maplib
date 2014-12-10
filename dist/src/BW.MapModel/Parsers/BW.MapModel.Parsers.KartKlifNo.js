// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};

BW.MapModel.Parsers.KartKlifNo = function() {
    function parse(result) {
        var jsonResult = [];
        result = result.replace(/:/g, ''); // Remove colon to prevent xml errors
        var jsonFeatures = xml2json.parser(result);

        if(jsonFeatures.featureinforesponse){
            var response = jsonFeatures.featureinforesponse;
            if(response.fields){
                var fields = response.fields;
                if(fields instanceof Array){
                    for(var i = 0; i < fields.length; i++){
                        jsonResult.push(fields[i]);
                    }
                }
                else{
                    jsonResult.push(fields);
                }
            }
        }
        return _convertToFeatureResponse(jsonResult);
    }

    function _convertToFeatureResponse(jsonFeatures){
        var responseFeatureCollection = [];
        for(var i = 0; i < jsonFeatures.length; i++){
            var responseFeature = new BW.MapModel.Parsers.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(jsonFeatures[i]);
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