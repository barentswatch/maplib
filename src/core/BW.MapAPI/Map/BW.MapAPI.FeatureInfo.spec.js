
describe('new BW.MapAPI.FeatureInfo', function() {
    var featureInfo;

    beforeEach(function () {
        var mapImplementation, httpHelper, featureParser;
        var eventHandler = new BW.Events.EventHandler();
        featureInfo = new BW.MapAPI.FeatureInfo(mapImplementation, httpHelper, eventHandler, featureParser);
    });

    it('should return its public methods', function () {
        expect(featureInfo.HandlePointSelect).toBeDefined();
        expect(featureInfo.HandleBoxSelect).toBeDefined();
        expect(featureInfo.CreateDefaultInfoMarker).toBeDefined();
        expect(featureInfo.SetInfoMarker).toBeDefined();
        expect(featureInfo.RemoveInfoMarker).toBeDefined();
        expect(featureInfo.GetSupportedGetFeatureInfoFormats).toBeDefined();
        expect(featureInfo.AssignInfoFormat).toBeDefined();
        expect(featureInfo.GetSupportedGetFeatureFormats).toBeDefined();
        expect(featureInfo.SetInfoMarkerPath).toBeDefined();
    });
});