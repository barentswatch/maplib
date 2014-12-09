var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Tools = BW.MapModel.Tools || {};
BW.MapModel.Tools.Tools = function (mapApi) {
  var tools = [];
  var getFeatureInfoConfig = {
      id: 'PointSelect',
      description: 'This tool activates a get feature info click on the map',
      activate: function () {
        mapApi.ActivateInfoClick();
      },
      deactivate: function () {
        mapApi.DeactivateInfoClick();
        mapApi.RemoveInfoMarker();
      },
      messageObject: []
    };
  var getFeatureInfo = new BW.MapModel.Tools.Tool(getFeatureInfoConfig);
  tools.push(getFeatureInfo);
  var zoomAndPanConfig = {
      id: 'DefaultZoom',
      description: 'This is the default tool',
      activate: function () {
      },
      deactivate: function () {
      },
      messageObject: []
    };
  var zoomAndPan = new BW.MapModel.Tools.Tool(zoomAndPanConfig);
  tools.push(zoomAndPan);
  var boxSelectConfig = {
      id: 'BoxSelect',
      description: 'This tool activates box select functionality to the map',
      activate: function () {
        mapApi.ActivateBoxSelect();
      },
      deactivate: function () {
        mapApi.DeactivateBoxSelect();
      },
      messageObject: []
    };
  var boxSelect = new BW.MapModel.Tools.Tool(boxSelectConfig);
  tools.push(boxSelect);
  var measureConfig = {
      id: 'Measure',
      description: 'This tool lets the user measure in the map',
      activate: function () {
        mapApi.ActivateMeasure();
      },
      deactivate: function () {
        mapApi.DeactivateMeasure();
      },
      messageObject: []
    };
  var measure = new BW.MapModel.Tools.Tool(measureConfig);
  tools.push(measure);
  function getTools() {
    return tools;
  }
  return { GetTools: getTools };
};