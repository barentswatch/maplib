var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GML = function() {
    function parse(result) {
        if (typeof console === "object") {console.log(result);}
    }

    return {
        Parse: parse
    };
};