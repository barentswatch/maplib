/**
 * bwmaplib - v0.8.0 - 2016-02-01
 * http://localhost
 *
 * Copyright (c) 2016 
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
        selectedLayerOpen: false, //todo johben temp
        backgroundColor: ''
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
        url : '',
        service : 'WMS'
    };

    var instance =  $.extend({}, defaults, config);

    function getLegendGraphicUrl (){
        return instance.url + "&Request=" + instance.request + "&Version=" + instance.version + "&Service=" + instance.service + "&Format=" + instance.format + "&Width=" + instance.width + "&Height=" + instance.height + "&Layer=" + instance.layer;
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
        uuid: '',
        transparent: true,
        layerIndex: -1,
        legendGraphicUrl: '',
        crossOrigin: 'anonymous',
        featureInfo: new BW.Domain.FeatureInfo(config),
        wmsTimeSupport: false,
        urlPattern: null
    };
    var instance =  $.extend({}, defaults, config); // subLayerInstance

    if(instance.url.indexOf('?') == -1){
        instance.url += '?';
    }

    if (!instance.isBaseLayer) {
        switch (instance.source) {
            case BW.Domain.SubLayer.SOURCES.proxyWms:
            case BW.Domain.SubLayer.SOURCES.wms:
                var legendGraphic = new BW.Domain.LegendGraphic({url: instance.url, layer: instance.name});
                instance.legendGraphicUrl = legendGraphic.GetLegendGraphicUrl();
                break;
            default:
                break;
        }
    }

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

BW.Domain.SubLayer.AUTHENTICATIONTYPES = {
    baat: "baat",
    ecc: "ecc"
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
            wmsUrl = wmsUrl + questionMark;
        }

        var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
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

    function assignInfoFormat(bwSubLayer) {
        //Store supported formats for featureInfo with the layer.
        var callback = function (formats) {
            //console.log(formats);
            // Supported formats, ordered by preference
            var maplibSupportedFormats = ['application/json', 'application/vnd.ogc.gml', 'application/vnd.ogc.gml/3.1.1', 'text/plain', 'text/html'];
            var preferredFormat = 'application/json';
            if (formats.length > 0) {
                for (var i = 0; i < maplibSupportedFormats.length; i++) {
                    if (_.contains(formats, maplibSupportedFormats[i])) {
                        preferredFormat = maplibSupportedFormats[i];
                        break;
                    }
                }
            }
            bwSubLayer.subLayers[0].featureInfo.getFeatureInfoFormat = preferredFormat;
            bwSubLayer.subLayers[0].featureInfo.getFeatureFormat = preferredFormat;
        };

        // Temporary, see BUN-568
        //if (bwSubLayer.subLayers[0].featureInfo.getFeatureInfoFormat === '') {
            getSupportedGetFeatureInfoFormats(bwSubLayer.subLayers[0], callback);
        //}
    }

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

    function createDefaultInfoMarker() {
        infoMarker = document.createElement("img");
        infoMarker.src = infoMarkerPath;
        _hideInfoMarker();
        _addInfoMarker();
    }

    function _showInfoMarker(coordinate){
        setInfoMarker(infoMarker, true);
        infoMarker.style.visibility = "visible";
        infoMarker.style.margin = "0";
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
        AssignInfoFormat: assignInfoFormat,
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
            if(thisIndex !== null){
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

    function init(targetId, mapConfig, callback, options){
        mapImplementation.InitMap(targetId, mapConfig, callback, options);
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
        assignInfoFormat(bwLayer);  // To be changed with BUN-568
    }

    function hideLayer(bwLayer) {
        layerHandler.HideLayer(bwLayer);
    }

    function getLayerParams(bwLayer) {
        return mapImplementation.GetLayerParams(bwLayer);
    }

    function setLayerOpacity(bwLayer, value) {
        var subLayers = bwLayer.subLayers;
        for(var j = 0; j < subLayers.length; j++){
            var bwSubLayer = subLayers[j];
            mapImplementation.SetLayerOpacity(bwSubLayer, value);
        }
        mapImplementation.RedrawMap();
    }

    function getLayerOpacity(bwLayer) {
        var subLayers = bwLayer.subLayers;
        if(subLayers.length > 0) {
            var bwSubLayer = subLayers[0];
            return mapImplementation.GetLayerOpacity(bwSubLayer);
        }
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

    function startWaiting(){
        mapImplementation.StartWaiting();
    }
    function stopWaiting(){
        mapImplementation.StopWaiting();
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

    function assignInfoFormat(bwSubLayer){
        featureInfo.AssignInfoFormat(bwSubLayer);
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

    function fitExtent(extent){
        mapImplementation.FitExtent(extent);
    }

    function extentToGeoJson(x, y){
        mapImplementation.ExtentToGeoJson(x, y);
    }

    function setStateFromUrlParams(viewPropertyObject){
        mapImplementation.ChangeView(viewPropertyObject);

        if(viewPropertyObject.layers){
            var layerGuids = viewPropertyObject.layers;
            var guids = layerGuids.split(",");
            guids.forEach(function (layerinfo){
                var guid = layerinfo;
                var opacity = 100;
                var s = layerinfo.split(':');
                if (s.length === 2) {
                    guid = s[0];
                    // 2do Handle not a number
                    opacity = Number(s[1]) / 100;
                } else {
                    opacity = 1;
                }
                var layer = getLayerById(guid);
                if (layer) {
                    if(layer.isBaseLayer === true){
                        setBaseLayer(layer);                                                                   }
                    else{
                        showLayer(layer);
                        setLayerOpacity(layer,opacity);
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

    function getZoomLevel() {
        return mapImplementation.GetZoomLevel();
    }

    function addZoom() {
        mapImplementation.AddZoom();
    }

    function addZoomSlider() {
        mapImplementation.AddZoomSlider();
    }

    function coordinateToStringDDM (x, y) {
        return mapImplementation.CoordinateToStringDDM(x, y);
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
        GetLayerParams: getLayerParams,
        GetFirstVisibleBaseLayer: getFirstVisibleBaseLayer,
        SetBaseLayer: setBaseLayer,
        SetStateFromUrlParams: setStateFromUrlParams,
        SetLayerOpacity: setLayerOpacity,
        GetLayerOpacity: getLayerOpacity,
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
        StartWaiting: startWaiting,
        StopWaiting: stopWaiting,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        SetInfoMarker: setInfoMarker,
        SetImageInfoMarker: setImageInfoMarker,
        GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
        GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
        AssignInfoFormat: assignInfoFormat,
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
        FitExtent: fitExtent,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        SetLegendGraphics: setLegendGraphics,
        ExtentToGeoJson: extentToGeoJson,
        GetZoomLevel: getZoomLevel,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider,
        CoordinateToStringDDM: coordinateToStringDDM
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
        var fieldsDirectly = "\":";
        var parserName;

        var emptyResult = jQuery.isEmptyObject(result);
        if (emptyResult)
        {
            return null; // Should be empty collection
        }
        if(result.type){
            if(result.type == "FeatureCollection"){
                parserName = 'geoJson';
            }
        }
        else if(result.toLowerCase().indexOf(exception) > -1){
            return parseAsException(result);
        }
        else if(result.toLowerCase().indexOf(msGMLOutput) > -1){
            parserName = 'generalXmlGml';
        }
        else if(result.toLowerCase().indexOf(xml) > -1){
            parserName = 'generalXmlGml';
        }
        else if(result.toLowerCase().indexOf(html) > -1){
            return parseAsHtml(result);
        }
        else if (result.toLowerCase().indexOf(fieldsDirectly) > -1) {
            return parseFieldsDirectly(result);
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
    function parseFieldsDirectly(result) {
        var returnArray = [];
        var fieldsArray = result.split(' \"');
        if (fieldsArray !== null) {
            for (var i in fieldsArray) {
                var subArray = [];
                if (fieldsArray[i].indexOf('":') > -1) {
                    var valueArray = fieldsArray[i].split('":');
                    if (valueArray !== null) {
                        subArray.push(valueArray[0].trim());
                        subArray.push(valueArray[1].trim());
                        returnArray.push(subArray);
                    }
                }
            }
        }
        return _convertToFeatureResponseDirect(returnArray);
    }
    function parseAsHtml(result) {
        var htmlError = result.indexOf("error has occured");
        if (htmlError == -1) {
            var indexOfTableStart = result.indexOf("<table");
            if(indexOfTableStart > -1){
                var tableResult = result.substring(indexOfTableStart, result.length);
                var indexOfTableEnd = tableResult.indexOf("</body>");
                tableResult = tableResult.substring(0, indexOfTableEnd);
                var jsonObject = xml2json.parser(tableResult);
                return _convertToFeatureResponseHtml(jsonObject);//[];
            }
            return _convertToFeatureResponseHtml(undefined);//[];
        }
        return _convertToFeatureResponseHtml(undefined);//[];
    }

    function _convertToFeatureResponseDirect(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = jsonFeatures;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _convertToFeatureResponseHtml(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = jsonFeatures;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    return {
        Parse: parse
    };
};
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Exception = function() {
    function parse(exception) {
        if (typeof console === "object") {
        console.log(exception.replace(/(<([^>]+)>)/ig, ''));}
        //var message = 'No data received from service. Exception was logged to console.';
        var message = 'Det er ingen data tilgjengelig i dette punktet';
        throw message;
    }

    return {
        Parse: parse
    };
};

var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.Factory = function(geoJson, gml, generalXmlGml, fiskeriDir){
    function createParser(parserName){
        var parser;
        switch (parserName){
            case 'geoJson':
                parser = geoJson;
                break;
            case 'gml':
                parser = gml;
                break;
            case 'generalXmlGml':
                parser = generalXmlGml;
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
        if (typeof console === "object") {console.log(result);}
    }

    return {
        Parse: parse
    };
};
// This part covers the ArcGIS Server at http://kart.klif.no/
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};

BW.MapAPI.Parsers.GeneralXmlGml = function() {
    function parse(result) {
        var properties = {};
        var insteadOfGml = 'insteadofgml';
        result = result.replace(/:gml/g, '');
        result = result.replace(/[\n\f\r\t\0\v]/g, ' '); // replace tab & Co with space
        result = result.replace(/gml:/g, insteadOfGml);
        result = result.replace(/s:x/g, 'sx');
        result = result.replace(/xmlns\S*="\S+"/g, '');    // remove namespace tags
        result = result.replace(/ +/g, ' '); // replace multispace with space
        result = result.replace(/\s+>/g, '>'); // space inside tag
        var featureTag = $(result).find("*").first().children().last();
        if (featureTag.length > 0) {
            var tagname = featureTag[0].tagName;
            $(result).find(tagname).each(function () {
                if (typeof console === "object") {console.log("wildcard(*)=" + featureTag);}
                $(this).children().each(function () {
                    properties[this.tagName] = $(this).text();
                    if (typeof console === "object") {console.log(this.tagName + "/" + $(this).text());}
                });
            });

            return _convertToFeatureResponseXML(properties);
        }
        return _convertToFeatureResponseXML(undefined);
    }

    function _convertToFeatureResponseXML(jsonFeatures) {
        var responseFeatureCollection = [];
        var responseFeature = new BW.Domain.FeatureResponse();
        if (jsonFeatures !== undefined) {
            responseFeature.attributes = _getAttributesArrayXML(jsonFeatures);
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }

    function _getAttributesArrayXML(properties) {
        var attributes = [];
        for (var i in properties) {
            if (i !== "INSTEADOFGMLBOUNDEDBY") {
                attributes.push([i, properties[i]]);
            }

        }
        return attributes;
    }

    return {
        Parse: parse
    };
};
/* jshint -W100 */
var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Parsers = BW.MapAPI.Parsers || {};
var mapObj = {
    "j�pattedyr": "jøpattedyr",
    "mr�de": "mråde",
    "sj�": "sjø",
    "�kjerring": "åkjerring"
};

