var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.Category = function(config){
    var defaults = {
        id: -1,
        name: '',
        isOpen: false,
        parent: -1,
        subCategories: [],
        bwLayers: [],
        isAllLayersSelected: false

    };
    var categoryInstance = $.extend({}, defaults, config); // categoryInstance

    var subCategories = [];
    for(var i = 0; i < config.subCategories.length; i++){
        subCategories.push(new BW.Domain.Category(config.subCategories[i]));
    }

    categoryInstance.subCategories = subCategories;

    return categoryInstance;
};