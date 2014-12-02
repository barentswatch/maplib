/*
    Wraps the new OpenLayers 3 "core" lib to be able to simply setup a map
    with layers based on a json-config. See ol3demo.html for example use.

*/

var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};
(function (ns) {
    'use strict';

    ns.setupMap = function (mapDiv, mapConfig, callback) {

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
    };
}(BW.MapCore));
