var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Parsers = BW.MapModel.Parsers || {};
BW.MapModel.Parsers.Exception = function () {
  function parse(exception) {
    var message = exception.replace(/(<([^>]+)>)/gi, '');
    throw message;
  }
  return { Parse: parse };
};