var BW = BW || {};
BW.Domain = BW.Domain || {};
BW.Domain.Layer = function (config) {
  var defaults = {
      subLayers: [],
      name: '',
      categoryId: 0,
      visibleOnLoad: true,
      isVisible: false,
      id: new BW.Utils.Guid().newGuid(),
      isBaseLayer: false,
      previewActive: false,
      opacity: 1,
      mapLayerIndex: -1,
      legendGraphicUrls: [],
      selectedLayerOpen: false
    };
  var layerInstance = $.extend({}, defaults, config);
  var subLayers = [];
  for (var i = 0; i < config.subLayers.length; i++) {
    subLayers.push(new BW.Domain.SubLayer(config.subLayers[i]));
  }
  layerInstance.subLayers = subLayers;
  return layerInstance;
};