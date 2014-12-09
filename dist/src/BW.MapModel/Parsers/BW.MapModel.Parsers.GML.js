var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};
BW.MapModel.Parsers.GML = function () {
  function parse(result) {
    console.log(result);
  }
  return { Parse: parse };
};