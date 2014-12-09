var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Tools = BW.MapModel.Tools || {};
BW.MapModel.Tools.ToolFactory = function (tools) {
  var internalTools = [];
  var externalTools = [];
  internalTools = tools.GetTools();
  function addTool(tool) {
    externalTools.push(tool);
  }
  function getAvailableTools() {
    var toolsId = [];
    for (var i = 0; i < externalTools.length; i++) {
      toolsId.push(externalTools[i].id);
    }
    return toolsId;
  }
  function activateTool(toolId) {
    var activeToolIsCommand = false;
    for (var i = 0; i < externalTools.length; i++) {
      var tool = externalTools[i];
      tool.deactivate();
      if (tool.id == toolId) {
        tool.activate();
        activeToolIsCommand = tool.isCommand;
      }
    }
    return activeToolIsCommand;
  }
  function setupTools(toolsConfig) {
    for (var i = 0; i < toolsConfig.length; i++) {
      var configTool = toolsConfig[i];
      var correspondingInternalTool = _getInternalTool(configTool.id);
      if (correspondingInternalTool) {
        externalTools.push(correspondingInternalTool);
      }
    }
  }
  function _getInternalTool(toolId) {
    for (var i = 0; i < internalTools.length; i++) {
      var internalTool = internalTools[i];
      if (internalTool.id === toolId) {
        return internalTool;
      }
    }
    return false;
  }
  return {
    AddTool: addTool,
    GetAvailableTools: getAvailableTools,
    ActivateTool: activateTool,
    SetupTools: setupTools
  };
};