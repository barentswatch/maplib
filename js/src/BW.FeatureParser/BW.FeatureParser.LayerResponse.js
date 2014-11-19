var BW = BW || {};
BW.FeatureParser = BW.FeatureParser || {};

BW.FeatureParser.LayerResponse = function(){
    return{
        name: '',
        id: -1,
        isLoading: false,
        exception: '',
        features: []
    };
};