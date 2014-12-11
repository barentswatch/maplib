var BW = BW || {};
BW.Facade = BW.Facade || {};

BW.Facade.JSONConfigFacade = function () {

    function _getMapConfig(data, callback) {
        if (_.isString(data)) {
            data = JSON.parse(data);
        }
        callback(data);
    }

    return {
        getMapConfig: _getMapConfig
    };
};

var BW = BW || {};
BW.Map = BW.Map || {};

BW.Map.OL3Map = function(repository, eventHandler){
    var map;
    var layerPool = [];
    var infoKey = "";

    //Cosmetic layers for rendering effects
    var highLightLayer = null;
    var highlightStyle = null;
    var proxyHost = "";
    var layout = "";

    function initMap(targetId, mapConfig, callback){
        proxyHost = mapConfig.proxyHost;
        var numZoomLevels = mapConfig.numZoomLevels;
        var newMapRes = [];
        newMapRes[0]= mapConfig.newMaxRes;
        for (var t = 1; t < numZoomLevels; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
        }
        var sm = new ol.proj.Projection({
            code: mapConfig.coordinate_system,
            extent: mapConfig.extent,
            units: mapConfig.extentUnits
        });

        map = new ol.Map({
            target: targetId,
            renderer: mapConfig.renderer,
            layers: [],
            view: new ol.View({
                projection: sm,
                center: mapConfig.center,
                zoom: mapConfig.zoom,
                resolutions: newMapRes,
                maxResolution: mapConfig.newMaxRes,
                numZoomLevels: numZoomLevels
            }),
            controls: [],
            overlays: []
        });

        registerMapCallbacks();
        if (callback) {
            callback(map);
        }
    }

    function registerMapCallbacks(){
        var view = map.getView();
        var mapViewChanged = function(){
            var view = map.getView();
            var center = view.getCenter();
            var zoom = view.getZoom().toString();
            // when the directive is instantiated the view may not
            // be defined yet.
            if (center && zoom !== undefined) {
                var x = center[1].toFixed(2);
                var y = center[0].toFixed(2);
                return { x: x, y: y, zoom: zoom};
            }
            return {};
        };

        var changeCenter = function(){
            var mapViewChangedObj = mapViewChanged();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeCenter, mapViewChangedObj);
        };

        var changeResolution = function(){
            var mapViewChangedObj = mapViewChanged();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeResolution, mapViewChangedObj);
        };

        var changeWindowSize = function() {
            if (exportActive){
                printRectangle = _getScreenRectangle();
                map.render();
            }
        };

        window.addEventListener('resize', changeWindowSize);
        view.on('change:center', changeCenter);
        view.on('change:resolution', changeResolution);
    }

    function changeView(viewPropertyObject){
        var view = map.getView();
        var x, y, zoom;
        if(viewPropertyObject.x){
            x = viewPropertyObject.x;
        }
        if(viewPropertyObject.y){
            y = viewPropertyObject.y;
        }
        if(viewPropertyObject.zoom){
            zoom = viewPropertyObject.zoom;
        }

        if(x !== undefined && y !== undefined){
            var eastings = parseFloat(y.replace(/,/g, '.'));
            var northings = parseFloat(x.replace(/,/g, '.'));
            if (isFinite(eastings) && isFinite(northings)) {
                view.setCenter([eastings, northings]);
            }
        }

        if(zoom !== undefined){
            view.setZoom(zoom);
        }
    }

    function showLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);
        map.addLayer(layer);

        _trigLayersChanged();
    }

    function showBaseLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);
        map.getLayers().insertAt(0, layer);

        _trigLayersChanged();
    }

    function hideLayer(bwSubLayer){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer){
            map.removeLayer(layer);
            _trigLayersChanged();
        }
    }

    function _createLayer(bwSubLayer){
        var layer, source;
        var layerFromPool = _getLayerFromPool(bwSubLayer);

        if(layerFromPool != null){
            layer = layerFromPool;
        }
        else{
            switch(bwSubLayer.source){
                case BW.MapModel.SubLayer.SOURCES.wmts:
                    source = new BW.Map.OL3Map.WmtsSource(bwSubLayer);
                    break;

                case BW.MapModel.SubLayer.SOURCES.proxyWmts:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.Map.OL3Map.WmtsSource(bwSubLayer);
                    break;

                case BW.MapModel.SubLayer.SOURCES.wms:
                    source = new BW.Map.OL3Map.WmsSource(bwSubLayer);
                    break;
                /**
                 Bruker proxy mot disse):
                 Image from origin
                 'http://maps.imr.no' 'http://kart.fiskeridir.no' 'http://wms2.nve.no'
                 'http://wms3.nve.no' 'http://bw-wms.met.no' 'http://wms.dirnat.no'
                 'http://kart.klif.no' 'http://wms.miljodirektoratet.no' 'http://npdwms.npd.no'
                 'http://kart.kystverket.no'
                 has been blocked from loading by Cross-Origin Resource Sharing policy:
                 No 'Access-Control-Allow-Origin' header is present on the requested resource.
                 **/
                case BW.MapModel.SubLayer.SOURCES.proxyWms:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.Map.OL3Map.WmsSource(bwSubLayer);
                    break;
                default:
                    throw "Unsupported source: BW.MapModel.SubLayer.SOURCES.'" +
                            bwSubLayer.source +
                            "'. For SubLayer with url " + bwSubLayer.url +
                            " and name " + bwSubLayer.name + ".";
            }

            if (bwSubLayer.tiled) {
                layer = new ol.layer.Tile({
                    extent: bwSubLayer.extent,
                    opacity: bwSubLayer.opacity,
                    source: source
                });
            } else {
                layer = new ol.layer.Image({
                    extent: bwSubLayer.extent,
                    opacity: bwSubLayer.opacity,
                    source: source
                });
            }

            layer.layerIndex = bwSubLayer.layerIndex;
            layer.guid = bwSubLayer.id;

            layerPool.push(layer);
        }

        return layer;
    }

    function _getLayerFromPool(bwSubLayer){
        for(var i = 0; i < layerPool.length; i++){
            var layerInPool = layerPool[i];
            if(layerInPool.guid == bwSubLayer.id){
                return layerInPool;
            }
        }
        return null;
    }

    function setLayerBrightness(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setBrightness(Math.min(value,1));
        }
    }
    function setLayerContrast(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setContrast(Math.min(value,1));
        }
    }
    function setLayerOpacity(bwSubLayer, value){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setOpacity(Math.min(value,1));
        }
    }
    function setLayerSaturation(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setSaturation(Math.min(value,1));
        }
    }
    function setLayerHue(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setHue(Math.min(value,1));
        }
    }

    function _getLayersWithGuid(){
        return map.getLayers().getArray().filter(function(elem){
            return elem.guid !== undefined;
        });
    }

    function _getLayerByGuid(guid){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == guid){
                return layer;
            }
        }
        return null;
    }

    function getLayerIndex(bwSubLayer){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == bwSubLayer.id){
                return i;
            }
        }
        return null;
    }

    function getLayerByName(layerTitle) {
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].get('title') == layerTitle) {
                return layers[i];
            }
        }
        return null;
    }

    function moveLayerToIndex(bwSubLayer, index){
        var subLayerIndex = getLayerIndex(bwSubLayer);
        var layersArray = map.getLayers().getArray();
        layersArray.splice(index, 0, layersArray.splice(subLayerIndex, 1)[0]);

        _trigLayersChanged();
    }

    function redrawMap(){
        map.updateSize();
    }

    function renderSync(){
        map.renderSync();
    }

    var mapExportEvents;
    var printRectangle;
    var exportActive = false;

    function activateExport(options) {
        layout = options.layout;
        exportActive = true;
        printRectangle = _getScreenRectangle();
        mapExportEvents = [
            map.on('precompose', _handlePreCompose),
            map.on('postcompose', _handlePostCompose)
        ];
        redrawMap();
    }

    function deactivateExport() {
        exportActive = false;
        if (mapExportEvents) {
            for (var i = 0; i < mapExportEvents.length; i++) {
                mapExportEvents[i].src.unByKey(mapExportEvents[i]);
            }
        }
        redrawMap();
    }

    var _handlePreCompose = function(evt) {
        var ctx = evt.context;
        ctx.save();
    };

    var _handlePostCompose = function(evt) {
        var ctx = evt.context;
        var mapSize = _getMapSize();

        // Create polygon-overlay for export-area
        ctx.beginPath();
        // Outside polygon (clockwise)
        ctx.moveTo(0, 0);
        ctx.lineTo(mapSize.width, 0);
        ctx.lineTo(mapSize.width, mapSize.height);
        ctx.lineTo(0, mapSize.height);
        ctx.lineTo(0, 0);
        ctx.closePath();

        // Inner polygon (counter-clockwise)
        ctx.moveTo(printRectangle.minx, printRectangle.miny);
        ctx.lineTo(printRectangle.minx, printRectangle.maxy);
        ctx.lineTo(printRectangle.maxx, printRectangle.maxy);
        ctx.lineTo(printRectangle.maxx, printRectangle.miny);
        ctx.lineTo(printRectangle.minx, printRectangle.miny);
        ctx.closePath();

        ctx.fillStyle = 'rgba(25, 25, 25, 0.75)';
        ctx.fill();

        ctx.restore();
    };

    function _getScreenRectangle() {
        var A4_RATIO = 210/297;
        var mapSize = map.getSize();
        var h,w;
        if (layout.value === "a4portrait") {
            w = mapSize[1] * A4_RATIO;
            if (w>mapSize[0]){
                w = mapSize[0];
                h = mapSize[0] / A4_RATIO;
            } else {
                h = mapSize[1];
            }
        } else {
            h = mapSize[0] * A4_RATIO;
            if (h>mapSize[1]){
                h = mapSize[1];
                w = mapSize[1] / A4_RATIO;
            } else {
                w = mapSize[0];
            }
        }

        var center = [mapSize[0] * ol.has.DEVICE_PIXEL_RATIO / 2 ,
            mapSize[1] * ol.has.DEVICE_PIXEL_RATIO / 2];

        return {
            minx: center[0] - (w / 2),
            miny: center[1] - (h / 2),
            maxx: center[0] + (w / 2),
            maxy: center[1] + (h / 2)
        };
    }

    function _getMapSize() {
        var mapSize = map.getSize();
        return {
            height: mapSize[1] * ol.has.DEVICE_PIXEL_RATIO,
            width: mapSize[0] * ol.has.DEVICE_PIXEL_RATIO
        };
    }

    function exportMap(callback){
        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;
            callback(canvas, printRectangle);
        });
    }

    function _trigLayersChanged(){
        eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeLayers, {layers: _getGuidsForVisibleLayers()});
    }

    function _getGuidsForVisibleLayers() {
        var visibleLayers = [];
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.getVisible() === true) {
                visibleLayers.push(layers[i]);
            }
        }

        visibleLayers.sort(_compareMapLayerIndex);
        var result = [];
        for(var j = 0; j < visibleLayers.length; j++){
            result.push(visibleLayers[j].guid);
        }
        return result.join(",");
    }

    function _compareMapLayerIndex(a, b) {
        if (a.mapLayerIndex < b.mapLayerIndex){
            return -1;
        }
        if (a.mapLayerIndex > b.mapLayerIndex){
            return 1;
        }
        return 0;
    }

    function activateInfoClick(callback){
        infoKey = map.on('singleclick', function(evt) {
          callback(evt);
        });
    }

    function deactivateInfoClick(){
        map.unByKey(infoKey);
        infoKey = "";
    }

    function getInfoUrl(bwSubLayer, coordinate){
        var view = map.getView();
        var viewResolution = view.getResolution();
        var infoFormat = 'application/json'; // 'text/html';

        var layer = _getLayerFromPool(bwSubLayer);
        var layerSource = layer.getSource();
        var projection = view.getProjection();

        var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': infoFormat, 'feature_count': 10});
        url = decodeURIComponent(url);
        url = url.substring(url.lastIndexOf('?'), url.length);
        url = url.replace('?', '');
        url = encodeURIComponent(url);
        return bwSubLayer.url.replace('proxy/wms', 'proxy/') + url;
    }

    function showHighlightedFeatures(features){
        _ensureHighlightLayer();
        clearHighlightedFeatures();
        var geoJsonParser = new ol.format.GeoJSON();
        for(var i = 0; i < features.length; i++){
            var feature = features[i];
            var mapFeature = geoJsonParser.readFeature(feature.geometryObject);
            mapFeature.getGeometry().transform(ol.proj.get(feature.crs), ol.proj.get(map.getView().getProjection().getCode()));
            highLightLayer.getSource().addFeature(mapFeature);
        }
    }

    function clearHighlightedFeatures(){
        var vectorSource = highLightLayer.getSource();
        vectorSource.clear();
    }

    function _ensureHighlightLayer(){
        if(highLightLayer == null){

            if(highlightStyle == null){
                _setDefaultHighlightStyle();
            }

            var vectorSource = new ol.source.GeoJSON();
            highLightLayer = new ol.layer.Vector({
                source: vectorSource,
                style: highlightStyle
            });
            map.addLayer(highLightLayer);
        }
        else {
            map.removeLayer(highLightLayer);
            map.addLayer(highLightLayer);
        }
    }

    function showInfoMarker(coordinate, element){
        //if(element !== null && element !== undefined){
            var $element = $(element);
            var height = $element.height();
            var width = $element.width();
            var popup = new ol.Overlay({
                element: element,
                stopEvent: false,
                offset: [-width / 2, -height]
            });
            popup.setPosition(coordinate);
            map.addOverlay(popup);
        //}
    }

    function removeInfoMarker(element){
        var overlays = map.getOverlays().getArray();
        for(var i = 0; i < overlays.length; i++){
            var overlay = overlays[i];
            if(overlay.getElement() == element){
                map.removeOverlay(overlay);
            }
        }
    }

    function setHighlightStyle(style){
        highlightStyle = style;
        highLightLayer.setStyle(highlightStyle);
    }

    function _setDefaultHighlightStyle(){
        var defaultStyle = new BW.Map.OL3Map.DefaultStyle();
        highlightStyle = defaultStyle.Styles;
    }

    function parseGetCapabilities(getCapabilitiesXml){
        var parser = new ol.format.WMSCapabilities();
        var result = parser.read(getCapabilitiesXml);
        return result;
    }

    return {
        InitMap: initMap,
        ShowLayer: showLayer,
        ShowBaseLayer: showBaseLayer,
        HideLayer: hideLayer,
        GetLayerByName: getLayerByName,
        RegisterMapCallbacks: registerMapCallbacks,
        ChangeView: changeView,
        SetLayerOpacity: setLayerOpacity,
        SetLayerSaturation: setLayerSaturation,
        SetLayerHue: setLayerHue,
        SetLayerBrightness: setLayerBrightness,
        SetLayerContrast: setLayerContrast,
        MoveLayerToIndex: moveLayerToIndex,
        GetLayerIndex: getLayerIndex,
        RedrawMap: redrawMap,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        GetInfoUrl: getInfoUrl,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        ShowInfoMarker: showInfoMarker,
        SetHighlightStyle: setHighlightStyle,
        RemoveInfoMarker: removeInfoMarker,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        ParseGetCapabilities: parseGetCapabilities
    };
};

