var BW = BW || {};
BW.FeatureParser = BW.FeatureParser || {};

BW.FeatureParser.ResultParser = function() {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";

        if(result.type){
            if(result.type == "FeatureCollection"){
                return parseAsJson(result);
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            return parseAsXml(result);
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else{
            return null; // Should be empty collection
        }
    }

    function parseAsException(exception){
        var exceptionParser = new BW.FeatureParser.Exception();
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
            /*var jqTable = $(tableResult);
             var trs = jqTable.find('tr');
             var tds = jqTable.find('td');*/
        }
        return [];
    }

    function parseAsJson(result){
        var jsonParser = new BW.FeatureParser.GeoJSON();
        return jsonParser.Parse(result);
    }

    function parseAsXml(result){
        var xmlParser = new BW.FeatureParser.KartKlifNo();
        return xmlParser.Parse(result);
    }

    return {
        Parse: parse
    };
};