var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.MapConfig.SubCategory = function(config){
    var defaults = {
        "catId": "",
        "name": "",
        "parentId": ""
    };
    return $.extend({}, defaults, config);
};