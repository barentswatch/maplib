var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.OldConfigRepository = function (configFacade) {

    var config;

    function _createConfig(config) {
        var result = {
            numZoomLevels: 18,
            newMaxRes: 21664.0,
            renderer: BW.Map.OL3Map.RENDERERS.canvas,
            center: [-20617, 7661666],
            zoom:  4,
            coordinate_system: "EPSG:32633",
            extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
            extentunits: 'm',
            layers: [],
            proxyHost: "https://www.barentswatch.no/proxy?url="

        };
        if (!_.isUndefined(config.initZoom)) {
            result.zoom = config.initZoom;
        }
        if (!_.isUndefined(config.center)) {
            result.center = config.center;
        }
        if (!_.isUndefined(config.coordinateSystem)) {
            result.coordinate_system = config.coordinateSystem;
        }
        if (!_.isUndefined(config.numZoomLevels)) {
            result.numZoomLevels = config.numZoomLevels;
        }
        if (!_.isUndefined(config.extent)) {
            result.extent = config.extent;
        }
        if (!_.isUndefined(config.extentUnits)) {
            result.extentunits = config.extentUnits;
        }
        if (!_.isUndefined(config.proxyHost)) {
            result.proxyHost = config.proxyHost;
        }

        for (var i = 0; i < config.baseLayerList.length; i++) {
            var baseLayer = config.baseLayerList[i];
            baseLayer.proxyHost = result.proxyHost;
            baseLayer.coordinate_system = result.coordinate_system;
            baseLayer.extent = result.extent;
            baseLayer.extentunits = result.extentunits;
            result.layers.push(_createBaseLayer(baseLayer));
        }
        for (var j = 0; j < config.overlayList.length; j++) {
            var overlayLayer = config.overlayList[j];
            overlayLayer.proxyHost = result.proxyHost;
            overlayLayer.coordinate_system = result.coordinate_system;
            overlayLayer.extent = result.extent;
            overlayLayer.extentunits = result.extentunits;
            result.layers.push(_createOverlayLayer(overlayLayer));
        }

        return result;
    }

    function _createBaseLayer(configLayer) {
        return _createLayer(configLayer, true);
    }

    function _createOverlayLayer(configLayer) {
        return _createLayer(configLayer, false);
    }

    function _createLayer(configLayer, isBaseLayer) {
        return new BW.MapModel.Layer({
            id: configLayer.id,
            name: configLayer.name,
            visibleOnLoad: _isVisibleLayer(configLayer),
            isBaseLayer: isBaseLayer,
            category: _getCategory(configLayer),
            opacity: _getOpacity(configLayer),
            status : configLayer.status,
            statusTime: configLayer.statusTime,
            subLayers: [
                new BW.MapModel.SubLayer({
                    id: configLayer.id,
                    name: configLayer.layerName,
                    source: _getSource(configLayer.protocol),
                    tiled: configLayer.tiled || false,
                    opacity: _getOpacity(configLayer),
                    format: BW.MapModel.SubLayer.FORMATS.imagepng,
                    url: configLayer.url,
                    coordinate_system: configLayer.coordinate_system,
                    extent: configLayer.extent,
                    extentUnits: configLayer.extentunits,
                    proxyHost: configLayer.proxyHost
                })
            ]
        });
    }

    function _isVisibleLayer(configLayer) {
        var layerSettings = _.find(config.baseLayers, function (l) { return l.id === configLayer.id;});
        if (!_.isUndefined(layerSettings)) {
            return layerSettings.visible;
        }
        layerSettings = _.find(config.overlays, function (l) {return l.id === configLayer.id;});
        if (!_.isUndefined(layerSettings)) {
            return layerSettings.visible;
        }
        return false;
    }

    function _getOpacity(configLayer) {
        var layerSettings = _.find(config.baseLayers, function (l) { return l.id === configLayer.id;});
        if (!_.isUndefined(layerSettings)) {
            return layerSettings.opacity || 1.0;
        }
        layerSettings = _.find(config.overlays, function (l) {return l.id === configLayer.id;});
        if (!_.isUndefined(layerSettings)) {
            return layerSettings.opacity || 1.0;
        }
        return 1.0;
    }

    function _getSource(protocol) {
        switch(protocol) {
            case 'WMS': return BW.MapModel.SubLayer.SOURCES.wms;
            case 'WMTS': return BW.MapModel.SubLayer.SOURCES.wmts;
            case 'proxyWmts': return BW.MapModel.SubLayer.SOURCES.proxyWmts;
            case 'proxyWms': return BW.MapModel.SubLayer.SOURCES.proxyWms;
            default: return BW.MapModel.SubLayer.SOURCES.wms;
        }
    }

    function _getCategory(configLayer) {
        var cat = _.find(config.categories, function (c) {
                                    if (_.contains(c.layers, configLayer.id)) {
                                        return true;
                                    }
        });
        if (!_.isUndefined(cat)) {
            return cat.name;
        }
        return null;
    }

    function _getMapConfig(url, callback) {
        configFacade.getMapConfig(url, function (data) {
            config = data;
            var mapConfig = new BW.Repository.MapConfig(_createConfig(config));
            callback(mapConfig);
        });
    }

    return {
        GetMapConfig: _getMapConfig
    };
};