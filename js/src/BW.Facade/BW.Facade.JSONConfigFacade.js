var BW = BW || {};
BW.Facade = BW.Facade || {};

BW.Facade.JSONConfigFacade = function () {

    function _getMapConfig(data, callback) {
        if (_.isString(data)) {
            data = JSON.parse(data);
        }
        callback(data);
    }

    return {
        getMapConfig: _getMapConfig
    };
};
