
describe('new BW.MapModel.Categories', function() {
    var categories;

    beforeEach(function () {
        categories = new BW.MapModel.Categories();
    });

    it('should return its public methods', function () {
        expect(categories.Init).toBeDefined();
        expect(categories.GetCategoryById).toBeDefined();
        expect(categories.GetCategories).toBeDefined();
    });


});