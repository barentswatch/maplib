var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};

BW.MapModel.Parsers.FeatureResponse = function() {
    return {
        geometryObject: '',
        crs: '',
        attributes: []
    };
};