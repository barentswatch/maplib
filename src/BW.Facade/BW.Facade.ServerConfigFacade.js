var BW = BW || {};
BW.Facade = BW.Facade || {};

BW.Facade.ServerConfigFacade = function () {

    function _getMapConfig(url, callback) {

        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    return {
        getMapConfig: _getMapConfig
    };
};