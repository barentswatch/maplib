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
