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