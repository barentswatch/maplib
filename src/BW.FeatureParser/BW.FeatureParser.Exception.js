var BW = BW || {};
BW.FeatureParser = BW.FeatureParser || {};

BW.FeatureParser.Exception = function() {
    function parse(exception){
        var message = exception.replace(/(<([^>]+)>)/ig, '');
        throw message;
    }

    return {
        Parse: parse
    };
};