BW.Map.OL3Map.RENDERERS = {
    canvas: 'canvas',
    webgl: 'webgl'
};

BW.Map.OL3Map.WmtsSource = function(bwSubLayer){
    var projection = new ol.proj.Projection({
        code: bwSubLayer.coordinate_system,
        extent: bwSubLayer.extent,
        units: bwSubLayer.extentUnits
    });

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(14);
    var matrixIds = new Array(14);
    var numZoomLevels = 18;
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = projection.getCode() + ":" + z;
    }

    return new ol.source.WMTS({
        url: bwSubLayer.url,
        layer: bwSubLayer.name,
        format: bwSubLayer.format,
        projection: projection,
        matrixSet: bwSubLayer.coordinate_system,
        crossOrigin: 'anonymous',
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    });
};

BW.Map.OL3Map.WmsSource = function(bwSubLayer){
    if (bwSubLayer.tiled) {
        return new ol.source.TileWMS({
            params: {
                LAYERS: bwSubLayer.name,
                VERSION: "1.1.1"
            },
            url: bwSubLayer.url,
            format: bwSubLayer.format,
            crossOrigin: 'anonymous',
            transparent: bwSubLayer.transparent
        });
    } else {
        return new ol.source.ImageWMS({
            params: {
                LAYERS: bwSubLayer.name,
                VERSION: "1.1.1"
            },
            url: bwSubLayer.url,
            format: bwSubLayer.format,
            crossOrigin: 'anonymous',
            transparent: bwSubLayer.transparent
        });
    }
};

