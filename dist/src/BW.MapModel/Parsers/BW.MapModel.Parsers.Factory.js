var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};
BW.MapModel.Parsers.Factory = function (geoJson, gml, kartKlifNo, fiskeriDir) {
  function createParser(parserName) {
    var parser;
    switch (parserName) {
    case 'geoJson':
      parser = geoJson;
      break;
    case 'gml':
      parser = gml;
      break;
    case 'kartKlifNo':
      parser = kartKlifNo;
      break;
    case 'fisheryDirectory':
      parser = fiskeriDir;
      break;
    }
    return parser;
  }
  return { CreateParser: createParser };
};