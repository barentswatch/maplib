var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.Categories = function(){
    var categories = [];

    function init(mapConfig) {
        categories = mapConfig.categories;
    }

    function getCategories() {
        return categories;
    }

    function getCategoryById(id) {
        for(var i = 0; i < categories.length; i++){
            var cat = categories[i];
            if (cat.id.toString() === id.toString()){
                return cat;
            }
            for (var j = 0; j < categories[i].subCategories.length; j++) {
                var subcat = categories[i].subCategories[j];
                if (subcat.id.toString() === id.toString()){
                    return subcat;
                }
            }
        }
    }

    return {
        Init: init,
        GetCategoryById: getCategoryById,
        GetCategories: getCategories
    };
};