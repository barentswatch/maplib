describe('BW.Domain.SubLayer', function() {
    var tv = 'testValue';
    var config = {
        layerIndex: 0,
        testValue: tv,
        source: BW.Domain.SubLayer.SOURCES.proxyWms,
        isBaseLayer: false

    };

    it('', function(){
        var subLayer = new BW.Domain.SubLayer(config);
        expect(subLayer.layerIndex).toEqual(0);
        expect(subLayer.testValue).toEqual(tv);
        expect(subLayer.legendGraphicUrl).toMatch(/20/); // Default image with and height
    });
});