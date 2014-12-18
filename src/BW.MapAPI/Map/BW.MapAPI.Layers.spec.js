describe('BW.MapAPI.Layers', function(){
    var dummyDivId = 'mapDiv',
        map,
        repository,
        mapConfig,
        measure,
        eventHandler,
        featureInfo,
        mapExport,
        httpHelper,
        layers;

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

        map = new BW.MapImplementation.OL3.Map(repository, eventHandler, httpHelper, measure, featureInfo, mapExport);
        map.InitMap(dummyDivId, mapConfig);

        layers = new BW.MapAPI.Layers(map);

        //spyOn(layers, 'Init').and.callThrough();
        //spyOn(layers, 'GetBaseLayers');
    });

    it('Should return its public methods', function(){
        expect(layers.Init).not.toBeUndefined();
    });

    /*it('', function () {
       expect(layers.GetBaseLayers).toHaveBeenCalled();
    });*/

    it('Test init', function () {
        layers.Init(mapConfig);
        //console.log(layers.GetBaseLayers());
        expect(layers.GetBaseLayers()[0].subLayers[0].name).not.toBeUndefined();
    });

});