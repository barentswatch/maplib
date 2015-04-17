var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Factory = function(geoJson, gml, generalXmlGml, fiskeriDir){
    function createParser(parserName){
        var parser;
        switch (parserName){
            case 'geoJson':
                parser = geoJson;
                break;
            case 'gml':
                parser = gml;
                break;
            case 'generalXmlGml':
                parser = generalXmlGml;
                break;
            case 'fisheryDirectory':
                parser = fiskeriDir;
                break;
        }
        return parser;
    }

    return {
        CreateParser: createParser
    };
};