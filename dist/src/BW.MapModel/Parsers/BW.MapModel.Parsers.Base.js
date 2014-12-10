var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};

BW.MapModel.Parsers.Base = function(factory) {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";
        var msGMLOutput = "msgmloutput";

        var parserName;

        if(result.type){
            if(result.type == "FeatureCollection"){
                parserName = 'geoJson';
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            parserName = 'kartKlifNo';
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else if(result.toLowerCase().indexOf(msGMLOutput) > -1){
            parserName = 'fisheryDirectory';
        }
        else{
            return null; // Should be empty collection
        }

        var parser = factory.CreateParser(parserName);
        return parser.Parse(result);
    }

    function parseAsException(exception){
        var exceptionParser = new BW.MapModel.Parsers.Exception();
        exceptionParser.Parse(exception);
    }

    function parseAsHtml(result){
        var indexOfTableStart = result.indexOf("<table");
        if(indexOfTableStart > -1){
            var tableResult = result.substring(indexOfTableStart, result.length);
            var indexOfTableEnd = tableResult.indexOf("</body>");
            tableResult = tableResult.substring(0, indexOfTableEnd);
            console.log(tableResult);
            var jsonObject = xml2json.parser(tableResult);
            console.log(jsonObject);
        }
        return [];
    }

    return {
        Parse: parse
    };
};