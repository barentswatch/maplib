/*
    Wraps the new OpenLayers 3 "core" lib to be able to simply setup a map
    with layers based on a json-config. See ol3demo.html for example use.

*/

var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};
(function (ns) {
    'use strict';

    ns.setupMap = function (mapDiv, mapConfig, callback) {

        /*
        //load config from json
        var facade = new BW.Facade.JSONConfigFacade();
        //manual dependency-injection
        var eventHandler = new BW.Events.EventHandler();
        var repo =  new BW.Repository.ConfigRepository(facade);
        var map = new BW.Map.OL3Map(repo, eventHandler);
        var mapModel = new BW.MapModel.Map(map, repo, eventHandler);

        function initMap(data) {
            mapModel.Init(mapDiv, data, callback);
        }

        //lag kartet
        repo.GetMapConfig(mapConfig, initMap);
        */

        var eventHandler = new BW.Events.EventHandler();
        var mapImplementation = new BW.MapImplementation.OL3.Map(
            null,
            eventHandler
        );
        var layerHandler = new BW.MapAPI.Layers(mapImplementation);
        var categoryHandler = new BW.MapAPI.Categories();

        var map = new BW.MapAPI.Map(
            mapImplementation,
            eventHandler,
            null,
            layerHandler,
            categoryHandler
        );
        var fetched = function (olmap) {
            if (callback) {
                callback(olmap, map);
            }
        };
        map.Init(mapDiv, mapConfig, fetched);

        return map;
    };
}(BW.MapCore));
