describe('BW.Domain.FeatureInfo', function() {
    var tv = 'testValue';
    var config = {
        supportsGetFeatureInfo: false,
        testValue: tv
    };

    it('', function(){
        var featureInfo = new BW.Domain.FeatureInfo(config);
        expect(featureInfo.supportsGetFeatureInfo).toBeFalsy();
        expect(featureInfo.testValue).toEqual(tv);
    });
});