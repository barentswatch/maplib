var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};
(function (ns) {
    'use strict';

    ns.setupMap = function (mapDiv, mapConfig, callback) {

        //load config from json-
        var facade = {
            getMapConfig: function (url, callback) {
                callback(mapConfig);
            }
        };
        //manual dependency-injection
        var eventHandler = new BW.Events.EventHandler();
        var repo =  new BW.Repository.ConfigRepository(facade);
        var map = new BW.Map.OL3Map(repo, eventHandler);
        var mapModel = new BW.MapModel.Map(map, repo, eventHandler);

        function initMap(data) {
            mapModel.Init(mapDiv, data, callback);
        }

        //lag kartet
        repo.GetMapConfig(null, initMap);
    };
}(BW.MapCore));
