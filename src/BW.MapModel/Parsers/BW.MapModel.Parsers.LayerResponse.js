var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};

BW.MapModel.Parsers.LayerResponse = function(){
    return{
        id: -1,
        isLoading: false,
        exception: '',
        features: []
    };
};