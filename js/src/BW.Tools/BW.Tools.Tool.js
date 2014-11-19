var BW = BW || {};
BW.Tools = BW.Tools || {};

BW.Tools.Tool = function(config){
    var defaults = {
        id: '',
        activate: function(){ console.log('Not implemented');},
        deactivate: function(){ console.log('Not implemented');},
        messageObject: [],
        description : ''
    };

    var instance =  $.extend({}, defaults, config);

    return instance;
};