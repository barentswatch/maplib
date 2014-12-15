describe('BW.Domain.Category', function() {
    var tv = 'testValue';
    var subCategoryName = 'testName';
    var config = {
        "id": 1,
        "name": "cat_1",
        "isOpen": true,
        "parent": -1,
        "bwLayers": [],
        "isAllLayersSelected": false,
        "subCategories": [
            {
                "id": 4,
                "name": subCategoryName,
                "isOpen": false,
                "parent": 1,
                "bwLayers": [],
                "isAllLayersSelected": false,
                "subCategories": []
            }],
        testValue: tv
    };

    it('', function(){
        var category = new BW.Domain.Category(config);
        expect(category.isOpen).toBeTruthy();
        expect(category.testValue).toEqual(tv);
        var subCategory = category.subCategories[0];
        expect(subCategory).toBeDefined();
        expect(subCategory.name).toEqual(subCategoryName);
    });
});