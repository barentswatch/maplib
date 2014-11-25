var BW = BW || {};
BW.Tools = BW.Tools || {};

BW.Tools.Tools = function(mapInstance, mapApi){
    var internalTools = [];
    var externalTools = [];

    var getFeatureInfoConfig = {
        id: '65001',
        description: 'This tool activates a get feature info click on the map',
        activate: function (){
            mapApi.ActivateInfoClick();
        },
        deactivate: function (){
            mapInstance.DeactivateInfoClick();
        },
        messageObject: []
    };
    var getFeatureInfo = new BW.Tools.Tool(getFeatureInfoConfig);
    internalTools.push(getFeatureInfo);

    function addTool(tool){
        externalTools.push(tool);
    }

    function getAvailableTools(){
        var toolsId = [];
        for(var i = 0; i < externalTools.length; i++){
            toolsId.push(externalTools[i].id);
        }
        return toolsId;
    }

    function activateTool(toolId){
        for(var i = 0; i < externalTools.length; i++){
            var tool = externalTools[i];
            tool.deactivate(mapInstance);

            if(tool.id == toolId){
                tool.activate(mapInstance);
            }
        }
    }

    function setupTools(idArray){
        for(var i = 0; i < internalTools.length; i++){
            var internalTool = internalTools[i];
            if(_getId(idArray, internalTool.id)){
                externalTools.push(internalTool);
            }
        }
    }

    function _getId(idArray, id) {
        if(idArray instanceof Array){
            for(var i = 0; i < idArray.length; i++){
                if(idArray[i] === id){
                    return true;
                }
            }
        }
        return false;
    }

    /*function deactivateTool(toolId){
        for(var i = 0; i++; i < tools.length){
            var tool = tools[i];

            if(tool.id == toolId){
                tool.deactivate(mapInstance);
            }
        }
    }*/

    return {
        AddTool: addTool,
        GetAvailableTools: getAvailableTools,
        ActivateTool: activateTool,
        SetupTools: setupTools
        //DeactivateTool: deactivateTool
    };
};