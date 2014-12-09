var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Map = function (mapInstance, eventHandler, featureInfo, layerHandler) {
  function init(targetId, mapConfig) {
    mapInstance.InitMap(targetId, mapConfig);
    layerHandler.Init(mapConfig);
    _loadCustomCrs();
    eventHandler.TriggerEvent(BW.Events.EventTypes.MapLoaded);
  }
  function _loadCustomCrs() {
    var customCrsLoader = new BW.MapModel.CustomCrsLoader();
    customCrsLoader.LoadCustomCrs();
  }
  function showLayer(bwLayer) {
    layerHandler.ShowLayer(bwLayer);
  }
  function hideLayer(bwLayer) {
    layerHandler.HideLayer(bwLayer);
  }
  function setLayerOpacity(bwLayer, value) {
    var subLayers = bwLayer.subLayers;
    for (var j = 0; j < subLayers.length; j++) {
      var bwSubLayer = subLayers[j];
      mapInstance.SetLayerOpacity(bwSubLayer, value);
    }
    mapInstance.RedrawMap();
  }
  function setBaseLayer(bwLayer) {
    layerHandler.SetBaseLayer(bwLayer);
  }
  function getBaseLayers() {
    return layerHandler.GetBaseLayers();
  }
  function getFirstVisibleBaseLayer() {
    return layerHandler.GetVisibleBaseLayers()[0];
  }
  function getOverlayLayers() {
    return layerHandler.GetOverlayLayers();
  }
  function _getVisibleSubLayers() {
    return layerHandler.GetVisibleSubLayers();
  }
  function getLayerById(id) {
    return layerHandler.GetLayerById(id);
  }
  function moveLayerToIndex(bwLayer, index) {
    layerHandler.MoveLayerToIndex(bwLayer, index);
  }
  function moveLayerAbove(bwSourceLayer, bwTargetLayer) {
    layerHandler.MoveLayerAbove(bwSourceLayer, bwTargetLayer);
  }
  function _shouldBeVisible(subLayer) {
    return layerHandler.ShouldBeVisible(subLayer);
  }
  function exportMap(callback) {
    mapInstance.ExportMap(callback);
  }
  function activateExport(options) {
    mapInstance.ActivateExport(options);
  }
  function deactivateExport() {
    mapInstance.DeactivateExport();
  }
  function renderSync() {
    return mapInstance.RenderSync();
  }
  function setImageInfoMarker(path) {
    featureInfo.SetInfoMarkerPath(path);
    featureInfo.CreateDefaultInfoMarker();
  }
  function setInfoMarker(element, removeCurrent) {
    featureInfo.SetInfoMarker(element, removeCurrent);
  }
  function removeInfoMarker() {
    featureInfo.RemoveInfoMarker();
  }
  function showHighlightedFeatures(features) {
    mapInstance.ShowHighlightedFeatures(features);
  }
  function clearHighlightedFeatures() {
    mapInstance.ClearHighlightedFeatures();
  }
  function setHighlightStyle(style) {
    mapInstance.SetHighlightStyle(style);
  }
  function activateInfoClick() {
    mapInstance.ActivateInfoClick(_handlePointSelect);
  }
  function deactivateInfoClick() {
    mapInstance.DeactivateInfoClick();
  }
  function activateBoxSelect() {
    mapInstance.ActivateBoxSelect(_handleBoxSelect);
  }
  function deactivateBoxSelect() {
    mapInstance.DeactivateBoxSelect();
  }
  function getSupportedGetFeatureInfoFormats(bwSubLayer, callback) {
    featureInfo.GetSupportedGetFeatureInfoFormats(bwSubLayer, callback);
  }
  function getSupportedGetFeatureFormats(bwSubLayer, callback) {
    featureInfo.GetSupportedGetFeatureFormats(bwSubLayer, callback);
  }
  function convertGmlToGeoJson(gml) {
    return mapInstance.ConvertGmlToGeoJson(gml);
  }
  function _handlePointSelect(coordinate) {
    featureInfo.HandlePointSelect(coordinate, _getLayersSupportingGetFeatureInfo());
  }
  function _getLayersSupportingGetFeatureInfo() {
    var visibleSubLayers = _getVisibleSubLayers();
    return visibleSubLayers.filter(function (subLayer) {
      return subLayer.featureInfo.supportsGetFeatureInfo === true;
    });
  }
  function _handleBoxSelect(boxExtent) {
    featureInfo.HandleBoxSelect(boxExtent, _getLayersSupportingGetFeature());
  }
  function _getLayersSupportingGetFeature() {
    var visibleSubLayers = _getVisibleSubLayers();
    return visibleSubLayers.filter(function (subLayer) {
      return subLayer.featureInfo.supportsGetFeature === true;
    });
  }
  function activateMeasure() {
  }
  function deactivateMeasure() {
  }
  function extentToGeoJson(x, y) {
    mapInstance.ExtentToGeoJson(x, y);
  }
  function setStateFromUrlParams(viewPropertyObject) {
    mapInstance.ChangeView(viewPropertyObject);
    if (viewPropertyObject.layers) {
      var layerGuids = viewPropertyObject.layers;
      var guids = layerGuids.split(',');
      guids.forEach(function (guid) {
        var layer = getLayerById(guid);
        if (layer) {
          if (layer.isBaseLayer === true) {
            setBaseLayer(layer);
          } else {
            showLayer(layer);
          }
        }
      });
    }
  }
  function setLegendGraphics(bwLayer) {
    bwLayer.legendGraphicUrls = [];
    for (var i = 0; i < bwLayer.subLayers.length; i++) {
      var subLayer = bwLayer.subLayers[i];
      if (bwLayer.isVisible && _shouldBeVisible(subLayer)) {
        bwLayer.legendGraphicUrls.push(subLayer.legendGraphicUrl);
      }
    }
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
    RenderSync: renderSync,
    ExportMap: exportMap,
    ActivateExport: activateExport,
    DeactivateExport: deactivateExport,
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
    ActivateMeasure: activateMeasure,
    DeactivateMeasure: deactivateMeasure,
    ConvertGmlToGeoJson: convertGmlToGeoJson,
    SetLegendGraphics: setLegendGraphics,
    ExtentToGeoJson: extentToGeoJson
  };
};