BW.Map.OL3Map.DefaultStyle = function () {
    var styles = function() {
        var fill = new ol.style.Fill({
            color: 'rgba(255,255,255,0.8)'
        });
        var stroke = new ol.style.Stroke({
            color: '#3399CC',
            width: 2.25
        });
        var styles = [
            new ol.style.Style({
                image: new ol.style.Circle({
                    fill: fill,
                    stroke: stroke,
                    radius: 8
                }),
                fill: fill,
                stroke: stroke
            })
        ];
        return styles;
    };

    return {
        Styles: styles
    };
};

var BW = BW || {};
BW.Utils = BW.Utils || {};

BW.Utils.Guid = function() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    function newGuid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();

    }
    return {
        newGuid: newGuid
    };
};
var BW = BW || {};
BW.Events = BW.Events || {};

BW.Events.EventHandler = function(){
    var callBacks = [];

    function _registerEvent(eventType, callBack){
        callBacks.push({
            eventType: eventType,
            callBack: callBack
        });
    }

    function _triggerEvent(eventType, args){
        for(var i = 0; i < callBacks.length; i++){
            var callBack = callBacks[i];
            if(callBack.eventType == eventType){
                callBack.callBack(args);
            }
        }
    }

    return {
        RegisterEvent: _registerEvent,
        TriggerEvent: _triggerEvent
    };
};

