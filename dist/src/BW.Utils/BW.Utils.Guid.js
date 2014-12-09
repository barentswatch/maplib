var BW = BW || {};
BW.Utils = BW.Utils || {};
BW.Utils.Guid = function () {
  function s4() {
    return Math.floor((1 + Math.random()) * 65536).toString(16).substring(1);
  }
  function newGuid() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }
  return { newGuid: newGuid };
};