var BW = BW || {};
BW.Domain = BW.Domain || {};
BW.Domain.FeatureInfo = function (config) {
  var defaults = {
      supportsGetFeatureInfo: true,
      getFeatureInfoFormat: 'application/json',
      getFeatureInfoCrs: '',
      supportsGetFeature: true,
      getFeatureBaseUrl: '',
      getFeatureFormat: 'application/json',
      getFeatureCrs: 'EPSG:4326'
    };
  var instance = $.extend({}, defaults, config);
  return instance;
};