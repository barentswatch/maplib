var BW = this.BW || {};
BW.MapCore = {};

(function (ns) {
    'use strict';

    var Layer = Backbone.Model.extend({});

    var LayerCollection = Backbone.Collection.extend({

        model: Layer,

        getLayers: function () {
            return this.map(function (overlay) {
                return overlay.get('layer');
            });
        }
    });

    var mapDefaults = {
        bounds:
            [
                -2500000.0,
                3500000.0,
                3045984.0,
                9045984.0
            ],
        srs: 'EPSG:32633',
        maxResolution: 21664.0,
        numZoomLevels: 18,
        units: 'm',
        initPos: {x: 346108, y: 7432016},
        initZoom: 3,
        overlays: []
    };


    function getDefaultParams(config) {
        var opacity = config.opacity || 1;
        var visibility = config.visible;
        if (_.isUndefined(visibility)) {
            visibility = true;
        }
        return {
            isBaseLayer: false,
            transitionEffect: 'resize',
            opacity: opacity,
            visibility: visibility
        };

    }

    function createWMSLayer(config) {

        if (_.isUndefined(config.transparent)) {
            config.transparent = true;
        }

        var singleTile = !config.tiled;
        var options = _.extend(
            getDefaultParams(config),
            {singleTile: singleTile}
        );

        return new OpenLayers.Layer.WMS(
            config.name,
            config.url,
            {
                layers: config.layerName,
                transparent: config.transparent
            },
            options
        );
    }

    function createWMTSLayer(config, map) {

        return new OpenLayers.Layer.WMTS(
            {
                name: config.name,
                url: config.url,
                layer: config.layerName,
                format: 'image/png',
                style: 'default',
                matrixSet: map.projection,
                matrixIds: _.map(_.range(map.numZoomLevels), function (i) {
                    return map.projection + ':' + i;
                })
            },
            getDefaultParams(config)
        );
    }

    function createLayer(config, map) {
        if (config.protocol === 'WMTS') {
            return createWMTSLayer(config, map);
        }

        if (config.protocol === 'WMS') {
            return createWMSLayer(config);
        }

        throw new Error(
            'Unknown protrocol "' + config.protocol + '" for layer ' + config.id
        );
    }

    function findById(list, id) {
        return _.find(list, function (element) {
            return element.id === id;
        });
    }

    function createLayerCollection(allLayersList, layersList, map) {
        return new LayerCollection(_.map(layersList, function (overlay) {
            var data = findById(allLayersList, overlay.id);
            return new Layer(_.extend(
                data,
                {layer: createLayer(_.extend(data, overlay), map)}
            ));
        }));
    }

    ns.createMap = function (divName, config) {
        config = config || {};
        config = _.extend(mapDefaults, config);

        var mapBounds = new OpenLayers.Bounds(config.bounds);
        var map = new OpenLayers.Map(
            divName,
            {
                maxExtent: mapBounds,
                maxResolution: config.maxResolution,
                numZoomLevels: config.numZoomLevels,
                units: config.units,
                projection: config.srs,
                allOverlays: true
            }
        );

        var base = new OpenLayers.Layer('', {isBaseLayer: true});
        map.addLayer(base);

        var layers = [];

        var baseLayers = createLayerCollection(
            config.baseLayerList,
            config.baseLayers,
            map
        );

        var overlays = createLayerCollection(
            config.overlayList,
            config.overlays,
            map
        );

        layers = layers.concat(baseLayers.getLayers());
        layers = layers.concat(overlays.getLayers());

        map.addLayers(layers);

        map.setCenter(
            new OpenLayers.LonLat(config.initPos.x, config.initPos.y),
            config.initZoom
        );

        return {
            map: map,
            layers: overlays
        };
    };

}(BW.MapCore));