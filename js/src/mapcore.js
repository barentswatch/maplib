var BW = this.BW || {};
BW.MapCore = {};

(function (ns) {
    'use strict';

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


    function getDefaultParams(config, isBaseLayer) {
        var opacity = config.opacity || 1;
        var visibility = config.visible;
        if (_.isUndefined(visibility)) {
            visibility = true;
        }

        return {
            isBaseLayer: isBaseLayer,
            transitionEffect: 'resize',
            opacity: opacity,
            visibility: visibility
        };

    }

    function createWMSLayer(config, isBaseLayer) {

        var transparent = true;
        if (isBaseLayer) {
            transparent = false;
        }

        var singleTile = !config.tiled;
        var options = _.extend(
            getDefaultParams(config, isBaseLayer),
            {singleTile: singleTile}
        );

        return new OpenLayers.Layer.WMS(
            config.name,
            config.url,
            {
                layers: config.layerName,
                transparent: transparent
            },
            options
        );
    }

    function createWMTSLayer(config, isBaseLayer, map) {

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
            getDefaultParams(config, isBaseLayer)
        );
    }

    function createLayer(config, isBaseLayer, map) {

        if (config.protocol === 'WMTS') {
            return createWMTSLayer(config, isBaseLayer, map);
        }

        if (config.protocol === 'WMS') {
            return createWMSLayer(config, isBaseLayer);
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
                projection: config.srs
            }
        );

        var baseLayerConfig = findById(config.baseLayerList, config.baseLayer);
        var layers = [];
        layers.push(createLayer(baseLayerConfig, true, map));

        var overlays = _.map(config.overlays, function (overlay) {
            var data = findById(config.overlayList, overlay.id);
            return createLayer(_.extend(data, overlay), false, map);
        });

        layers = layers.concat(overlays);

        map.addLayers(layers);

        map.setCenter(
            new OpenLayers.LonLat(config.initPos.x, config.initPos.y),
            config.initZoom
        );

        return map;
    };

}(BW.MapCore));