var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Base = function(factory) {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";
        var msGMLOutput = "msgmloutput";
        var fieldsDirectly = "\":";
        var parserName;

        var emptyResult = jQuery.isEmptyObject(result);
        if (emptyResult)
        {
            return null; // Should be empty collection
        }
        if(result.type){
            if(result.type == "FeatureCollection"){
                parserName = 'geoJson';
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(msGMLOutput) > -1){
            parserName = 'kartKlifNo';
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            parserName = 'kartKlifNo';
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else if (result.toLowerCase().indexOf(fieldsDirectly) > -1) {
            return parseFieldsDirectly(result);
        }
        else{
            return null; // Should be empty collection
        }

        var parser = factory.CreateParser(parserName);
        return parser.Parse(result);
    }

    function parseAsException(exception){
        var exceptionParser = new BW.MapAPI.Parsers.Exception();
        exceptionParser.Parse(exception);
    }
    function parseFieldsDirectly(result) {
        var returnArray = [];
        var fieldsArray = result.split(' \"');
        if (fieldsArray != null) {
            for (var i in fieldsArray) {
                var subArray = [];
                if (fieldsArray[i].indexOf('":') > -1) {
                    var valueArray = fieldsArray[i].split('":');
                    if (valueArray != null) {
                        subArray.push(valueArray[0].trim());
                        subArray.push(valueArray[1].trim());
                        returnArray.push(subArray);
                    }
                }
            }
        }
        return _convertToFeatureResponseDirect(returnArray);
    }
    function parseAsHtml(result) {
        var htmlError = result.indexOf("error has occured");
        if (htmlError == -1) {
            var indexOfTableStart = result.indexOf("<table");
            if(indexOfTableStart > -1){
                var tableResult = result.substring(indexOfTableStart, result.length);
                var indexOfTableEnd = tableResult.indexOf("</body>");
                tableResult = tableResult.substring(0, indexOfTableEnd);
                var jsonObject = xml2json.parser(tableResult);
                return _convertToFeatureResponseHtml(jsonObject);//[];
            }
            return _convertToFeatureResponseHtml(undefined);//[];
        }
        return _convertToFeatureResponseHtml(undefined);//[];
    }

    function _convertToFeatureResponseDirect(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = jsonFeatures;
            responseFeatureCollection.push(responseFeature);
        } else {
            var noattributes = [];
            noattributes.push(['data', 'no data found']);
            responseFeature.attributes = noattributes;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _convertToFeatureResponseHtml(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = jsonFeatures;
            responseFeatureCollection.push(responseFeature);
        } else {
            var noattributes = [];
            noattributes.push(['Data', 'no data found']);
            responseFeature.attributes = noattributes;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    return {
        Parse: parse
    };
};