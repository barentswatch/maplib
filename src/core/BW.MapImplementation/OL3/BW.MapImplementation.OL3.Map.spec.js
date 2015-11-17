describe('BW.MapImplementation.OL3.Map', function(){
    var dummyDivId = 'mapDiv',
        map,
        repository,
        mapConfig,
        measure,
        eventHandler,
        featureInfo,
        mapExport,
        httpHelper,
        baat;

    beforeEach(function(){
        repository = new BW.Repository.StaticRepository();
        spyOn(repository, 'GetMapConfig').and.callThrough();
        mapConfig = repository.GetMapConfig();

        measure = new BW.MapImplementation.OL3.Measure();
        eventHandler = new BW.Events.EventHandler();
        httpHelper = function(){
            function getResult(url, callback){
                $.getJSON(url, function (data) {
                    callback(data);
                });
            }

            return {
                get: getResult
            };
        };
        featureInfo = new BW.MapImplementation.OL3.FeatureInfo();
        mapExport = new BW.MapImplementation.OL3.Export();
        wmsTime = new BW.MapImplementation.OL3.Time();
        baat = new BW.Repository.Baat({token: "123"});

        map = new BW.MapImplementation.OL3.Map(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, wmsTime, baat);

        spyOn(map, 'InitMap').and.callThrough();
        spyOn(map, 'ShowLayer');
        spyOn(map, 'HideLayer');
        /*spyOn(map, '');
        spyOn(map, '');
        spyOn(map, '');*/

        map.InitMap(dummyDivId, mapConfig);

        map.ShowLayer(mapConfig.layers[0].subLayers[0]);
    });

    it('Should return its public methods', function(){
        expect(map.ActivateInfoClick).not.toBeUndefined();
        // TODO: Add more methods
    });

    it('ShowLayer', function(){
        expect(map.ShowLayer).toHaveBeenCalled();
    });

});