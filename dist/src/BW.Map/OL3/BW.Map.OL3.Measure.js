var BW = BW || {};
BW.Map = BW.Map || {};
BW.Map.OL3 = BW.Map.OL3 || {};
BW.Map.OL3.Measure = function () {
  var measureKey = '';
  function activate(map, callback) {
    measureKey = map.on('pointermove', function (e) {
      callback(e);
    });
  }
  function deactivate(map) {
    map.unByKey(measureKey);
    measureKey = '';
  }
  return {
    Activate: activate,
    Deactivate: deactivate
  };
};