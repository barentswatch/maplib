var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};
BW.MapAPI.Tools = BW.MapAPI.Tools || {};

BW.MapAPI.Tools.Tools = function(mapApi){
    var tools = [];

    var getFeatureInfoConfig = {
        id: 'PointSelect',
        description: 'This tool activates a get feature info click on the map',
        activate: function (){
            mapApi.ActivateInfoClick();
        },
        deactivate: function (){
            mapApi.DeactivateInfoClick();
            mapApi.RemoveInfoMarker();
        },
        messageObject: []
    };
    var getFeatureInfo = new BW.MapAPI.Tools.Tool(getFeatureInfoConfig);
    tools.push(getFeatureInfo);

    var zoomAndPanConfig = {
        id: 'DefaultZoom',
        description: 'This is the default tool',
        activate: function(){

        },
        deactivate: function(){

        },
        messageObject: []
    };
    var zoomAndPan = new BW.MapAPI.Tools.Tool(zoomAndPanConfig);
    tools.push(zoomAndPan);

    var boxSelectConfig = {
        id: 'BoxSelect',
        description: 'This tool activates box select functionality to the map',
        activate: function (){
         mapApi.ActivateBoxSelect();
         },
         deactivate: function (){
         mapApi.DeactivateBoxSelect();
         },
        messageObject: []
    };
    var boxSelect = new BW.MapAPI.Tools.Tool(boxSelectConfig);
    tools.push(boxSelect);

    /*var exportCommandConfig = {
        id: 'MapExport',
        description: 'This command shows the export panel',
        activate: function (){
            eventHandler.TriggerEvent(BW.Events.EventTypes.ShowExportPanel);
        },
        isCommand: true
    };
    var exportCommand = new BW.Tools.Tool(exportCommandConfig);
    tools.push(exportCommand);*/

    var measureConfig = {
        id: 'Measure',
        description: 'This tool lets the user measure in the map',
        activate: function (){
            mapApi.ActivateMeasure();
        },
        deactivate: function (){
            mapApi.DeactivateMeasure();
        },
        messageObject: []
    };
    var measure = new BW.MapAPI.Tools.Tool(measureConfig);
    tools.push(measure);

    function getTools(){
        return tools;
    }

    return {
        GetTools: getTools
    };
};