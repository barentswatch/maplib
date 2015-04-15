var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Exception = function() {
    function parse(exception) {
        console.log(exception.replace(/(<([^>]+)>)/ig, ''));
        var message = 'No data. Exeption from service logged.';
        throw message;
    }

    return {
        Parse: parse
    };
};
