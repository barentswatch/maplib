var BW = BW || {};
BW.Repository = BW.Repository || {};
BW.Repository.MapConfig = function (config) {
  var defaults = {
      name: '',
      comment: '',
      useCategories: true,
      categories: [],
      numZoomLevels: 10,
      newMaxRes: 20000,
      renderer: BW.Map.OL3.Map.RENDERERS.canvas,
      center: [
        -1,
        1
      ],
      zoom: 5,
      layers: [],
      coordinate_system: 'EPSG:32633',
      extent: [
        -1,
        -1,
        -1,
        -1
      ],
      extentUnits: 'm',
      proxyHost: ''
    };
  return $.extend({}, defaults, config);
};