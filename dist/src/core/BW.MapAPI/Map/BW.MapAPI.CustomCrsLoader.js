var BW = BW || {};
BW.MapAPI = BW.MapAPI || {};

BW.MapAPI.CustomCrsLoader = function(){
    function loadCustomCrs(){
        // proj4 is on the global scope
        proj4.defs("EPSG:32633", '+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
        proj4.defs("EPSG:3575",  '+proj=laea +lat_0=90 +lon_0=10 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs');
    }

    return {
        LoadCustomCrs: loadCustomCrs
    };
};