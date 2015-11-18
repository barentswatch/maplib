 var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.Baat = function(config) {
    var token = config.token;

    function getToken() {
        return token;
    }

    return {
        getToken: getToken
    };
};