BW.Events.EventTypes = {
    ChangeCenter: "ChangeCenter",
    ChangeResolution: "ChangeResolution",
    ChangeLayers: "ChangeLayers",
    FeatureInfoStart: "FeatureInfoStart",
    FeatureInfoEnd: "FeatureInfoEnd"
};
var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.Layer = function(config){
    var defaults = {
        subLayers: [],
        name: '',
        categoryId: 0,
        visibleOnLoad: true,
        isVisible: false, // Holds current state, will be set to true on factory.Init if VisibleOnLoad = true
        id: new BW.Utils.Guid().newGuid(),
        isBaseLayer: false,
        previewActive: false,
        opacity: 1,
        mapLayerIndex: -1,
        legendGraphicUrls: [],
        selectedLayerOpen: false //todo johben temp
    };
    var layerInstance = $.extend({}, defaults, config); // layerInstance

    var subLayers = [];
    for(var i = 0; i < config.subLayers.length; i++){
        subLayers.push(new BW.MapModel.SubLayer(config.subLayers[i]));
    }

    layerInstance.subLayers = subLayers;

    return layerInstance;
};
var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.Map = function(mapInstance, httpHelper, eventHandler) {

    var layers;
    var config;
    var infoMarker;

    function init(targetId, mapConfig, callback){
        config = mapConfig;
        layers = mapConfig.layers;
        mapInstance.InitMap(targetId, mapConfig, callback);

        _setUpLayerIndex();
        _loadCustomCrs();
        _createDefaultInfoMarker();

        var baseLayers = getBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            if(baseLayer.visibleOnLoad){
                setBaseLayer(baseLayer);
            }
        }

        var overlayLayers = getOverlayLayers();
        for(var j = 0; j < overlayLayers.length; j++){
            var overlayLayer = overlayLayers[j];
            if(overlayLayer.visibleOnLoad){
                showLayer(overlayLayer);
            } else {
                hideLayer(overlayLayer);
            }
        }
    }

    function _loadCustomCrs(){
        var customCrsLoader = new BW.MapModel.CustomCrsLoader();
        customCrsLoader.LoadCustomCrs();
    }

    function _createDefaultInfoMarker(){
        infoMarker = document.createElement("img");
        infoMarker.src= "assets/img/pin-md-orange.png";
        infoMarker.style.visibility = "hidden";
        document.body.appendChild(infoMarker);
    }

    function _setUpLayerIndex(){
        var layerIndex = 0;

        var baseLayers = getBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            for(var j = 0; j < baseLayer.subLayers.length; j++){
                baseLayer.subLayers[j].layerIndex = layerIndex;
                layerIndex++;
            }
        }

        var overlayLayers = getOverlayLayers();
        for(var k = 0; k < overlayLayers.length; k++){
            var overlayLayer = overlayLayers[k];
            for(var l = 0; l < overlayLayer.subLayers.length; l++){
                overlayLayer.subLayers[l].layerIndex = layerIndex;
                layerIndex++;
            }
        }
    }

    function showLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapInstance.HideLayer(bwSubLayer);
            if(_shouldBeVisible(bwSubLayer)){
                mapInstance.ShowLayer(bwSubLayer);
            }
        }

        bwLayer.isVisible = true;
        _recalculateMapLayerIndexes();
    }

    function _showBaseLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapInstance.HideLayer(bwSubLayer);
            if(_shouldBeVisible(bwSubLayer)){
                mapInstance.ShowBaseLayer(bwSubLayer);
            }
        }

        bwLayer.isVisible = true;
        _recalculateMapLayerIndexes();
    }

    function _shouldBeVisible(/*bwSubLayer*/){
        // todo johben: Logic could include zoom levels in case of a layer with both wms and wfs.
        return true;
    }

    function hideLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapInstance.HideLayer(bwSubLayer);
        }

        bwLayer.isVisible = false;
        bwLayer.mapLayerIndex = -1;
        _recalculateMapLayerIndexes();
    }

    function _recalculateMapLayerIndexes(){
        var visibleOverlayLayers = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleOverlayLayers.length; i++){
            var layer = visibleOverlayLayers[i];
            layer.mapLayerIndex = _getMaxLayerIndexForLayer(layer);
        }
    }

    function setLayerOpacity(bwLayer, value) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapInstance.SetLayerOpacity(bwSubLayer, value);
        }
        mapInstance.RedrawMap();
    }

    function setBaseLayer(bwLayer){
        var baseLayers = _getVisibleBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            hideLayer(baseLayer);
        }

        _showBaseLayer(bwLayer);
    }

    function _getLayers() {
        if (config !== undefined) {
            return config.layers;
        }
        return [];
    }

    function getBaseLayers(){
        return _getLayers().filter(function (elem) {
            return elem.isBaseLayer === true;
        });
    }

    function _getVisibleBaseLayers(){
        return getBaseLayers().filter(function (elem) {
            return elem.isVisible === true;
        });
    }

    function getFirstVisibleBaseLayer(){
        return _getVisibleBaseLayers()[0];
    }

    function getOverlayLayers(){
        return _getLayers().filter(function (elem) {
            return elem.isBaseLayer === false;
        });
    }

    function _getVisibleOverlayLayers(){
        return getOverlayLayers().filter(function (elem) {
           return elem.isVisible === true;
        });
    }

    function setStateFromUrlParams(viewPropertyObject){
        // x,y,zoom is set by the map directly
        mapInstance.ChangeView(viewPropertyObject);

        if(viewPropertyObject.layers){
            var layerGuids = viewPropertyObject.layers;
            var guids = layerGuids.split(",");
            guids.forEach(function (guid){
                var layer = getLayerById(guid);
                if (layer) {
                    if(layer.isBaseLayer === true){
                        setBaseLayer(layer);
                    }
                    else{
                        showLayer(layer);
                    }
                }
            });
        }
    }

    function getLayerById(id) {
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if (layer.id === id){
                return layer;
            }
        }
    }

    function moveLayerToIndex(bwLayer, index){
        var subLayers = bwLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(_shouldBeVisible(subLayer)){
                mapInstance.MoveLayerToIndex(subLayer, index);
            }
        }

        _recalculateMapLayerIndexes();
        mapInstance.RedrawMap();
    }

    function moveLayerAbove(bwSourceLayer, bwTargetLayer){
        var targetLayerIndex = _getMaxLayerIndexForLayer(bwTargetLayer);
        var subLayers = bwSourceLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(_shouldBeVisible(subLayer)){
                mapInstance.MoveLayerToIndex(subLayer, targetLayerIndex);
            }
        }
    }

    function exportMap(callback){
        mapInstance.ExportMap(callback);
    }

    function renderSync(){
        return mapInstance.RenderSync();
    }

    function _getMaxLayerIndexForLayer(bwLayer){
        var subLayers = bwLayer.subLayers;
        var indexes = [];
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            var thisIndex = mapInstance.GetLayerIndex(subLayer);
            if(thisIndex != null){
                indexes.push(thisIndex);
            }
        }
        return Math.max(indexes);
    }

    function setLegendGraphics(bwLayer){
        bwLayer.legendGraphicUrls = [];
        for(var i = 0; i < bwLayer.subLayers.length; i++){
            var subLayer = bwLayer.subLayers[i];
            if(bwLayer.isVisible && _shouldBeVisible(subLayer)){
                bwLayer.legendGraphicUrls.push(subLayer.legendGraphicUrl);
            }
        }
    }

    function activateInfoClick(){
        mapInstance.ActivateInfoClick(_handleMapInfoClick);
    }

    function deactivateInfoClick(){
        mapInstance.DeactivateInfoClick();
    }

    function _handleMapInfoClick(mapEvent){
        _showInfoMarker(mapEvent.coordinate);

        var layersToRequest = _setupLayersToRequest();
        var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);

        eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);

        for(var i = 0; i < layersToRequest.length; i++){
            var subLayer = layersToRequest[i][0];
            switch (subLayer.source){
                case BW.MapModel.SubLayer.SOURCES.wmts:
                case BW.MapModel.SubLayer.SOURCES.wms:
                case BW.MapModel.SubLayer.SOURCES.proxyWms:
                case BW.MapModel.SubLayer.SOURCES.proxyWmts:
                    _sendGetInfoRequest(subLayer, mapEvent.coordinate, layersToRequest[i][1]);
                    break;
                case BW.MapModel.SubLayer.SOURCES.vector:
                    // Use getFeaturesAtCoordinate for vector layer and return feature collection
                    break;
            }
        }
    }

    function _showInfoMarker(coordinate){
        infoMarker.style.visibility = "visible";
        mapInstance.ShowInfoMarker(coordinate, infoMarker);
    }

    function setInfoMarker(element, removeCurrent){
        if(removeCurrent === true){
            mapInstance.RemoveInfoMarker(infoMarker);
        }
        infoMarker = element;
    }

    function _sendGetInfoRequest(subLayer, coordinate, name){
        //var proxyUrlForTest = "http://cors-anywhere.herokuapp.com/";

        var callback = function(data){
            var parsedResult;
            var exception;
            try {
                parsedResult = subLayer.parser.Parse(data);
            }
            catch(e){
                exception = e;
            }
            var responseFeatureCollection = new BW.FeatureParser.LayerResponse();
            responseFeatureCollection.name = name;
            responseFeatureCollection.id = subLayer.id;
            responseFeatureCollection.isLoading = false;
            responseFeatureCollection.features = parsedResult;
            responseFeatureCollection.exception = exception;

            eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoEnd, responseFeatureCollection);
        };

        var infoUrl = mapInstance.GetInfoUrl(subLayer, coordinate);
        httpHelper.get(infoUrl).success(callback);
    }

    function _createResponseFeatureCollections(layersToRequest){
        var responseFeatureCollections = [];
        for(var i = 0; i < layersToRequest.length; i++){
            var layerToRequest = layersToRequest[i];
            var responseFeatureCollection = new BW.FeatureParser.LayerResponse();
            responseFeatureCollection.name = layerToRequest[1];
            responseFeatureCollection.id = layerToRequest[0].id;
            responseFeatureCollection.isLoading = true;
            responseFeatureCollections.push(responseFeatureCollection);
        }
        return responseFeatureCollections;
    }

    function _setupLayersToRequest(){
        var layersToRequest = [];
        var visibleBwLayers = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleBwLayers.length; i++){
            var visibleBwLayer = visibleBwLayers[i];
            var subLayers = visibleBwLayer.subLayers;
            for(var j =0; j < subLayers.length; j++){
                var subLayer = subLayers[j];
                if(subLayer.isQueryable && _shouldBeVisible(subLayer)){
                    layersToRequest.push([subLayer, visibleBwLayer.name]);
                }
            }
        }
        return layersToRequest;
    }

    function showHighlightedFeatures(features){
        mapInstance.ShowHighlightedFeatures(features);
    }

    function clearHighlightedFeatures(){
        mapInstance.ClearHighlightedFeatures();
    }

    function setHighlightStyle(style) {
        mapInstance.SetHighlightStyle(style);
    }

    function activateExport(options) {
        mapInstance.ActivateExport(options);
    }

    function deactivateExport() {
        mapInstance.DeactivateExport();
    }

    function getSupportedGetFeatureInfoFormats(bwSubLayer){
        var callback = function(data){
            var jsonCapabilities = mapInstance.ParseGetCapabilities(data);
            var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
            console.log(formats);
        };

        var wmsUrl = bwSubLayer.url;
        var getCapabilitiesUrl;
        var questionMark = '?';
        var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
        if(!urlHasQuestionMark){
            wmsUrl = wmsUrl + encodeURIComponent(questionMark);
        }

        getCapabilitiesUrl = wmsUrl + encodeURIComponent('SERVICE=WMS&REQUEST=GETCAPABILITIES');
        httpHelper.get(getCapabilitiesUrl).success(callback);
    }

    return {
        Init: init,
        ShowLayer: showLayer,
        HideLayer: hideLayer,
        GetOverlayLayers: getOverlayLayers,
        GetBaseLayers: getBaseLayers,
        GetLayerById: getLayerById,
        GetFirstVisibleBaseLayer: getFirstVisibleBaseLayer,
        SetBaseLayer: setBaseLayer,
        SetStateFromUrlParams: setStateFromUrlParams,
        SetLayerOpacity: setLayerOpacity,
        MoveLayerToIndex: moveLayerToIndex,
        MoveLayerAbove: moveLayerAbove,
        SetLegendGraphics: setLegendGraphics,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        SetInfoMarker: setInfoMarker,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats
    };
};

