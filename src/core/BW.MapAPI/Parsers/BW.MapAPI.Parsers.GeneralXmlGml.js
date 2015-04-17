// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GeneralXmlGml = function() {
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
        if (featureTag.length > 0) {
            var tagname = featureTag[0].tagName;
            $(result).find(tagname).each(function () {
                if (typeof console === "object") {console.log("wildcard(*)=" + featureTag);}
                $(this).children().each(function () {
                    properties[this.tagName] = $(this).text();
                    if (typeof console === "object") {console.log(this.tagName + "/" + $(this).text());}
                });
            });

            return _convertToFeatureResponseXML(properties);
        }
        return _convertToFeatureResponseXML(undefined);
    }

    function _convertToFeatureResponseXML(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = _getAttributesArrayXML(jsonFeatures);
            responseFeatureCollection.push(responseFeature);
        } else {
            var noattributes = [];
            noattributes.push(['data','no data found']);
            responseFeature.attributes = noattributes;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _getAttributesArrayXML(properties) {
        var attributes = [];
        for (var i in properties) {
            if (i !== "INSTEADOFGMLBOUNDEDBY") {
                attributes.push([i, properties[i]]);
            }

        }
        return attributes;
    }

    return {
        Parse: parse
    };
};