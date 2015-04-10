// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.KartKlifNo = function() {
    function parse(result) {
        var jsonResult = [];
        var insteadOfGml = 'insteadofgml';
        result = result.replace(/:gml/g, '');
        result = result.replace(/[\n\f\r\t\0\v]/g, ' '); // replace tab & Co with space
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        result = result.replace(/xmlns\S*="\S+"/g, '');    // remove namespace tags
        result = result.replace(/ +/g, ' '); // replace multispace with space
        result = result.replace(/\s+>/g, '>'); // space inside tag
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
            var responseFeature = new BW.Domain.FeatureResponse();
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