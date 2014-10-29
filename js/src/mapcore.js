var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};

(function (ns) {
    'use strict';


    //A layer model
    var Layer = Backbone.Model.extend({});


    //A collection of layers
    var LayerCollection = Backbone.Collection.extend({

        model: Layer,

        getLayers: function () {
            return this.map(function (overlay) {
                return overlay.get('layer');
            });
        }
    });


    var mapDefaults = {
        bounds: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
        srs: 'EPSG:32633',
        maxResolution: 21664.0,
        numZoomLevels: 18,
        units: 'm',
        initPos: {x: 346108, y: 7432016},
        initZoom: 3,
        overlays: [],
        theme: OpenLayers._getScriptLocation() + 'theme/default/style.css'
    };


    //creates default params for layers
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

        var extraParams = ['maxResolution', 'minResolution'];
        var extra = _.reduce(extraParams, function (extra, key) {
            if (config[key]) {
                extra[key] = config[key];
            }
            return extra;
        }, {});


        return new OpenLayers.Layer.WMS(
            config.name,
            config.url,
            {
                layers: config.layerName,
                transparent: config.transparent
            },
            _.extend(options, extra)
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

    function createGeoJSONLayer(config, map) {

        var style = new OpenLayers.Style().defaultStyle;
        if (config.style) {
            style = config.style;
        }

        return new OpenLayers.Layer.Vector(
            config.name,
            {
                strategies: [new OpenLayers.Strategy.Fixed()],
                protocol: new OpenLayers.Protocol.HTTP({
                    url: config.url,
                    format: new OpenLayers.Format.GeoJSON()
                }),
                style: style
            }
        );
    }

    //create a layer of given type
    function createLayer(config, map) {
        if (config.protocol === 'WMTS') {
            return createWMTSLayer(config, map);
        }

        if (config.protocol === 'WMS') {
            return createWMSLayer(config);
        }

        if (config.protocol === 'GeoJSON') {
            return createGeoJSONLayer(config);
        }

        throw new Error(
            'Unknown protrocol "' + config.protocol + '" for layer ' + config.id
        );
    }


    //find an element by id in a list
    function findById(list, id) {
        return _.find(list, function (element) {
            return element.id === id;
        });
    }


    //create a layer collection from a list of selected layers and the
    //complete list
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
        config = _.extend(_.clone(mapDefaults), config);

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
                allOverlays: true,
                theme: config.theme
            }
        );

        //use a blank background layer in order to use more than one background
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

        this.map.addLayers(layers);

        if (config.overlays) {
            this.setOverlays(config.overlays);
        }

        this.config = config;
        this.setInitialCenter();
        return this;
    };

    ns.MapConfig.prototype.setInitialCenter = function () {
        this.map.setCenter(
            new OpenLayers.LonLat(this.config.initPos.x, this.config.initPos.y),
            this.config.initZoom
        );
    };

    ns.MapConfig.prototype.registerMapEvent = function (event, callback, scope) {
        this.map.events.register(event, scope, callback);
    };

    //sets the list of available overlays
    ns.MapConfig.prototype.setOverlayList = function (overlayList) {
        this.overlayList = overlayList;
        return this;
    };


    //sets the current overlays in the map (resets the exsisting!)
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
