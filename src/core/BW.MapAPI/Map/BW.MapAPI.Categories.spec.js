
describe('new BW.MapAPI.Categories', function() {
    var categories;

    beforeEach(function () {
        categories = new BW.MapAPI.Categories();
    });

    it('should return its public methods', function () {
        expect(categories.Init).toBeDefined();
        expect(categories.GetCategoryById).toBeDefined();
        expect(categories.GetCategories).toBeDefined();
    });


});