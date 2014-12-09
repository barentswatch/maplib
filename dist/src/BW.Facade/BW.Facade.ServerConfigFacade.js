var BW = BW || {};
BW.Facade = BW.Facade || {};

BW.Facade.ServerConfigFacade = function () {

    function getMapConfig(url, callback) {

        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};