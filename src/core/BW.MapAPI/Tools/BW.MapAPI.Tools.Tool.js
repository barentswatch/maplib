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