var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.MapConfig.Category = function(config){
    var defaults = {
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};