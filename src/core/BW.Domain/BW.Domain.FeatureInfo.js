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