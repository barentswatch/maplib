// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.KartKlifNo = function() {
    function parse(result) {
        var properties = {};
        var insteadOfGml = 'insteadofgml';
        result = result.replace(/:gml/g, '');
        result = result.replace(/[\n\f\r\t\0\v]/g, ' '); // replace tab & Co with space
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        result = result.replace(/xmlns\S*="\S+"/g, '');    // remove namespace tags
        result = result.replace(/ +/g, ' '); // replace multispace with space
        result = result.replace(/\s+>/g, '>'); // space inside tag

        var featureTag = $(result).find("*").first().children().last();
        var tagname = featureTag[0].tagName;
        $(result).find(tagname).each(function () {
            console.log("wildcard(*)=" + featureTag);
            $(this).children().each(function () {
                properties[this.tagName] = $(this).text();
                console.log(this.tagName + "/" + $(this).text());
            });
        });
        return _convertToFeatureResponseXML(properties);
    }

    function _convertToFeatureResponseXML(jsonFeatures) {
        var responseFeatureCollection = [];
        if (jsonFeatures !== undefined) {
            var responseFeature = new BW.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArrayXML(jsonFeatures);
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }
    function _getAttributesArrayXML(properties) {
        var attributes = [];
        for (var i in properties) {
            if (i != "INSTEADOFGMLBOUNDEDBY") {
                attributes.push([i, properties[i]]);
            }

        }
        return attributes;
    }

    return {
      Parse: parse
    };
};