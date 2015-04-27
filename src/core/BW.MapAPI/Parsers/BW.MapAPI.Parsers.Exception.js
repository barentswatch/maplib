var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Exception = function() {
    function parse(exception) {
        if (typeof console === "object") {
        console.log(exception.replace(/(<([^>]+)>)/ig, ''));}
        //var message = 'No data received from service. Exception was logged to console.';
        var message = 'Det er ingen data tilgjengelig i dette punktet';
        throw message;
    }

    return {
        Parse: parse
    };
};
