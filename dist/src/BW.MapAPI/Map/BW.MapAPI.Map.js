var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.Map = function(mapInstance, eventHandler, featureInfo, layerHandler, categoryHandler) {

    /*
        Start up functions Start
     */

    function init(targetId, mapConfig){
        mapInstance.InitMap(targetId, mapConfig);
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
            mapInstance.SetLayerOpacity(bwSubLayer, value);
        }
        mapInstance.RedrawMap();
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
        mapInstance.ExportMap(callback);
    }

    function activateExport(options) {
        mapInstance.ActivateExport(options);
    }

    function deactivateExport() {
        mapInstance.DeactivateExport();
    }

    function renderSync(){
        return mapInstance.RenderSync();
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
        mapInstance.ShowHighlightedFeatures(features);
    }

    function clearHighlightedFeatures(){
        mapInstance.ClearHighlightedFeatures();
    }

    function setHighlightStyle(style) {
        mapInstance.SetHighlightStyle(style);
    }

    function activateInfoClick(){
        mapInstance.ActivateInfoClick(_handlePointSelect);
    }

    function deactivateInfoClick(){
        mapInstance.DeactivateInfoClick();
    }

    function activateBoxSelect(){
        mapInstance.ActivateBoxSelect(_handleBoxSelect);
    }

    function deactivateBoxSelect(){
        mapInstance.DeactivateBoxSelect();
    }

    function getSupportedGetFeatureInfoFormats(bwSubLayer, callback){
        featureInfo.GetSupportedGetFeatureInfoFormats(bwSubLayer, callback);
    }

    function getSupportedGetFeatureFormats(bwSubLayer, callback){
        featureInfo.GetSupportedGetFeatureFormats(bwSubLayer, callback);
    }

    function convertGmlToGeoJson(gml){
        return mapInstance.ConvertGmlToGeoJson(gml);
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
        mapInstance.ActivateMeasure();
    }

    function deactivateMeasure(){
        mapInstance.DeactivateMeasure();
    }

    /*
        Measure End
     */

    /*
        Utility functions Start
     */

    function extentToGeoJson(x, y){
        mapInstance.ExtentToGeoJson(x, y);
    }

    function setStateFromUrlParams(viewPropertyObject){
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

    function setLegendGraphics(bwLayer){
        bwLayer.legendGraphicUrls = [];
        for(var i = 0; i < bwLayer.subLayers.length; i++){
            var subLayer = bwLayer.subLayers[i];
            if(bwLayer.isVisible && _shouldBeVisible(subLayer)){
                bwLayer.legendGraphicUrls.push(subLayer.legendGraphicUrl);
            }
        }
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
        ExtentToGeoJson: extentToGeoJson
        //AddVectorTestData: addVectorTestData
        // Utility end
    };
};