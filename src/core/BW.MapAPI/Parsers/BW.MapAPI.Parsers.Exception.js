var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Exception = function() {
    function parse(exception) {
        if (typeof console === "object") {
        console.log(exception.replace(/(<([^>]+)>)/ig, ''));}
        var message = 'No data. Exeption from service logged.';
        throw message;
    }

    return {
        Parse: parse
    };
};
