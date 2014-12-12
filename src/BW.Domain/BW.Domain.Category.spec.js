describe('BW.Domain.Category', function() {
    var tv = 'testValue';
    var subCategoryName = 'testName';
    var config = {
        "id": 1,
        "name": "cat_1",
        "open": true,
        "parent": -1,
        "subCategories": [
            {
                "id": 4,
                "name": subCategoryName,
                "open": true,
                "parent": 1,
                "subCategories": []
            }],
        testValue: tv
    };

    it('', function(){
        var category = new BW.Domain.Category(config);
        expect(category.open).toBeTruthy();
        expect(category.testValue).toEqual(tv);
        var subCategory = category.subCategories[0];
        expect(subCategory).toBeDefined();
        expect(subCategory.name).toEqual(subCategoryName);
    });
});