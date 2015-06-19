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