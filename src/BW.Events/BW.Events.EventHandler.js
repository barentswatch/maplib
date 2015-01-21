var BW = BW || {};
BW.Events = BW.Events || {};

BW.Events.EventHandler = function(){
    var callBacks = [];

    function _registerEvent(eventType, callBack){
        callBacks.push({
            eventType: eventType,
            callBack: callBack
        });
    }

    function _triggerEvent(eventType, args){
        for(var i = 0; i < callBacks.length; i++){
            var callBack = callBacks[i];
            if(callBack.eventType == eventType){
                callBack.callBack(args);
            }
        }
    }

    return {
        RegisterEvent: _registerEvent,
        TriggerEvent: _triggerEvent
    };
};

BW.Events.EventTypes = {
    ChangeCenter: "ChangeCenter",
    ChangeResolution: "ChangeResolution",
    ChangeLayers: "ChangeLayers",
    FeatureInfoStart: "FeatureInfoStart",
    FeatureInfoEnd: "FeatureInfoEnd"
};