var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.SubLayer = function(config){
    var defaults = {
        name: '',
        source: BW.MapModel.SubLayer.SOURCES.wmts,
        url: '',
        format: BW.MapModel.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: new BW.Utils.Guid().newGuid(),
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        isQueryable: true,
        parser: new BW.FeatureParser.ResultParser(),
        supportedInfoFormats: []
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    var legendGraphic = new BW.MapModel.LegendGraphic({ url: instance.url, layer: instance.name });
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();

    return instance;
};

BW.MapModel.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms"
};

BW.MapModel.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg"
};
var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.LegendGraphic = function(config){
    var defaults = {
        width : "20",
        height : "20",
        format : "image/png",
        request : "GetLegendGraphic",
        version : "1.0.0",
        layer : '',
        url : ''
    };

    var instance =  $.extend({}, defaults, config);

    function getLegendGraphicUrl (){
        return instance.url + "&Request=" + instance.request + "&Version=" + instance.version + "&Format=" + instance.format + "&Width=" + instance.width + "&Height=" + instance.height + "&Layer=" + instance.layer;
    }

    return {
        GetLegendGraphicUrl: getLegendGraphicUrl
    };
};
var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.CustomCrsLoader = function(){
    function loadCustomCrs(){
        // proj4 is on the global scope

        if (window.proj4) {
            proj4.defs("EPSG:32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        }
    }

    return {
        LoadCustomCrs: loadCustomCrs
    };
};

var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.ConfigRepository = function (configFacade) {

    var config;

    function _createConfig(config) {
        var result = {
            numZoomLevels: 18,
            newMaxRes: 21664.0,
            center: [-20617, 7661666],
            zoom:  4,
            extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
            layers: [],
            proxyHost: "https://www.barentswatch.no/proxy?url=",
            tools: []
        };
        $.extend(result, config);

        var layers = [];
        for(var i = 0; i < config.layers.length; i++){
            layers.push(new BW.MapModel.Layer(config.layers[i]));
        }

        result.layers = layers;

        return result;
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
var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.MapConfig = function(config){
    var defaults = {
        numZoomLevels: 10,
        newMaxRes: 20000,
        renderer: BW.Map.OL3Map.RENDERERS.canvas,
        center: [-1, 1],
        zoom: 5,
        layers:[],
        coordinate_system: "EPSG:32633",
        extent: [-1, -1, -1, -1],
        extentunits: 'm',
        proxyHost: ""
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};
var BW = BW || {};
BW.FeatureParser = BW.FeatureParser || {};

BW.FeatureParser.ResultParser = function() {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";

        if(result.type){
            if(result.type == "FeatureCollection"){
                return parseAsJson(result);
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            return parseAsXml(result);
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else{
            return null; // Should be empty collection
        }
    }

    function parseAsException(exception){
        var exceptionParser = new BW.FeatureParser.Exception();
        exceptionParser.Parse(exception);
    }

    function parseAsHtml(result){
        var indexOfTableStart = result.indexOf("<table");
        if(indexOfTableStart > -1){
            var tableResult = result.substring(indexOfTableStart, result.length);
            var indexOfTableEnd = tableResult.indexOf("</body>");
            tableResult = tableResult.substring(0, indexOfTableEnd);
            console.log(tableResult);
            var jsonObject = xml2json.parser(tableResult);
            console.log(jsonObject);
            /*var jqTable = $(tableResult);
             var trs = jqTable.find('tr');
             var tds = jqTable.find('td');*/
        }
        return [];
    }

    function parseAsJson(result){
        var jsonParser = new BW.FeatureParser.GeoJSON();
        return jsonParser.Parse(result);
    }

    function parseAsXml(result){
        var xmlParser = new BW.FeatureParser.KartKlifNo();
        return xmlParser.Parse(result);
    }

    return {
        Parse: parse
    };
};
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
