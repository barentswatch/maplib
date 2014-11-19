describe('new BW.MapModel.Map', function() {
    var mapModel;
    var map;
    var repository;

    beforeEach(function(){
        repository = new BW.Repository.StaticRepository();
        spyOn(repository, 'GetMapConfig').and.callThrough();

        map = new BW.Map.OL3Map(repository, new BW.Events.EventHandler());

        mapModel = new BW.MapModel.Map(map);
    });

    it('should return its public methods', inject( function() {
        expect(mapModel.Init).not.toBe(undefined);
        expect(mapModel.ShowLayer).not.toBe(undefined);
        expect(mapModel.HideLayer).not.toBe(undefined);
        expect(mapModel.GetOverlayLayers).not.toBe(undefined);
        expect(mapModel.GetBaseLayers).not.toBe(undefined);
        expect(mapModel.SetBaseLayer).not.toBe(undefined);
        expect(mapModel.SetLayerOpacity).not.toBe(undefined);
    }));

    /**
     * Obsolete, config is called outside mapInit

    it("gets the map config from the repository", function() {
        expect(repository.GetMapConfig).toHaveBeenCalled();
    });
     */

});

describe('BW.MapModel.Map.Init', function() {
    var dummyDivId = 'mapDiv',
        mapModel,
        map,
        repository,
        eventHandler,
        subLayersToShow,
        subLayersToHide,
        mapConf,
        subLayers,
        tools;

    beforeEach(function(){
        var conf = {
            isBaseLayer: true
        };
        subLayersToShow  = [
            new BW.MapModel.SubLayer(conf),
            new BW.MapModel.SubLayer(conf),
            new BW.MapModel.SubLayer(conf)
        ];

        subLayersToHide = [
            new BW.MapModel.SubLayer(conf),
            new BW.MapModel.SubLayer(conf)
        ];

        mapConf = new BW.Repository.MapConfig({
            layers:[
                new BW.MapModel.Layer({
                    visibleOnLoad: true,
                    subLayers: [
                        subLayersToShow[0],
                        subLayersToShow[1]
                    ]
                }),
                new BW.MapModel.Layer({
                    visibleOnLoad: true,
                    subLayers: [
                        subLayersToShow[2]
                    ]
                }),
                new BW.MapModel.Layer({
                    visibleOnLoad: false,
                    subLayers: [
                        subLayersToHide[0],
                        subLayersToHide[1]
                    ]
                })
            ]
        });

        map = new BW.Map.OL3Map(repository, new BW.Events.EventHandler());
        spyOn(map, 'InitMap').and.callThrough();
        spyOn(map, 'HideLayer');
        spyOn(map, 'ShowLayer');

        eventHandler = new BW.Events.EventHandler();

        tools = new BW.Tools.Tools(map);

        mapModel = new BW.MapModel.Map(map);

        mapModel.Init(dummyDivId, mapConf);

        var layers = mapModel.GetOverlayLayers();
        subLayers = [];
        for(var i = 0 ; i < layers.length; i++){
            subLayers = subLayers.concat(layers[i].subLayers);
        }
    });

    it('calls factory.InitMap', function() {
        //repository.GetMapConfig();
        expect(map.InitMap).toHaveBeenCalledWith('mapDiv', mapConf);
    });

    it('shows the layers which should be shown', function() {
        expect(map.ShowLayer.calls.count()).toEqual(3);
        for(var i = 0; i < subLayersToShow; i++){
            var subLayerToShow = subLayersToShow[i];
            expect(subLayerToShow.isVisible).toBeTruthy();
        }
    });

    it('hides the layers which should not be shown', function() {
        // BW.MapModel.Map._showLayer first hides each layer
        expect(map.HideLayer.calls.count()).toEqual(5);

        for(var i = 0; i < subLayersToHide; i++){
            var subLayerToHide = subLayersToHide[i];
            expect(subLayerToHide.isVisible).toBeFalsy();
        }
    });

    it('sets layerIndex in order', function() {
        for(var layerIndex = 0; layerIndex < subLayers.length; layerIndex++){
            expect(subLayers[layerIndex].layerIndex).toEqual(layerIndex);
        }
    });
});