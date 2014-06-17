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

    ns.MapConfig = function (divName, config) {
        config = config || {};
        config = _.extend(mapDefaults, config);

        if (config.baseLayerList) {
            this.baseLayerList = config.baseLayerList;
        }

        if (config.overlayList) {
            this.overlayList = config.overlayList;
        }

        var mapBounds = new OpenLayers.Bounds(config.bounds);
        this.map = new OpenLayers.Map(
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
        this.map.addLayer(base);

        var layers = [];

        this.baseLayers = createLayerCollection(
            this.baseLayerList,
            config.baseLayers,
            this.map
        );

        this.overlays = createLayerCollection(
            this.overlayList,
            config.overlays,
            this.map
        );

        layers = layers.concat(this.baseLayers.getLayers());

        if (config.overlays) {
            this.setOverlays(config.overlays);
        }

        this.map.addLayers(layers);

        this.map.setCenter(
            new OpenLayers.LonLat(config.initPos.x, config.initPos.y),
            config.initZoom
        );

        return this;
    };

    ns.MapConfig.prototype.setOverlayList = function (overlayList) {
        this.overlayList = overlayList;
        return this;
    };


    ns.MapConfig.prototype.setOverlays = function (overlays) {

        this.overlays.each(function (layer) {
            layer.get('layer').destroy();
        });
        this.overlays = createLayerCollection(
            this.overlayList,
            overlays,
            this.map
        );
        this.map.addLayers(this.overlays.getLayers());
        return this;
    };


}(BW.MapCore));