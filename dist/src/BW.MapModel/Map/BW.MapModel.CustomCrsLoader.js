var BW = BW || {};
BW.MapModel = BW.MapModel || {};

BW.MapModel.CustomCrsLoader = function(){
    function loadCustomCrs(){
        // proj4 is on the global scope
        proj4.defs("EPSG:32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
    }

    return {
        LoadCustomCrs: loadCustomCrs
    };
};