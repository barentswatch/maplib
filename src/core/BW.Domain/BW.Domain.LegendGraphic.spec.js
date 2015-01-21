describe('BW.Domain.LegendGraphic', function() {
    var layerName = 'testName';
    var config = {
        layer: layerName
    };

    it('', function(){
        var legendGraphic = new BW.Domain.LegendGraphic(config);
        expect(legendGraphic.GetLegendGraphicUrl()).toMatch(/20/); // Default image with and height
        expect(legendGraphic.GetLegendGraphicUrl()).toMatch(layerName);
    });
});