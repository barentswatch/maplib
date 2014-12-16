var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.Category = function(config){
    var defaults = {
        "catId": "",
        "name": "",
        "parentId": "",
        "subCategories": [],
        "isOpen": false
    };
    return $.extend({}, defaults, config);
};