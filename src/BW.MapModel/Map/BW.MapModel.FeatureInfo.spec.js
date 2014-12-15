
describe('new BW.MapModel.FeatureInfo', function() {
    var featureInfo;

    beforeEach(function () {
        var mapInstance, httpHelper, featureParser;
        var eventHandler = new BW.Events.EventHandler();
        featureInfo = new BW.MapModel.FeatureInfo(mapInstance, httpHelper, eventHandler, featureParser);
    });

    it('should return its public methods', function () {
        expect(featureInfo.HandlePointSelect).toBeDefined();
        expect(featureInfo.HandleBoxSelect).toBeDefined();
        expect(featureInfo.CreateDefaultInfoMarker).toBeDefined();
        expect(featureInfo.SetInfoMarker).toBeDefined();
        expect(featureInfo.RemoveInfoMarker).toBeDefined();
        expect(featureInfo.GetSupportedGetFeatureInfoFormats).toBeDefined();
        expect(featureInfo.GetSupportedGetFeatureFormats).toBeDefined();
        expect(featureInfo.SetInfoMarkerPath).toBeDefined();
    });
});