BW.MapAPI.Parsers.GeoJSON = function() {
    function parse(result) {
        var responseFeatureCollection = [];
        var replaceFeatures = [];
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
            // remove symbols
            var replaced = [];
            for (var j in responseFeature.attributes) {
                replaced = responseFeature.attributes[j];
                if (replaced !== null) {
                    replaceFeatures.push(replaceUtfError(replaced));
                }
            }
            responseFeature.attributes = replaceFeatures;
            responseFeatureCollection.push(responseFeature);
        }
        return responseFeatureCollection;
    }
    function replaceUtfError(element) {
        var sub = [];
        var replacedValue = "";
        var attributeName = "";
        if (element!== null) {
            if (typeof element[1]== "number") {
                replacedValue = element[1].toString();
            }

            if (typeof element[1] == "string") {
                var re = new RegExp(Object.keys(mapObj).join("|"), "gi");
                replacedValue = element[1].replace(re, function (matched) {
                    return mapObj[matched];
                });
            }
            if (element[0]!=="") {
                attributeName = element[0];
            }
        }
        sub.push(attributeName);
        sub.push(replacedValue);
        return sub;
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
        activate: function(){ if (typeof console === "object") {console.log('Not implemented');}},
        deactivate: function(){ if (typeof console === "object") {console.log('Not implemented');}},
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
    var waitElement;

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

    function startWaiting() {
        if (infoMarkerOverlay !== undefined) {
            var element = infoMarkerOverlay.getElement();
            if (element !== undefined) {
                element.style.display = "none";
                waitElement = document.createElement("div");
                waitElement.className = "featureWait spinner glyphicon glyphicon-refresh";
                element.parentElement.appendChild(waitElement);
            }
        }
    }
    function stopWaiting() {
        if (infoMarkerOverlay !== undefined) {
            var element = infoMarkerOverlay.getElement();
            if (element !== undefined){
                element.style.display = "block";
                element.className = "";
            }
            if (waitElement !== undefined){
                waitElement.className = "featureDone";
            }
        }
    }
    function showInfoMarker(coordinate, element, map){
        var $element = $(element);
        var height = $element.height();
        var width = $element.width();
        infoMarkerOverlay = new ol.Overlay({
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
        StartWaiting: startWaiting,
        StopWaiting: stopWaiting,
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

BW.MapImplementation.OL3.Map = function(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, wmsTime, baat){
    var map;
    var layerPool = [];
    var proxyHost = "";
    var skipMapCallbacks = false;

    /*
        Start up functions Start
     */

    function initMap(targetId, mapConfig, callback, options){
        proxyHost = mapConfig.proxyHost;

        if (options) {
            if (options.skipMapCallbacks) {
                skipMapCallbacks = options.skipMapCallbacks;
            }
        }

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
        var interactions = ol.interaction.defaults({altShiftDragRotate:false, pinchRotate:false});

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
            overlays: [],
            interactions: interactions
        });

        if (!skipMapCallbacks) {
            _registerMapCallbacks();
        }

        if (callback) {
            callback(map);
        }
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

        // Need to calculate new resolutions according to the layers maxResolution if it has a value
        var newMaxRes = bwSubLayer.maxResolution;
        if (!(newMaxRes === '' || newMaxRes === undefined)){
            var newMapResArray = [];
            newMapResArray[0]= newMaxRes;
            for (var t = 1; t < bwSubLayer.numZoomLevels; t++) {
                newMapResArray[t] = newMapResArray[t - 1] / 2;
            }
            var sm = new ol.proj.Projection({
                code: bwSubLayer.coordinate_system,
                extent: bwSubLayer.extent,
                units: bwSubLayer.extentUnits
            });

            // If url parameters, use those
            urlparams = _getUrlObject();

            map.setView(new ol.View({
                projection: sm,
                center: [Number(urlparams.y) || bwSubLayer.centerY, Number(urlparams.x) || bwSubLayer.centerX],
                zoom: Number(urlparams.zoom) || bwSubLayer.initZoom || 0,
                resolutions: newMapResArray,
                maxResolution: newMaxRes,
                numZoomLevels: bwSubLayer.numZoomLevels
            }));

            if (!skipMapCallbacks) {
                _registerMapCallbacks();
            }
        }

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

    function getLayerParams(bwSubLayer){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer){
            return layer.getSource().getParams();
        }
    }

    function _setTime(bwSubLayer, source){
        if (bwSubLayer.wmsTimeSupport){
            wmsTime.GetCapabilitiesJson(bwSubLayer.url).done(function(data){
                time = wmsTime.GetWmsTime(data, bwSubLayer.name);
                if (time !== undefined) {
                    source.updateParams({
                        TIME: time.current
                    });
                }
            });
        }
    }

    function _createLayer(bwSubLayer){
        var layer;
        var source;
        var layerFromPool = _getLayerFromPool(bwSubLayer);

        if(layerFromPool !== null){
            layer = layerFromPool;
        } else {
            var tokenparameter;
            if (bwSubLayer.authentication && bwSubLayer.authentication === BW.Domain.SubLayer.AUTHENTICATIONTYPES.baat) {
                tokenparameter = "gkt=" + baat.getToken();
            }
            switch(bwSubLayer.source){
                case BW.Domain.SubLayer.SOURCES.wmts:
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer, proxyHost, tokenparameter);
                    break;

                case BW.Domain.SubLayer.SOURCES.proxyWmts:
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer, proxyHost, tokenparameter);
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    break;

                case BW.Domain.SubLayer.SOURCES.wms:
                    source = new BW.MapImplementation.OL3.Sources.Wms(bwSubLayer);
                    _setTime(bwSubLayer, source);
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
                    _setTime(bwSubLayer, source);
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
            _trigLayersChanged();
        }
    }

    function getLayerOpacity(bwSubLayer) {
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer){
            return layer.getOpacity();
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
        for (var j = 0; j < visibleLayers.length; j++) {
            if (visibleLayers[j].getOpacity() === 1) {
                result.push(visibleLayers[j].guid);
            }
            else {
                result.push(visibleLayers[j].guid + ':' + Math.round(visibleLayers[j].getOpacity() * 100));
            }
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

    function startWaiting(){
        featureInfo.StartWaiting();
    }
    function stopWaiting(){
        featureInfo.StopWaiting();
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

    function fitExtent(extent){
        map.getView().fit(extent, map.getSize());
    }

    var _getUrlObject = function(){
        var retVal = {
            layers: _getGuidsForVisibleLayers()
        };

        var view = map.getView();
        var center = view.getCenter();
        var zoom = view.getZoom();
        if(zoom){
            retVal.zoom = zoom.toString();
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

    function getZoomLevel() {
        return map.getView().getZoom();
    }

    function addZoom() {
        var zoom = new ol.control.Zoom();
        map.addControl(zoom);
    }

    function addZoomSlider() {
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    }

    // Coordinate to Degrees and Decimal Minutes
    function coordinateToStringDDM(x, y) {
        var returnString = '';

        if (x && y && !isNaN(x) && !isNaN(y)) {
            returnString = degreesToStringDDM(y, 'NS') + ' ' + degreesToStringDDM(x, 'EW');
        }

        return returnString;
    }

    function degreesToStringDDM(degrees, hemispheres) {
        var normalizedDegrees = ((degrees + 180)%360) - 180;
        var x = Math.abs(Math.round(36000 * normalizedDegrees));
        degrees = Math.floor(x / 36000);
        var decimalMinutes = padNumber((x / 600) % 60, 2, 3);

        return degrees + '\u00b0 ' + decimalMinutes + ' ' + hemispheres.charAt(normalizedDegrees < 0 ? 1 : 0);
    }

    function padNumber(num, length, precision) {

        if (precision) {
            num = num.toFixed(precision);
        }

        num =  num.toString();

        var index = num.indexOf('.');

        if (index === -1) {
            index = num.length;
        }

        var padding = '';

        for (var i = 0; i < Math.max(0, length - index); i++) {
            padding += '0';
        }

        return padding + num;
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
        GetLayerOpacity: getLayerOpacity,
        GetLayerParams: getLayerParams,
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
        StartWaiting: startWaiting,
        StopWaiting: stopWaiting,
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
        FitExtent: fitExtent,
        TransformBox: transformBox,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson,
        GetZoomLevel: getZoomLevel,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider,
        CoordinateToStringDDM: coordinateToStringDDM
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
        circleOverlay = new ol.layer.Vector({
            map: map,
            source: new ol.source.Vector({
                features: new ol.Collection()
            })
        });

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
                circleOverlay.getSource().addFeature(circleFeature);
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

BW.MapImplementation.OL3.Time = function() {

    var extentTime;
    var arrayLength;
    var jsonDates = [];

    // Retrieve the getCapabilities data from a given service url
    function getCapabilitiesJson(url) {
        url = url.replace(/\?$/g,'');   // remove trailing "?"
        var capabilitiesUrl = url + "?SERVICE=WMS&REQUEST=GetCapabilities&version=1.3.0";
        return $.ajax({
            url: capabilitiesUrl,
            type: 'GET'
        });
    }

    // Parse the capability info and get a json structure containing the dates, resolution and most current result
    function getWmsTime(capabilityResponse, layerName) {
        var parser = new ol.format.WMSCapabilities();
        var jsonCapabilities = parser.read(capabilityResponse);

        if (jsonCapabilities.Capability !== undefined) {
            for (var i = 0; i < jsonCapabilities.Capability.Layer.Layer.length; i++) {
                var layer = jsonCapabilities.Capability.Layer.Layer[i];
                if (layer.Name === layerName) {
                    extentTime = layer.Dimension[0].values;
                    var timeArray = extentTime.split(",");
                    timeArray.sort();
                    arrayLength = timeArray.length;

                    for (var j = 0; j < arrayLength; j++) {
                        var jsonItem = _analyzeDate(timeArray[j]);
                        jsonDates.push(jsonItem);
                    }
                    var resolution = _getResolution();

                    return {
                        "dates": jsonDates,
                        "resolution": resolution,
                        "current": _getCurrent(timeArray)
                    };
                }
            }
        }
        return undefined;
    }

    /////////////////////////////
    // Internal helper methods //
    /////////////////////////////

    // Get the time nearest before current time
    function _getCurrent(dateArray) {
        var current = '';
        arrayLength = dateArray.length;
        for (var j = 0; j < arrayLength; j++) {
            if (moment(dateArray[j]) < moment()) {
                current = dateArray[j];
            }
            else {
                return current;
            }
        }
        return current;
    }

    // helper method when determining/validating the data resolution
    function _updateResolution(resolution, newResolution){
        if (resolution === undefined) {
            // First time called, set resolution
            resolution = newResolution;
        }
        else if (resolution !== newResolution) {
            // Different resolutions not supported
            return "error";
        }
        return resolution;
    }

    // Find resolution of the time array
    function _getResolution() {
        var resolution;
        var newResolution;

        for (var k = 1; k < arrayLength; k++) {

            var prev = jsonDates[k - 1];
            var curr = jsonDates[k];
            if (prev.type !== curr.type) {
                // Different time formats, not supported
                return "error";
            }

            resolution = _updateResolution(resolution, newResolution);

            var dMinute = (curr.Minutes !== undefined) ? curr.Minutes - prev.Minutes : 0;
            if (dMinute !== 0) {
                newResolution = "Minutes";
                continue;
            }

            var dHour = (curr.Hours !== undefined) ? curr.Hours - prev.Hours : 0;
            if (dHour !== 0) {
                newResolution = "Hour";
                continue;
            }

            var dDay = (curr.Day !== undefined) ? curr.Day - prev.Day : 0;
            if (dDay !== 0) {
                newResolution = "Day";
                continue;
            }

            var dMonth = (curr.Month !== undefined) ? curr.Month - prev.Month : 0;
            if (dMonth !== 0) {
                newResolution = "Month";
                continue;
            }

            var dYear = curr.Year - prev.Year;
            if (dYear !== 0) {
                newResolution = "Year";
            }
        }

        return _updateResolution(resolution, newResolution);
    }

    // Validate date format and create date object
    function _analyzeDate(datestring) {
        var type = "";
        var dateFormat = 0;
        if (moment(datestring, "YYYY-MM-DDTHH:mm:ssZ").isValid()) {
            dateFormat = 1;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateFormat = 2;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateFormat = 3;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateFormat = 4;
        }
        else if (moment(datestring, "YYYY-MM-DD HH:mm:ss").isValid()) {
            dateFormat = 5;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateFormat = 6;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH").isValid()) {
            dateFormat = 7;
        }
        else if (moment(datestring, "YYYY-MM-DD").isValid()) {
            dateFormat = 8;
        }
        else if (moment(datestring, "YYYY-MM").isValid()) {
            dateFormat = 9;
        }
        else if (moment(datestring, "YYYY").isValid()) {
            dateFormat = 10;
        }
        else if (moment(datestring, "THH:mm:ssZ").isValid()) {
            dateFormat = 11;
        }
        else if (moment(datestring, "THH:mm:ss").isValid()) {
            dateFormat = 12;
        }
        else if (moment(datestring, "YYYYMMDD").isValid()) {
            dateFormat = 13;
        }
        else { // invalid format
            return {};
        }

        var year, month, day, hour, minutes;

        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]) {
            year = moment(datestring).year();
            type = "year";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]) {
            month = moment(datestring).month();
            type = "month";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            day = moment(datestring).day();
            type = "day";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 11, 12]) {
            hour = moment(datestring).hours();
            type = "hour";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            minutes = moment(datestring).minutes();
            type = "minutes";
        }
        return {
            "Value": datestring,
            "Year": year,
            "Month": month,
            "Day": day,
            "Hours": hour,
            "Minutes": minutes,
            "Type": type,
            "Format": dateFormat
        };
    }

    return {
        GetCapabilitiesJson: getCapabilitiesJson,
        GetWmsTime: getWmsTime
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

BW.MapImplementation.OL3.Sources.Wmts = function(bwSubLayer, proxyhost, tokenparameter){
    var projection = new ol.proj.Projection({
        code: bwSubLayer.coordinate_system,
        extent: bwSubLayer.extent,
        units: bwSubLayer.extentUnits
    });

    var projectionExtent = projection.getExtent();
    var size = ol.extent.getWidth(projectionExtent) / 256;
    var resolutions = new Array(bwSubLayer.numZoomLevels);
    var matrixIds = new Array(bwSubLayer.numZoomLevels);
    var numZoomLevels = bwSubLayer.numZoomLevels;
    var matrixSet = bwSubLayer.matrixSet;
    if (matrixSet === null || matrixSet === '' || matrixSet === undefined)
    {
           matrixSet=bwSubLayer.coordinate_system;
    }
    for (var z = 0; z < numZoomLevels; ++z) {
        resolutions[z] = size / Math.pow(2, z);
        matrixIds[z] = matrixSet + ":" + z;
    }
    
    var url;
    if (tokenparameter) {
        //don't use proxy when using baat token
        url = bwSubLayer.urlPattern ? bwSubLayer.urlPattern : bwSubLayer.url;
        url = url + tokenparameter;
    } else if (proxyhost && !tokenparameter) {
        url = proxyhost + bwSubLayer.url;
    } else if (!proxyhost && !tokenparameter) {
        url = bwSubLayer.urlPattern ? bwSubLayer.urlPattern : bwSubLayer.url;
    }

    return new ol.source.WMTS({
        url: url,
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

BW.Repository.Baat = function(config) {
    var token = config.token;

    function getToken() {
        return token;
    }

    return {
        getToken: getToken
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