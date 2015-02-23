/**
 * maplib - v0.0.1 - 2015-02-23
 * http://localhost
 *
 * Copyright (c) 2015 
 */
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.Category = function(config){
    var defaults = {
        catId: -1,
        name: '',
        isOpen: false,
        parentId: -1,
        subCategories: [],
        bwLayers: [],
        isAllLayersSelected: false

    };
    var categoryInstance = $.extend({}, defaults, config); // categoryInstance

    var subCategories = [];
    for(var i = 0; i < config.subCategories.length; i++){
        subCategories.push(new BW.Domain.Category(config.subCategories[i]));
    }

    categoryInstance.subCategories = subCategories;

    return categoryInstance;
};
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.FeatureInfo = function(config){
    var defaults = {
        // single select via WMS GetFeatureInfo
        supportsGetFeatureInfo: true,
        getFeatureInfoFormat: 'application/json',
        getFeatureInfoCrs: '',

        // multi select via WFS GetFeature
        supportsGetFeature: true,
        getFeatureBaseUrl: '',
        getFeatureFormat: 'application/json',
        getFeatureCrs: 'EPSG:4326'
    };
    var instance =  $.extend({}, defaults, config);

    return instance;
};
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.FeatureResponse = function() {
    return {
        geometryObject: '',
        crs: '',
        attributes: []
    };
};
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.Layer = function(config){
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
        subLayers.push(new BW.Domain.SubLayer(config.subLayers[i]));
    }

    layerInstance.subLayers = subLayers;

    return layerInstance;
};
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.LayerResponse = function(){
    return{
        id: -1,
        isLoading: false,
        exception: '',
        features: []
    };
};
var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.LegendGraphic = function(config){
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
BW.Domain = BW.Domain || {};

BW.Domain.MeasureResult = function(polygonArea, edgeLength, circleArea){
    var pa = polygonArea;
    var el = edgeLength;
    var ca = circleArea;

    function getPolygonArea(){
        return pa;
    }

    function getEdgeLength(){
        return el;
    }

    function getCircleArea(){
        return ca;
    }

    function getParsedResult(){
        return 'Polygon area: ' + getPolygonArea() + ' Length: ' + getEdgeLength() + ' Circle area: ' + getCircleArea();
    }

    return {
        PolygonArea: getPolygonArea,
        EdgeLength: getEdgeLength,
        CircleArea: getCircleArea,
        GetParsedResult: getParsedResult
    };
};

var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.SubLayer = function(config){
    var defaults = {
        name: '',
        providerName: '',   //f.eks Fiskeridirektoratet
        source: BW.Domain.SubLayer.SOURCES.wmts,
        url: '',
        format: BW.Domain.SubLayer.FORMATS.imagepng,
        coordinate_system: '',
        maxResolution: '',
        matrixSet: '',
        extent: [-1, 1, -1, 1],
        extentUnits: 'm',
        id: new BW.Utils.Guid().newGuid(),
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        crossOrigin: 'anonymous',
        featureInfo: new BW.Domain.FeatureInfo()
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    if(instance.url.indexOf('?') == -1){
        instance.url += '?';
    }

    var legendGraphic = new BW.Domain.LegendGraphic({ url: instance.url, layer: instance.name });
    instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();

    return instance;
};

BW.Domain.SubLayer.SOURCES = {
    wmts: "WMTS",
    wms: "WMS",
    vector: "VECTOR",
    proxyWmts: "proxyWmts",
    proxyWms: "proxyWms"
};

BW.Domain.SubLayer.FORMATS = {
    imagepng: "image/png",
    imagejpeg: "image/jpeg",
    geoJson: "application/json"
};

var BW = BW || {};
BW.Events = BW.Events || {};

BW.Events.EventHandler = function(){
    var callBacks = [];

    function registerEvent(eventType, callBack){
        callBacks.push({
            eventType: eventType,
            callBack: callBack
        });
    }

    function triggerEvent(eventType, args){
        for(var i = 0; i < callBacks.length; i++){
            var callBack = callBacks[i];
            if(callBack.eventType == eventType){
                callBack.callBack(args);
            }
        }
    }

    return {
        RegisterEvent: registerEvent,
        TriggerEvent: triggerEvent
    };
};

BW.Events.EventTypes = {
    ChangeCenter: "ChangeCenter",
    ChangeResolution: "ChangeResolution",
    ChangeLayers: "ChangeLayers",
    FeatureInfoStart: "FeatureInfoStart",
    FeatureInfoEnd: "FeatureInfoEnd",
    MapConfigLoaded: "MapConfigLoaded",
    MapLoaded: "MapLoaded",
    ShowExportPanel: "ShowExportPanel",
    MeasureMouseMove: "MeasureMouseMove"
};
var BW = BW || {};
BW.Facade = BW.Facade || {};

BW.Facade.ServerConfigFacade = function () {

    function getMapConfig(url, callback) {

        $.getJSON(url, function (data) {
            callback(data);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.Categories = function(){
    var categories = [];

    function init(mapConfig) {
        categories = mapConfig.categories;
    }

    function getCategories() {
        return categories;
    }

    function getCategoryById(catId) {
        for(var i = 0; i < categories.length; i++){
            var cat = categories[i];
            if (cat.catId.toString() === catId.toString()){
                return cat;
            }
            for (var j = 0; j < categories[i].subCategories.length; j++) {
                var subcat = categories[i].subCategories[j];
                if (subcat.catId.toString() === catId.toString()){
                    return subcat;
                }
            }
        }
    }

    return {
        Init: init,
        GetCategoryById: getCategoryById,
        GetCategories: getCategories
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.CustomCrsLoader = function(){
    function loadCustomCrs(){
        // proj4 is on the global scope
        proj4.defs("EPSG:32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        proj4.defs("EPSG:3575",  '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
    }

    return {
        LoadCustomCrs: loadCustomCrs
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Map = BW.MapAPI.Map || {};

BW.MapAPI.FeatureInfo = function(mapImplementation, httpHelper, eventHandler, featureParser){

    /*
        The reference to document in this class is necessary due to offset.
        When the marker is placed onto the map for the first time offset does not work unless the image is already present in the DOM.
        A possible fix to this is to not use an image and instead use an icon.

     */

    var infoMarker;
    var infoMarkerPath = "assets/img/pin-md-orange.png"; // This path is possible to change by API call.
    var useInfoMarker = false;
    var pixelTolerance = 5;

    /*
        Common feature info functions
     */

    function _trigStartGetInfoRequest(layersToRequest){
        var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);
        eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);
    }

    function _createResponseFeatureCollections(layersToRequest){
        var responseFeatureCollections = [];
        for(var i = 0; i < layersToRequest.length; i++){
            var layerToRequest = layersToRequest[i];
            var responseFeatureCollection = new BW.Domain.LayerResponse();
            responseFeatureCollection.id = layerToRequest.id;
            responseFeatureCollection.isLoading = true;
            responseFeatureCollections.push(responseFeatureCollection);
        }
        return responseFeatureCollections;
    }

    function _handleGetInfoRequest(url, subLayer){
        var callback = function(data){
            _handleGetInfoResponse(subLayer, data);
        };
        httpHelper.get(url).success(callback);
    }

    function _handleGetInfoResponse(subLayer, result){
        var parsedResult;
        var exception;
        try {
            parsedResult = featureParser.Parse(result);
        }
        catch(e){
            exception = e;
        }
        var responseFeatureCollection = new BW.Domain.LayerResponse();
        responseFeatureCollection.id = subLayer.id;
        responseFeatureCollection.isLoading = false;
        responseFeatureCollection.features = parsedResult;
        responseFeatureCollection.exception = exception;

        eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoEnd, responseFeatureCollection);
    }

    function _getSupportedFormatsForService(bwSubLayer, service, callback){
        var parseCallback = function(data){
            var jsonCapabilities = parseGetCapabilities(data);
            callback(jsonCapabilities);
        };

        var wmsUrl = bwSubLayer.url;
        var getCapabilitiesUrl;
        var questionMark = '?';
        var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
        if(!urlHasQuestionMark){
            wmsUrl = wmsUrl + encodeURIComponent(questionMark);
        }

        var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
        if(bwSubLayer.source === BW.Domain.SubLayer.SOURCES.proxyWms || bwSubLayer.source == BW.Domain.SubLayer.SOURCES.proxyWmts){
            request = encodeURIComponent(request);
        }
        getCapabilitiesUrl = wmsUrl + request;
        httpHelper.get(getCapabilitiesUrl).success(parseCallback);
    }

    function parseGetCapabilities(getCapabilitiesXml){
        var parser = new ol.format.WMSCapabilities();
        return parser.read(getCapabilitiesXml);
    }

    /*
        Get Feature Info function
     */

    function handlePointSelect(coordinate, layersSupportingGetFeatureInfo){
        if(useInfoMarker === true){
            _showInfoMarker(coordinate);
        }

        _trigStartGetInfoRequest(layersSupportingGetFeatureInfo);

        for(var i = 0; i < layersSupportingGetFeatureInfo.length; i++){
            var subLayer = layersSupportingGetFeatureInfo[i];
            switch (subLayer.source){
                case BW.Domain.SubLayer.SOURCES.wmts:
                case BW.Domain.SubLayer.SOURCES.wms:
                case BW.Domain.SubLayer.SOURCES.proxyWms:
                case BW.Domain.SubLayer.SOURCES.proxyWmts:
                    _sendGetFeatureInfoRequest(subLayer, coordinate);
                    break;
                case BW.Domain.SubLayer.SOURCES.vector:
                    var features = mapImplementation.GetFeaturesInExtent(subLayer, mapImplementation.GetExtentForCoordinate(coordinate, pixelTolerance));
                    _handleGetInfoResponse(subLayer, features);
                    break;
            }
        }
    }

    function _sendGetFeatureInfoRequest(subLayer, coordinate){
        var infoUrl = mapImplementation.GetInfoUrl(subLayer, coordinate);
        _handleGetInfoRequest(infoUrl, subLayer);
    }

    function getSupportedGetFeatureInfoFormats(bwSubLayer, callback){
        var service = 'WMS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(bwSubLayer, service, getFormatCallback);
    }

    /*
        Get Feature functions
     */

    function handleBoxSelect(boxExtent, layersSupportingGetFeature){
        _trigStartGetInfoRequest(layersSupportingGetFeature);

        for(var i = 0; i < layersSupportingGetFeature.length; i++){
            var subLayer = layersSupportingGetFeature[i];
            switch (subLayer.source){
                case BW.Domain.SubLayer.SOURCES.wmts:
                case BW.Domain.SubLayer.SOURCES.wms:
                case BW.Domain.SubLayer.SOURCES.proxyWms:
                case BW.Domain.SubLayer.SOURCES.proxyWmts:
                    _sendBoxSelectRequest(subLayer, boxExtent);
                    break;
                case BW.Domain.SubLayer.SOURCES.vector:
                    var features = mapImplementation.GetFeaturesInExtent(subLayer, boxExtent);
                    _handleGetInfoResponse(subLayer, features);
                    break;
            }
        }
    }

    function _sendBoxSelectRequest(bwSubLayer, boxExtent){
        var infoUrl = _getFeatureUrl(bwSubLayer, boxExtent);
        _handleGetInfoRequest(infoUrl, bwSubLayer);
    }

    function _getFeatureUrl(bwSubLayer, boxExtent){
        var crs = bwSubLayer.featureInfo.getFeatureCrs;
        var adaptedExtent = mapImplementation.TransformBox(bwSubLayer.coordinate_system, bwSubLayer.featureInfo.getFeatureCrs, boxExtent);

        var url = "service=WFS&request=GetFeature&typeName=" + bwSubLayer.name + "&srsName=" + crs + "&outputFormat=" + bwSubLayer.featureInfo.getFeatureFormat + "&bbox=" + adaptedExtent;
        url = decodeURIComponent(url);
        url = url.substring(url.lastIndexOf('?'), url.length);
        url = url.replace('?', '');
        return bwSubLayer.url + url;
    }

    function getSupportedGetFeatureFormats(bwSubLayer, callback){
        //TODO: Handle namespace behaviour, when colon is present the parser fails....Meanwhile, do not use
        var service = 'WFS';
        var getFormatCallback = function(jsonCapabilities){
            var formats = jsonCapabilities.Capability.Request.GetFeature.Format;
            callback(formats);
        };
        _getSupportedFormatsForService(bwSubLayer, service, getFormatCallback);
    }

    /*
        Marker functions for Get Feature info click
     */

    function createDefaultInfoMarker(){
        infoMarker = document.createElement("img");
        infoMarker.src= infoMarkerPath;
        _hideInfoMarker();
        _addInfoMarker();
    }

    function _showInfoMarker(coordinate){
        setInfoMarker(infoMarker, true);
        infoMarker.style.visibility = "visible";
        mapImplementation.ShowInfoMarker(coordinate, infoMarker);
    }

    function setInfoMarker(element, removeCurrent){
        if(useInfoMarker === true) {
            if (removeCurrent === true) {
                mapImplementation.RemoveInfoMarker(infoMarker);
                _hideInfoMarker();
            }
            infoMarker = element;
            _addInfoMarker();
        }
    }
    function _addInfoMarker(){
        document.body.appendChild(infoMarker);
        useInfoMarker = true;
    }

    function removeInfoMarker(){
        setInfoMarker(infoMarker, true);
    }

    function _hideInfoMarker(){
        infoMarker.style.visibility = "hidden";
    }

    function setInfoMarkerPath(path){
        infoMarkerPath = path;
    }

    return {
        HandlePointSelect: handlePointSelect,
        HandleBoxSelect: handleBoxSelect,
        CreateDefaultInfoMarker: createDefaultInfoMarker,
        SetInfoMarker: setInfoMarker,
        RemoveInfoMarker: removeInfoMarker,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
        GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
        SetInfoMarkerPath: setInfoMarkerPath
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.Layers = function(mapImplementation){
    var config;
    var layers;

    function init(mapConfig){
        config = mapConfig;
        layers = mapConfig.layers;

        _setUpLayerIndex();

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

    function getOverlayLayers(){
        return _getLayers().filter(function (elem) {
            return elem.isBaseLayer === false;
        });
    }

    function setBaseLayer(bwLayer){
        var baseLayers = getVisibleBaseLayers();
        for(var i = 0; i < baseLayers.length; i++){
            var baseLayer = baseLayers[i];
            hideLayer(baseLayer);
        }

        _showBaseLayer(bwLayer);
    }

    function showLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapImplementation.HideLayer(bwSubLayer);
            if(shouldBeVisible(bwSubLayer)){
                mapImplementation.ShowLayer(bwSubLayer);
            }
        }

        bwLayer.isVisible = true;
        _recalculateMapLayerIndexes();
    }

    function hideLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapImplementation.HideLayer(bwSubLayer);
        }

        bwLayer.isVisible = false;
        bwLayer.mapLayerIndex = -1;
        _recalculateMapLayerIndexes();
    }

    function getVisibleSubLayers(){
        var subLayersOnly = [];
        var visibleOverlays = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleOverlays.length; i++){
            var bwLayer = visibleOverlays[i];
            for(var j = 0; j < bwLayer.subLayers.length; j++){
                var subLayer = bwLayer.subLayers[j];
                if(shouldBeVisible(subLayer)){
                    subLayersOnly.push(subLayer);
                }
            }
        }
        return subLayersOnly;
    }

    function getVisibleBaseLayers(){
        return getBaseLayers().filter(function (elem) {
            return elem.isVisible === true;
        });
    }

    function getLayerById(id) {
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if (layer.id.toString() === id.toString()){
                return layer;
            }
        }
    }

    function moveLayerToIndex(bwLayer, index){
        var subLayers = bwLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(shouldBeVisible(subLayer)){
                mapImplementation.MoveLayerToIndex(subLayer, index);
            }
        }

        _recalculateMapLayerIndexes();
        mapImplementation.RedrawMap();
    }

    function moveLayerAbove(bwSourceLayer, bwTargetLayer){
        var targetLayerIndex = _getMaxLayerIndexForLayer(bwTargetLayer);
        var subLayers = bwSourceLayer.subLayers;
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            if(shouldBeVisible(subLayer)){
                mapImplementation.MoveLayerToIndex(subLayer, targetLayerIndex);
            }
        }
    }

    function _showBaseLayer(bwLayer) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapImplementation.HideLayer(bwSubLayer);
            if(shouldBeVisible(bwSubLayer)){
                mapImplementation.ShowBaseLayer(bwSubLayer);
            }
        }

        bwLayer.isVisible = true;
        _recalculateMapLayerIndexes();
    }

    function _recalculateMapLayerIndexes(){
        var visibleOverlayLayers = _getVisibleOverlayLayers();
        for(var i = 0; i < visibleOverlayLayers.length; i++){
            var layer = visibleOverlayLayers[i];
            layer.mapLayerIndex = _getMaxLayerIndexForLayer(layer);
        }
    }

    function _getVisibleOverlayLayers(){
        return getOverlayLayers().filter(function (elem) {
            return elem.isVisible === true;
        });
    }

    function shouldBeVisible(/*bwSubLayer*/){
        // todo johben: Logic could include zoom levels in case of a layer with both wms and wfs.
        // I.E.
        // var currentZoomLevel = mapImplementation.getCurrentZoomLevel();
        // return subLayer.StartZoomLevel < currentZoomLevel && subLayer.EndZoomLevel > currentZoomLevel
        return true;
    }

    function _getMaxLayerIndexForLayer(bwLayer){
        var subLayers = bwLayer.subLayers;
        var indexes = [];
        for(var i = 0; i < subLayers.length; i++){
            var subLayer = subLayers[i];
            var thisIndex = mapImplementation.GetLayerIndex(subLayer);
            if(thisIndex != null){
                indexes.push(thisIndex);
            }
        }
        return Math.max(indexes);
    }

    return {
        Init: init,
        GetBaseLayers: getBaseLayers,
        GetOverlayLayers: getOverlayLayers,
        SetBaseLayer: setBaseLayer,
        HideLayer: hideLayer,
        ShowLayer: showLayer,
        GetVisibleSubLayers: getVisibleSubLayers,
        GetVisibleBaseLayers: getVisibleBaseLayers,
        GetLayerById: getLayerById,
        MoveLayerToIndex: moveLayerToIndex,
        MoveLayerAbove: moveLayerAbove,
        ShouldBeVisible: shouldBeVisible
    };

};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.Map = function(mapImplementation, eventHandler, featureInfo, layerHandler, categoryHandler) {

    /*
        Start up functions Start
     */

    function init(targetId, mapConfig){
        mapImplementation.InitMap(targetId, mapConfig);
        layerHandler.Init(mapConfig);
        categoryHandler.Init(mapConfig);

        _loadCustomCrs();

        eventHandler.TriggerEvent(BW.Events.EventTypes.MapLoaded);
    }

    function _loadCustomCrs(){
        var customCrsLoader = new BW.MapAPI.CustomCrsLoader();
        customCrsLoader.LoadCustomCrs();
    }

    /*
        Start up functions End
     */

    /*
        Layer functions Start
     */

    function showLayer(bwLayer) {
        layerHandler.ShowLayer(bwLayer);
    }

    function hideLayer(bwLayer) {
        layerHandler.HideLayer(bwLayer);
    }

    function setLayerOpacity(bwLayer, value) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapImplementation.SetLayerOpacity(bwSubLayer, value);
        }
        mapImplementation.RedrawMap();
    }

    function setBaseLayer(bwLayer){
        layerHandler.SetBaseLayer(bwLayer);
    }

    function getBaseLayers(){
        return layerHandler.GetBaseLayers();
    }

    function getFirstVisibleBaseLayer(){
        return layerHandler.GetVisibleBaseLayers()[0];
    }

    function getOverlayLayers(){
        return layerHandler.GetOverlayLayers();
    }

    function _getVisibleSubLayers(){
        return layerHandler.GetVisibleSubLayers();
    }

    function getLayerById(id) {
        return layerHandler.GetLayerById(id);
    }

    function moveLayerToIndex(bwLayer, index){
        layerHandler.MoveLayerToIndex(bwLayer, index);
    }

    function moveLayerAbove(bwSourceLayer, bwTargetLayer){
        layerHandler.MoveLayerAbove(bwSourceLayer, bwTargetLayer);
    }

    function _shouldBeVisible(subLayer){
        return layerHandler.ShouldBeVisible(subLayer);
    }

    /*
        Layer functions End
     */

    /*
     Categories functions Start
     */

    function getCategoryById(id) {
        return categoryHandler.GetCategoryById(id);
    }

    function getCategories() {
        return categoryHandler.GetCategories();
    }

    /*
     Categories functions End
     */

    /*
        Export functions Start
     */

    function exportMap(callback){
        mapImplementation.ExportMap(callback);
    }

    function activateExport(options) {
        mapImplementation.ActivateExport(options);
    }

    function deactivateExport() {
        mapImplementation.DeactivateExport();
    }

    function renderSync(){
        return mapImplementation.RenderSync();
    }

    /*
        Export functions End
     */

    /*
        Feature Info Start
     */

    function setImageInfoMarker(path){
        featureInfo.SetInfoMarkerPath(path);
        featureInfo.CreateDefaultInfoMarker();
    }

    function setInfoMarker(element, removeCurrent){
        featureInfo.SetInfoMarker(element, removeCurrent);
    }

    function removeInfoMarker(){
        featureInfo.RemoveInfoMarker();
    }

    function showHighlightedFeatures(features){
        mapImplementation.ShowHighlightedFeatures(features);
    }

    function clearHighlightedFeatures(){
        mapImplementation.ClearHighlightedFeatures();
    }

    function setHighlightStyle(style) {
        mapImplementation.SetHighlightStyle(style);
    }

    function activateInfoClick(){
        mapImplementation.ActivateInfoClick(_handlePointSelect);
    }

    function deactivateInfoClick(){
        mapImplementation.DeactivateInfoClick();
    }

    function activateBoxSelect(){
        mapImplementation.ActivateBoxSelect(_handleBoxSelect);
    }

    function deactivateBoxSelect(){
        mapImplementation.DeactivateBoxSelect();
    }

    function getSupportedGetFeatureInfoFormats(bwSubLayer, callback){
        featureInfo.GetSupportedGetFeatureInfoFormats(bwSubLayer, callback);
    }

    function getSupportedGetFeatureFormats(bwSubLayer, callback){
        featureInfo.GetSupportedGetFeatureFormats(bwSubLayer, callback);
    }

    function convertGmlToGeoJson(gml){
        return mapImplementation.ConvertGmlToGeoJson(gml);
    }

    function _handlePointSelect(coordinate){
        featureInfo.HandlePointSelect(coordinate, _getLayersSupportingGetFeatureInfo());
    }

    function _getLayersSupportingGetFeatureInfo(){
        var visibleSubLayers = _getVisibleSubLayers();
        return visibleSubLayers.filter(function(subLayer){
            return subLayer.featureInfo.supportsGetFeatureInfo === true;
        });
    }

    function _handleBoxSelect(boxExtent){
        featureInfo.HandleBoxSelect(boxExtent, _getLayersSupportingGetFeature());
    }

    function _getLayersSupportingGetFeature(){
        var visibleSubLayers = _getVisibleSubLayers();
        return visibleSubLayers.filter(function(subLayer){
            return subLayer.featureInfo.supportsGetFeature === true;
        });
    }

    /*
        Feature Info End
     */

    /*
        Measure Start
     */

    function activateMeasure(){
        mapImplementation.ActivateMeasure();
    }

    function deactivateMeasure(){
        mapImplementation.DeactivateMeasure();
    }

    /*
        Measure End
     */

    /*
        Utility functions Start
     */

    function extentToGeoJson(x, y){
        mapImplementation.ExtentToGeoJson(x, y);
    }

    function setStateFromUrlParams(viewPropertyObject){
        mapImplementation.ChangeView(viewPropertyObject);

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

    function setLegendGraphics(bwLayer){
        bwLayer.legendGraphicUrls = [];
        for(var i = 0; i < bwLayer.subLayers.length; i++){
            var subLayer = bwLayer.subLayers[i];
            if(bwLayer.isVisible && _shouldBeVisible(subLayer)){
                bwLayer.legendGraphicUrls.push(subLayer.legendGraphicUrl);
            }
        }
    }

    function addZoom() {
        mapImplementation.AddZoom();
    }

    function addZoomSlider() {
        mapImplementation.AddZoomSlider();
    }

    /*function addVectorTestData(){
        var callback = function(data){
            showHighlightedFeatures(featureParser.Parse(data));
        };
        var url = 'assets/mapConfig/testdata.json';
        httpHelper.get(url).success(callback);
    }*/

    /*
        Utility functions End
     */

    return {
        // Start up start
        Init: init,
        // Start up end

        /***********************************/

        // Layer start
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
        // Layer end

        /***********************************/

        // Category start
        GetCategoryById: getCategoryById,
        GetCategories: getCategories,
        // Category end

        /***********************************/

        // Export start
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        SetInfoMarker: setInfoMarker,
        SetImageInfoMarker: setImageInfoMarker,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
        GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
        RemoveInfoMarker: removeInfoMarker,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        // Feature Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Utility start
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        SetLegendGraphics: setLegendGraphics,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider
        //AddVectorTestData: addVectorTestData
        // Utility end
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Base = function(factory) {
    function parse(result){
        var exception = "exception";
        var xml = "<?xml";
        var html = "<html";
        var msGMLOutput = "msgmloutput";

        var parserName;

        if(result.type){
            if(result.type == "FeatureCollection"){
                parserName = 'geoJson';
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            parserName = 'kartKlifNo';
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else if(result.toLowerCase().indexOf(msGMLOutput) > -1){
            parserName = 'fisheryDirectory';
        }
        else{
            return null; // Should be empty collection
        }

        var parser = factory.CreateParser(parserName);
        return parser.Parse(result);
    }

    function parseAsException(exception){
        var exceptionParser = new BW.MapAPI.Parsers.Exception();
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
        }
        return [];
    }

    return {
        Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Exception = function() {
    function parse(exception){
        var message = exception.replace(/(<([^>]+)>)/ig, '');
        throw message;
    }

    return {
        Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Factory = function(geoJson, gml, kartKlifNo, fiskeriDir){
    function createParser(parserName){
        var parser;
        switch (parserName){
            case 'geoJson':
                parser = geoJson;
                break;
            case 'gml':
                parser = gml;
                break;
            case 'kartKlifNo':
                parser = kartKlifNo;
                break;
            case 'fisheryDirectory':
                parser = fiskeriDir;
                break;
        }
        return parser;
    }

    return {
        CreateParser: createParser
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.FiskeriDir = function(mapApi){
    var insteadOfGml = 'insteadofgml';
    var x, y;
    var gmlObject;

    function parse (result){
        var responseFeatureCollection = [];

        result = result.replace(/:gml/g, '');
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        var jsonFeatures = xml2json.parser(result);

        var rootObject = jsonFeatures[Object.keys(jsonFeatures)[0]];
        for(var i in rootObject){
            var testObject = rootObject[i];
            if(testObject instanceof Object){
                for(var j in testObject){
                    var testArray = testObject[j];
                    if(testArray instanceof Array){
                        responseFeatureCollection = _arrayToResponseFeatureCollection(testArray);
                    }
                }
            }
        }
        return responseFeatureCollection;
    }

    function _arrayToResponseFeatureCollection(resultArray){
        var result = [];
        for(var i = 0; i < resultArray.length; i++){
            var feature = resultArray[i];

            var responseFeature = new BW.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(feature);
            var crs = gmlObject[Object.keys(gmlObject)[0]]["srsname"];
            var extent = gmlObject[Object.keys(gmlObject)[0]][insteadOfGml + "coordinates"];
            extent = extent.replace(/ /g, ',');

            responseFeature.crs = crs;
            responseFeature.geometryObject = mapApi.ExtentToGeoJson(x, y);

            result.push(responseFeature);
        }
        return result;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            if(i.toLocaleLowerCase().indexOf(insteadOfGml) === -1){
                attributes.push([i, properties[i]]);
                if(i == 'x') { x = properties[i]; }
                if(i == 'y') { y = properties[i]; }
            }
            else {
                gmlObject = properties[i];
            }
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GML = function() {
    function parse(result) {
        console.log(result);
    }

    return {
        Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];

        var crs;
        if(result.crs){
            var crsObject = result.crs;
            if(crsObject.properties.code){
                crs = crsObject.type + ':' + crsObject.properties.code;
            }
            else if(crsObject.properties.name){
                // pattern name=urn:ogc:def:crs:EPSG::32633
                crs = crsObject.properties.name.substring(crsObject.properties.name.indexOf('EPSG'), crsObject.properties.name.length);
            }
        }

        var features = result.features;
        for(var i = 0; i < features.length; i++){
            var feature = features[i];

            var responseFeature = new BW.Domain.FeatureResponse();
            responseFeature.crs = crs;
            responseFeature.geometryObject = feature;
            responseFeature.attributes = _getAttributesArray(feature.properties);

            responseFeatureCollection.push(responseFeature);
        }

        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
        Parse: parse
    };
};

// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.KartKlifNo = function() {
    function parse(result) {
        var jsonResult = [];
        result = result.replace(/:/g, ''); // Remove colon to prevent xml errors
        var jsonFeatures = xml2json.parser(result);

        if(jsonFeatures.featureinforesponse){
            var response = jsonFeatures.featureinforesponse;
            if(response.fields){
                var fields = response.fields;
                if(fields instanceof Array){
                    for(var i = 0; i < fields.length; i++){
                        jsonResult.push(fields[i]);
                    }
                }
                else{
                    jsonResult.push(fields);
                }
            }
        }
        return _convertToFeatureResponse(jsonResult);
    }

    function _convertToFeatureResponse(jsonFeatures){
        var responseFeatureCollection = [];
        for(var i = 0; i < jsonFeatures.length; i++){
            var responseFeature = new BW.Domain.FeatureResponse();
            responseFeature.attributes = _getAttributesArray(jsonFeatures[i]);
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _getAttributesArray(properties){
        var attributes = [];
        for(var i in properties){
            attributes.push([i, properties[i]]);
        }
        return attributes;
    }

    return {
      Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Tools = BW.MapAPI.Tools || {};

BW.MapAPI.Tools.Tool = function(config){
    var defaults = {
        id: '',
        activate: function(){ console.log('Not implemented');},
        deactivate: function(){ console.log('Not implemented');},
        messageObject: [],
        description : '',
        isCommand: false
    };

    var instance =  $.extend({}, defaults, config);

    instance.Extend = function(properties){
        instance =$.extend(instance, properties);
        return instance;
    };

    return instance;
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Tools = BW.MapAPI.Tools || {};

BW.MapAPI.Tools.ToolFactory = function(tools){
    var internalTools = [];
    var externalTools = [];

    internalTools = tools.GetTools();

    function addTool(tool){
        externalTools.push(tool);
    }

    function getAvailableTools(){
        var toolsId = [];
        for(var i = 0; i < externalTools.length; i++){
            toolsId.push(externalTools[i].id);
        }
        return toolsId;
    }

    function activateTool(toolId){
        var activeToolIsCommand = false;
        for(var i = 0; i < externalTools.length; i++){
            var tool = externalTools[i];
            tool.deactivate();

            if(tool.id == toolId){
                tool.activate();
                activeToolIsCommand = tool.isCommand;
            }
        }
        return activeToolIsCommand;
    }

    function setupTools(toolsConfig){
        for(var i = 0; i < toolsConfig.length; i++){
            var configTool = toolsConfig[i];
            var correspondingInternalTool = _getInternalTool(configTool.id);
            if(correspondingInternalTool){
                externalTools.push(correspondingInternalTool);
            }
        }
    }

    function _getInternalTool(toolId){
        for(var i = 0; i < internalTools.length; i++){
            var internalTool = internalTools[i];
            if(internalTool.id === toolId){
                return internalTool;
            }
        }
        return false;
    }

    /*function deactivateTool(toolId){
     for(var i = 0; i++; i < tools.length){
     var tool = tools[i];

     if(tool.id == toolId){
     tool.deactivate(mapImplementation);
     }
     }
     }*/

    return {
        AddTool: addTool,
        GetAvailableTools: getAvailableTools,
        ActivateTool: activateTool,
        SetupTools: setupTools
        //DeactivateTool: deactivateTool
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Tools = BW.MapAPI.Tools || {};

BW.MapAPI.Tools.Tools = function(mapApi){
    var tools = [];

    var getFeatureInfoConfig = {
        id: 'PointSelect',
        description: 'This tool activates a get feature info click on the map',
        activate: function (){
            mapApi.ActivateInfoClick();
        },
        deactivate: function (){
            mapApi.DeactivateInfoClick();
            mapApi.RemoveInfoMarker();
        },
        messageObject: []
    };
    var getFeatureInfo = new BW.MapAPI.Tools.Tool(getFeatureInfoConfig);
    tools.push(getFeatureInfo);

    var zoomAndPanConfig = {
        id: 'DefaultZoom',
        description: 'This is the default tool',
        activate: function(){

        },
        deactivate: function(){

        },
        messageObject: []
    };
    var zoomAndPan = new BW.MapAPI.Tools.Tool(zoomAndPanConfig);
    tools.push(zoomAndPan);

    var boxSelectConfig = {
        id: 'BoxSelect',
        description: 'This tool activates box select functionality to the map',
        activate: function (){
         mapApi.ActivateBoxSelect();
         },
         deactivate: function (){
         mapApi.DeactivateBoxSelect();
         },
        messageObject: []
    };
    var boxSelect = new BW.MapAPI.Tools.Tool(boxSelectConfig);
    tools.push(boxSelect);

    /*var exportCommandConfig = {
        id: 'MapExport',
        description: 'This command shows the export panel',
        activate: function (){
            eventHandler.TriggerEvent(BW.Events.EventTypes.ShowExportPanel);
        },
        isCommand: true
    };
    var exportCommand = new BW.Tools.Tool(exportCommandConfig);
    tools.push(exportCommand);*/

    var measureConfig = {
        id: 'Measure',
        description: 'This tool lets the user measure in the map',
        activate: function (){
            mapApi.ActivateMeasure();
        },
        deactivate: function (){
            mapApi.DeactivateMeasure();
        },
        messageObject: []
    };
    var measure = new BW.MapAPI.Tools.Tool(measureConfig);
    tools.push(measure);

    function getTools(){
        return tools;
    }

    return {
        GetTools: getTools
    };
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Export = function(){
    var layout = "";
    var mapExportEvents;
    var printRectangle;
    var exportActive = false;

    function activate(options, map, redrawFunction) {
        layout = options.layout;
        exportActive = true;
        printRectangle = _getScreenRectangle(map);
        mapExportEvents = [
            map.on('precompose', _handlePreCompose),
            map.on('postcompose', _handlePostCompose)
        ];
        redrawFunction();
    }

    function deactivate(redrawFunction) {
        exportActive = false;
        if (mapExportEvents) {
            for (var i = 0; i < mapExportEvents.length; i++) {
                mapExportEvents[i].src.unByKey(mapExportEvents[i]);
            }
            redrawFunction();
        }
    }

    function exportMap(callback, map){
        map.once('postcompose', function (event) {
         var canvas = event.context.canvas;
         callback(canvas, printRectangle);
         });
    }

    function windowResized(map){
        if (exportActive){
            printRectangle = _getScreenRectangle(map);
            map.render();
        }
    }

    function _getScreenRectangle(map) {
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

    var _handlePreCompose = function(evt) {
        var ctx = evt.context;
        ctx.save();
    };

    var _handlePostCompose = function(evt) {
        var ctx = evt.context;
        var mapSize = _getMapSize(evt.target);

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

    function _getMapSize(map) {
        var mapSize = map.getSize();
        return {
            height: mapSize[1] * ol.has.DEVICE_PIXEL_RATIO,
            width: mapSize[0] * ol.has.DEVICE_PIXEL_RATIO
        };
    }

    return {
        Activate: activate,
        Deactivate: deactivate,
        ExportMap: exportMap,
        WindowResized: windowResized
    };
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.FeatureInfo = function(){
    var highLightLayer = null;
    var highlightStyle = null;
    var infoKey = "";
    var boundingBox;
    var infoMarkerOverlay;

    function showHighlightedFeatures(features, map){
        _ensureHighlightLayer(map);
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

    function showInfoMarker(coordinate, element, map){
        var $element = $(element);
        var height = $element.height();
        var width = $element.width();
        var infoMarkerOverlay = new ol.Overlay({
            element: element,
            stopEvent: false,
            offset: [-width / 2, -height]
        });
        infoMarkerOverlay.setPosition(coordinate);
        map.addOverlay(infoMarkerOverlay);
    }

    function removeInfoMarker(element, map){
        map.removeOverlay(infoMarkerOverlay);
    }

    function getFeatureInfoUrl(bwSubLayer, mapLayer, coordinate, view){
        var viewResolution = view.getResolution();

        var layerSource = mapLayer.getSource();
        var projection = view.getProjection();

        var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': bwSubLayer.featureInfo.getFeatureInfoFormat, 'feature_count': 10});
        var decodedUrl = decodeURIComponent(url);
        var queryString = decodedUrl.substring(decodedUrl.lastIndexOf('?'), decodedUrl.length).replace('?', '');
        return bwSubLayer.url + queryString;
    }

    function activateInfoClick(callback, map){
        infoKey = map.on('singleclick', function(evt) {
            callback(evt.coordinate);
        });
    }

    function deactivateInfoClick(map){
        map.unByKey(infoKey);
        infoKey = "";
    }

    function activateBoxSelect(callback, map){
        boundingBox = new ol.interaction.DragBox({
            condition: ol.events.condition.always,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0,0,255,1]
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0.8)'
                })
            })
        });

        map.addInteraction(boundingBox);

        boundingBox.on('boxend', function(){
            callback(boundingBox.getGeometry().getExtent());
        });
    }

    function deactivateBoxSelect(map){
        map.removeInteraction(boundingBox);
    }

    function getFeaturesInExtent(bwSubLayer, extent, mapLayer){
        var source = mapLayer.getSource();
        var features = [];
        source.forEachFeatureInExtent(extent, function(feature){
            features.push(feature);
        });
        var geoJson = new ol.format.GeoJSON();
        var featureCollection = geoJson.writeFeatures(features);
        featureCollection.crs = _createCrsObjectForGeoJson(source.getProjection().getCode());
        return featureCollection;
    }

    function _createCrsObjectForGeoJson(crsCode){
        return new CrsObject(crsCode.split(':'));
    }

    function CrsObject(codes){
        this.type = codes[0];
        this.properties = new CrsProperties(codes[1]);
    }

    function CrsProperties(code){
        this.code = code;
    }

    function getExtentForCoordinate(coordinate, pixelTolerance, resolution){
        var toleranceInMapUnits = pixelTolerance * resolution;
        var n = coordinate[0];
        var e = coordinate[1];
        var minN = n - toleranceInMapUnits;
        var minE = e - toleranceInMapUnits;
        var maxN = n + toleranceInMapUnits;
        var maxE = e + toleranceInMapUnits;
        return [minN, minE, maxN, maxE];
    }

    function _ensureHighlightLayer(map){
        if(highLightLayer == null){

            if(highlightStyle == null){
                _setDefaultHighlightStyle();
            }

            var vectorSource = new ol.source.GeoJSON({
                projection: 'EPSG:4326',
                // this is bogus, just to get the source initialized, can for sure be done a lot more appropriate.
                object: {
                    "type":"FeatureCollection",
                    "totalFeatures":1,
                    "features":[
                        {
                            "type":"Feature",
                            "id":"thc.1",
                            "geometry":
                            {
                                "type":"Point",
                                "coordinates":[21.7495,71.721]},
                            "geometry_name":"the_geom",
                            "properties":
                            {
                                "Year":2003
                            }
                        }
                    ],
                    "crs":
                    {
                        "type":"EPSG",
                        "properties":
                        {
                            "code":"4326"
                        }
                    }
                }
            });
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

    function setHighlightStyle(style){
        highlightStyle = style;
        highLightLayer.setStyle(highlightStyle);
    }

    function _setDefaultHighlightStyle(){
        var defaultStyle = new BW.MapImplementation.OL3.Styles.Default();
        highlightStyle = defaultStyle.Styles;
    }

    return {
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        ShowInfoMarker: showInfoMarker,
        RemoveInfoMarker: removeInfoMarker,
        GetFeatureInfoUrl: getFeatureInfoUrl,
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate
    };
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Map = function(repository, eventHandler, httpHelper, measure, featureInfo, mapExport){
    var map;
    var layerPool = [];
    var originalMapConfig = "";
    var proxyHost = "";

    /*
        Start up functions Start
     */

    function initMap(targetId, mapConfig){
        originalMapConfig = mapConfig;
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

        _registerMapCallbacks();
    }

    function _registerMapCallbacks(){
        var view = map.getView();

        var changeCenter = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeCenter, mapViewChangedObj);
        };

        var changeResolution = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeResolution, mapViewChangedObj);
        };

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

    /*
        Start up functions End
     */

    /*
        Layer functions Start
        Functionality to be moved to BW.MapImplementation.OL3.Layers
     */

    function showLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);
        map.addLayer(layer);

        _trigLayersChanged();
    }

    function showBaseLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);

        var newMapRes = [];
        newMapRes[0]= bwSubLayer.maxResolution;
        for (var t = 1; t < originalMapConfig.numZoomLevels; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
        }
        var sm = new ol.proj.Projection({
            code: bwSubLayer.coordinate_system,
            extent: bwSubLayer.extent,
            units: bwSubLayer.extentUnits
        });

        map.setView(new ol.View({
            projection: sm,
            center: originalMapConfig.center,
            zoom: originalMapConfig.zoom,
            resolutions: newMapRes,
            maxResolution: bwSubLayer.maxResolution,
            numZoomLevels: originalMapConfig.numZoomLevels
        }));

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
        var layer;
        var source;
        var layerFromPool = _getLayerFromPool(bwSubLayer);

        if(layerFromPool != null){
            layer = layerFromPool;
        }
        else{
            switch(bwSubLayer.source){
                case BW.Domain.SubLayer.SOURCES.wmts:
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer);
                    break;

                case BW.Domain.SubLayer.SOURCES.proxyWmts:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer);
                    break;

                case BW.Domain.SubLayer.SOURCES.wms:
                    source = new BW.MapImplementation.OL3.Sources.Wms(bwSubLayer);
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
                case BW.Domain.SubLayer.SOURCES.proxyWms:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.MapImplementation.OL3.Sources.Wms(bwSubLayer);
                    break;
                case BW.Domain.SubLayer.SOURCES.vector:
                    source = new BW.MapImplementation.OL3.Sources.Vector(bwSubLayer, map.getView().getProjection());
                    _loadVectorLayer(bwSubLayer, source);
                    break;
                default:
                    throw "Unsupported source: BW.Domain.SubLayer.SOURCES.'" +
                            bwSubLayer.source +
                            "'. For SubLayer with url " + bwSubLayer.url +
                            " and name " + bwSubLayer.name + ".";
            }

            if(bwSubLayer.source === BW.Domain.SubLayer.SOURCES.vector){
                layer = new ol.layer.Vector({
                    source: source
                });
            }
            else if (bwSubLayer.tiled) {
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

    function _loadVectorLayer(bwSubLayer, source){
        var callback = function(data){
            var fromProj = ol.proj.get(bwSubLayer.coordinate_system);
            var toProj = ol.proj.get(source.getProjection().getCode());
            var features = source.parser.readFeatures(data);
            for(var i = 0; i < features.length; i++) {
                var feature = features[i];
                feature.getGeometry().transform(fromProj, toProj);
            }
            source.addFeatures(features);
        };
        httpHelper.get(bwSubLayer.url).success(callback);
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

    function _trigLayersChanged(){
        var eventObject = _getUrlObject();
        eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeLayers, eventObject);
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

    /*
        Layer functions End
     */

    /*
        Map Export Start
        Functionality in BW.;ap.OL3.Export
     */

    var _resizeEvent = function(){
        mapExport.WindowResized(map);
    };

    function activateExport(options) {
        mapExport.Activate(options, map, redrawMap);
        window.addEventListener('resize', _resizeEvent, false);
    }

    function deactivateExport() {
        window.removeEventListener('resize', _resizeEvent, false);
        mapExport.Deactivate(redrawMap);
    }

    function exportMap(callback){
        mapExport.ExportMap(callback, map);
    }

    function redrawMap(){
        map.updateSize();
    }

    function renderSync(){
        map.renderSync();
    }

    /*
        Map Export End
     */

    /*
        Feature Info Start
        Functionality in BW.MapImplementation.OL3.FeatureInfo
     */

    function activateInfoClick(callback){
        featureInfo.ActivateInfoClick(callback, map);
    }

    function deactivateInfoClick(){
        featureInfo.DeactivateInfoClick(map);
    }

    function getFeatureInfoUrl(bwSubLayer, coordinate){
        return featureInfo.GetFeatureInfoUrl(bwSubLayer, _getLayerFromPool(bwSubLayer), coordinate, map.getView());
    }

    function showHighlightedFeatures(features){
        featureInfo.ShowHighlightedFeatures(features, map);
    }

    function clearHighlightedFeatures(){
        featureInfo.ClearHighlightedFeatures();
    }

    function showInfoMarker(coordinate, element){
        featureInfo.ShowInfoMarker(coordinate, element, map);
    }

    function removeInfoMarker(element){
        featureInfo.RemoveInfoMarker(element, map);
    }

    function setHighlightStyle(style){
        featureInfo.SetHighlightStyle(style);
    }

    function activateBoxSelect(callback){
        featureInfo.ActivateBoxSelect(callback, map);
    }

    function deactivateBoxSelect(){
        featureInfo.DeactivateBoxSelect(map);
    }

    function getExtentForCoordinate(coordinate, pixelTolerance){
        return featureInfo.GetExtentForCoordinate(coordinate, pixelTolerance, map.getView().getResolution());
    }

    function getFeaturesInExtent(bwSubLayer, extent){
        return featureInfo.GetFeaturesInExtent(bwSubLayer, extent, _getLayerFromPool(bwSubLayer));
    }

    /*
        Feature Info End
     */

    /*
        Measure Start
        Functionality in BW.MapImplementation.OL3.Measure
     */

    function activateMeasure(callback){
        measure.Activate(map, callback);
        //var vector = measure.Activate(map, callback);

    }

    function deactivateMeasure(){
        measure.Deactivate(map);
    }

    /*
        Measure End
     */

    /*
        Utility functions start
     */

    var _getUrlObject = function(){
        var retVal = {
            layers: _getGuidsForVisibleLayers()
        };

        var view = map.getView();
        var center = view.getCenter();
        var zoom = view.getZoom().toString();
        if(zoom){
            retVal.zoom = zoom;
        }
        if(center){
            retVal.x = center[1].toFixed(2);
            retVal.y = center[0].toFixed(2);
        }
        return retVal;
    };

    function transformBox(fromCrs, toCrs, boxExtent){
        var returnExtent = boxExtent;

        if(fromCrs !== "" && toCrs !== ""){
            var fromProj = ol.proj.get(fromCrs);
            var toProj = ol.proj.get(toCrs);
            var transformedExtent = ol.proj.transformExtent(boxExtent, fromProj, toProj);

            returnExtent = transformedExtent;
            if(toCrs === "EPSG:4326"){
                returnExtent = transformedExtent[1] + "," + transformedExtent[0] + "," + transformedExtent[3] + "," + transformedExtent[2];
            }
        }

        return returnExtent;
    }

    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    function addZoom() {
        var zoom = new ol.control.Zoom();
        map.addControl(zoom);
    }

    function addZoomSlider() {
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    }

    /*
        Utility functions End
     */

    return {
        // Start up start
        InitMap: initMap,
        ChangeView: changeView,
        // Start up end

        /***********************************/

        // Layer start
        ShowLayer: showLayer,
        ShowBaseLayer: showBaseLayer,
        HideLayer: hideLayer,
        GetLayerByName: getLayerByName,
        SetLayerOpacity: setLayerOpacity,
        SetLayerSaturation: setLayerSaturation,
        SetLayerHue: setLayerHue,
        SetLayerBrightness: setLayerBrightness,
        SetLayerContrast: setLayerContrast,
        MoveLayerToIndex: moveLayerToIndex,
        GetLayerIndex: getLayerIndex,
        // Layer end

        /***********************************/

        // Export start
        RedrawMap: redrawMap,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        GetInfoUrl: getFeatureInfoUrl,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        ShowInfoMarker: showInfoMarker,
        SetHighlightStyle: setHighlightStyle,
        RemoveInfoMarker: removeInfoMarker,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate,
        // Feature Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Utility start
        TransformBox: transformBox,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider

        // Utility end
    };
};

BW.MapImplementation.OL3.Map.RENDERERS = {
    canvas: 'canvas',
    webgl: 'webgl'
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Measure = function(eventHandler){
    var measureKey = ""; // Key for map event pointermove
    var currentFeature; // The current draw object
    var circleRadius; // Distance for the initial circle
    var circleFeature; // The circle feature
    var circleOverlay; // Overlay for the circle

    var drawInteraction; // global so we can remove it later
    /*
        Where the measure features are drawn.
        If this is not added to the map it still works,
        but the objects are removed after double click.
     */
    var drawLayer;

    function activate(map){
        measureKey = map.on('pointermove', _mouseMoveHandler);
        _addInteraction(map);
        // Add layer to preserve measured objects. Should this be optional?
        map.addLayer(drawLayer);
    }

    function deactivate(map){
        map.removeLayer(drawLayer);
        map.unByKey(measureKey);
        measureKey = "";
        map.removeInteraction(drawInteraction);
        map.removeOverlay(circleOverlay);
    }

    function _mouseMoveHandler () { // evt
        if (currentFeature) {
            var measureResult;
            var geom = currentFeature.getGeometry();
            if (geom instanceof ol.geom.Polygon) {
                var polygonArea = _calculateArea(geom);
                var lineLength = _formatPolygonLength(geom);
                var circleArea = _formatArea(_drawCircle(geom));
                measureResult = new BW.Domain.MeasureResult(polygonArea, lineLength, circleArea);
            }

            eventHandler.TriggerEvent(BW.Events.EventTypes.MeasureMouseMove, measureResult);
        }
    }

    function _drawCircle(geom){
        var circleCoordinates = geom.getCoordinates()[0];
        if (circleCoordinates.length == 2) {
            circleFeature.getGeometry().setRadius(circleRadius);
            return Math.PI * Math.pow(circleRadius, 2);
        }
        else{
            circleFeature.getGeometry().setRadius(0);
            return null;
        }
    }

    function _addInteraction(map) {
        circleOverlay = new ol.FeatureOverlay();
        map.addOverlay(circleOverlay);

        var source = new ol.source.Vector();
        var measureStyle = new BW.MapImplementation.OL3.Styles.Measure();

        drawLayer = new ol.layer.Vector({
            source: source,
            style: measureStyle.Styles()
        });

        drawInteraction = new ol.interaction.Draw({
            source: source,
            type: 'Polygon'
        });

        map.addInteraction(drawInteraction);

        drawInteraction.on(
            'drawstart',
            function(evt) {
                currentFeature = evt.feature;
                // Start circle drawing
                var firstPoint = currentFeature.getGeometry().getCoordinates()[0][0];
                circleFeature = new ol.Feature(new ol.geom.Circle(firstPoint, 0));
                circleOverlay.addFeature(circleFeature);
            },
            this
        );

        drawInteraction.on(
            'drawend',
            function() { // evt
                currentFeature = null;
            },
            this
        );
    }

    function _formatLength (coordinates) {
        var length = _getLength(coordinates);
        circleRadius = length;
        length = Math.round(length*100)/100;
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
        }
        return output;
    }

    /*var formatLineLength = function(line){
        return formatLength(line.getCoordinates());
    };*/

    function _formatPolygonLength(polygon){
        return _formatLength(polygon.getCoordinates()[0]);
    }

    function _calculateArea(polygon) {
        var area = polygon.getArea();
        return _formatArea(area);
    }

    function _formatArea(area){
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km';
        } else {
            output = (Math.round(area * 100) / 100) +
            ' ' + 'm';
        }
        return output;
    }

    function _getLength(coordinates){
        var length;
        if(coordinates.length > 0){
            var stride = coordinates[0].length; // 2D or 3D
            var flatCoordinates = _flatternCoordinates(coordinates);
            length = _getFlatLength(flatCoordinates, 0, flatCoordinates.length, stride);
        }
        return length;
    }

    function _flatternCoordinates(coordinates){
        var flatCoordinates = [];
        for(var i = 0; i < coordinates.length; i++){
            var thisCoordinate = coordinates[i];
            for(var j = 0; j < thisCoordinate.length; j++){
                flatCoordinates.push(thisCoordinate[j]);
            }
        }
        return flatCoordinates;
    }

    function _getFlatLength(flatCoordinates, offset, end, stride) {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        var length = 0;
        var i;
        for (i = offset + stride; i < end; i += stride) {
            var x2 = flatCoordinates[i];
            var y2 = flatCoordinates[i + 1];
            length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            x1 = x2;
            y1 = y2;
        }
        return length;
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Utilities = function(){
    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    return {
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson
    };
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Vector = function(bwSubLayer, mapProjection){
    var source;
    switch (bwSubLayer.format){
        case BW.Domain.SubLayer.FORMATS.geoJson:
            source = new ol.source.GeoJSON({
                projection: mapProjection,
                strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
                    maxZoom: 19
                }))
            });
            source.parser = new ol.format.GeoJSON();
            break;
    }
    return source;
};
var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Wms = function(bwSubLayer){
    if (bwSubLayer.tiled) {
        return new ol.source.TileWMS({
            params: {
                LAYERS: bwSubLayer.name,
                VERSION: "1.1.1"
            },
            url: bwSubLayer.url,
            format: bwSubLayer.format,
            crossOrigin: bwSubLayer.crossOrigin,
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
            crossOrigin: bwSubLayer.crossOrigin,
            transparent: bwSubLayer.transparent
        });
    }
};

var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Sources = BW.MapImplementation.OL3.Sources || {};

BW.MapImplementation.OL3.Sources.Wmts = function(bwSubLayer){
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
    var matrixSet = bwSubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
           matrixSet=bwSubLayer.coordinate_system;
    }
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = matrixSet + ":" + z;
    }

    return new ol.source.WMTS({
        url: bwSubLayer.url,
        layer: bwSubLayer.name,
        format: bwSubLayer.format,
        projection: projection,
        matrixSet: matrixSet,
        crossOrigin: bwSubLayer.crossOrigin,
        tileGrid: new ol.tilegrid.WMTS({
            origin: ol.extent.getTopLeft(projectionExtent),
            resolutions: resolutions,
            matrixIds: matrixIds
        })
    });
};

var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Styles = BW.MapImplementation.OL3.Styles || {};

BW.MapImplementation.OL3.Styles.Default = function () {
    var styles = function() {
        var fill = new ol.style.Fill({
            color: 'rgba(255,0,0,0.8)'
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
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Styles = BW.MapImplementation.OL3.Styles || {};

BW.MapImplementation.OL3.Styles.Measure = function(){
    var styles = function(){
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    };

    return {
        Styles: styles
    };
};
var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.Category = function(config){
    var defaults = {
        "catId": "",
        "name": "",
        "parentId": "",
        "subCategories": [],
        "isOpen": false
    };
    return $.extend({}, defaults, config);
};
var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.ConfigRepository = function (configFacade, eventHandler) {

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
            layers.push(new BW.Domain.Layer(config.layers[i]));
        }

        result.layers = layers;

        return new BW.Repository.MapConfig(result);
    }

    function getMapConfig(url){
        configFacade.GetMapConfig(url, function (data) {
            var mapConfig = _createConfig(data);
            eventHandler.TriggerEvent(BW.Events.EventTypes.MapConfigLoaded, mapConfig);
        });
    }

    return {
        GetMapConfig: getMapConfig
    };
};
var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.MapConfig = function(config){
    var defaults = {
        name: "",
        comment: "",
        useCategories: true,
        categories: [],
        numZoomLevels: 10,
        newMaxRes: 20000,
        renderer: BW.MapImplementation.OL3.Map.RENDERERS.canvas,
        center: [-1, 1],
        zoom: 5,
        layers:[],
        coordinate_system: "EPSG:32633",
        matrixSet: "EPSG:32633",
        extent: [-1, -1, -1, -1],
        extentUnits: 'm',
        proxyHost: ""
    };
    return $.extend({}, defaults, config); // mapConfigInstance
};
var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.StaticRepository = function() {
    var mapConfig = new BW.Repository.MapConfig({
        numZoomLevels: 18,
        newMaxRes: 21664.0,
        renderer: BW.MapImplementation.OL3.Map.RENDERERS.canvas,
        center: [-20617, 7661666],
        zoom: 4,
        coordinate_system: "EPSG:32633",
        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
        extentunits: 'm',
        proxyHost: '',
        layers:[
            new BW.Domain.Layer({
                name: 'Hovedkart Sjø',
                visibleOnLoad: true,
                isBaseLayer: true,
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'sjo_hovedkart2',
                        source: BW.Domain.SubLayer.SOURCES.wmts,
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Havbunn Grunnkart',
                visibleOnLoad: false,
                isBaseLayer: true,
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'havbunn_grunnkart',
                        source: BW.Domain.SubLayer.SOURCES.wmts,
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Norskehavet',
                visibleOnLoad: false,
                category:"Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_norskehavet',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Nordsjøen',
                visibleOnLoad: false,
                category:"Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_nordsjoen',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Barentshavet',
                visibleOnLoad: false,
                category: "Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_barentshavet',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Grenser',
                visibleOnLoad: false,
                category:"Kategori 2",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'fp_barentshavet_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    }),
                    new BW.Domain.SubLayer({
                        name: 'fp_norskehavet_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    }),
                    new BW.Domain.SubLayer({
                        name: 'fp_nordsjoen_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            })

        ]
    });

    function _getMapConfig(){
        return mapConfig;
    }

    return {
        GetMapConfig: _getMapConfig
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