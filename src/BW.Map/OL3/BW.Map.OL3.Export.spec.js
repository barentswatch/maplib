describe('BW.Map.OL3.Export', function() {
    var mapExport = new BW.Map.OL3.Export();

    it('Expect public methods to be set for Export', function(){
        expect(mapExport.Activate).not.toBeUndefined();
        expect(mapExport.Deactivate).not.toBeUndefined();
        expect(mapExport.ExportMap).not.toBeUndefined();
        expect(mapExport.WindowResized).not.toBeUndefined();
    });
});