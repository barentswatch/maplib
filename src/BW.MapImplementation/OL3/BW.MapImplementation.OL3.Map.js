var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Map = function(repository, eventHandler, httpHelper, measure, featureInfo, mapExport, wmsTime){
    var map;
    var layerPool = [];
    var proxyHost = "";

    /*
        Start up functions Start
     */

    function initMap(targetId, mapConfig){
        proxyHost = mapConfig.proxyHost;
        var numZoomLevels = mapConfig.numZoomLevels;
        var newMapRes = [];
        newMapRes[0]= mapConfig.newMaxRes;
        for (var t = 1; t < numZoomLevels; t++) {
            newMapRes[t] = newMapRes[t - 1] / 2;
        }
        var sm = new ol.proj.Projection({
            code: mapConfig.coordinate_system,
            extent: mapConfig.extent,
            units: mapConfig.extentUnits
        });

        map = new ol.Map({
            target: targetId,
            renderer: mapConfig.renderer,
            layers: [],
            view: new ol.View({
                projection: sm,
                center: mapConfig.center,
                zoom: mapConfig.zoom,
                resolutions: newMapRes,
                maxResolution: mapConfig.newMaxRes,
                numZoomLevels: numZoomLevels
            }),
            controls: [],
            overlays: []
        });

        _registerMapCallbacks();
    }

    function _registerMapCallbacks(){
        var view = map.getView();

        var changeCenter = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeCenter, mapViewChangedObj);
        };

        var changeResolution = function(){
            var mapViewChangedObj = _getUrlObject();
            eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeResolution, mapViewChangedObj);
        };

        view.on('change:center', changeCenter);
        view.on('change:resolution', changeResolution);
    }

    function changeView(viewPropertyObject){
        var view = map.getView();
        var x, y, zoom;
        if(viewPropertyObject.x){
            x = viewPropertyObject.x;
        }
        if(viewPropertyObject.y){
            y = viewPropertyObject.y;
        }
        if(viewPropertyObject.zoom){
            zoom = viewPropertyObject.zoom;
        }

        if(x !== undefined && y !== undefined){
            var eastings = parseFloat(y.replace(/,/g, '.'));
            var northings = parseFloat(x.replace(/,/g, '.'));
            if (isFinite(eastings) && isFinite(northings)) {
                view.setCenter([eastings, northings]);
            }
        }

        if(zoom !== undefined){
            view.setZoom(zoom);
        }
    }

    /*
        Start up functions End
     */

    /*
        Layer functions Start
        Functionality to be moved to BW.MapImplementation.OL3.Layers
     */

    function showLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);
        map.addLayer(layer);

        _trigLayersChanged();
    }

    function showBaseLayer(bwSubLayer){
        var layer = _createLayer(bwSubLayer);

        // Need to calculate new resolutions according to the layers maxResolution if it has a value
        var newMaxRes = bwSubLayer.maxResolution;
        if (!(newMaxRes === '' || newMaxRes === undefined)){
            var newMapResArray = [];
            newMapResArray[0]= newMaxRes;
            for (var t = 1; t < bwSubLayer.numZoomLevels; t++) {
                newMapResArray[t] = newMapResArray[t - 1] / 2;
            }
            var sm = new ol.proj.Projection({
                code: bwSubLayer.coordinate_system,
                extent: bwSubLayer.extent,
                units: bwSubLayer.extentUnits
            });

            // If url parameters, use those
            urlparams = _getUrlObject();

            map.setView(new ol.View({
                projection: sm,
                center: [Number(urlparams.y) || bwSubLayer.centerY, Number(urlparams.x) || bwSubLayer.centerX],
                zoom: Number(urlparams.zoom) || bwSubLayer.initZoom || 0,
                resolutions: newMapResArray,
                maxResolution: newMaxRes,
                numZoomLevels: bwSubLayer.numZoomLevels
            }));
            _registerMapCallbacks();
        }

        map.getLayers().insertAt(0, layer);
        //_trigLayersChanged();
    }

    function hideLayer(bwSubLayer){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer){
            map.removeLayer(layer);
            _trigLayersChanged();
        }
    }

    function getLayerParams(bwSubLayer){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer){
            return layer.getSource().getParams();
        }
    }

    function _setTime(bwSubLayer){
        if (bwSubLayer.wmsTimeSupport){
            time = wmsTime.GetWmsTime();
            //if (bwSubLayer.id === 1393){  // Todo: Make general, this is just to test a single ice-layer
            source.updateParams({
                TIME: time.current
            });
            //}
        }
    }

    function _createLayer(bwSubLayer){
        var layer;
        var source;
        var layerFromPool = _getLayerFromPool(bwSubLayer);

        if(layerFromPool != null){
            layer = layerFromPool;
        }
        else{
            switch(bwSubLayer.source){
                case BW.Domain.SubLayer.SOURCES.wmts:
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer);
                    break;

                case BW.Domain.SubLayer.SOURCES.proxyWmts:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.MapImplementation.OL3.Sources.Wmts(bwSubLayer);
                    break;

                case BW.Domain.SubLayer.SOURCES.wms:
                    source = new BW.MapImplementation.OL3.Sources.Wms(bwSubLayer);
                    _setTime(bwSubLayer);
                    break;
                /**
                 Bruker proxy mot disse):
                 Image from origin
                 'http://maps.imr.no' 'http://kart.fiskeridir.no' 'http://wms2.nve.no'
                 'http://wms3.nve.no' 'http://bw-wms.met.no' 'http://wms.dirnat.no'
                 'http://kart.klif.no' 'http://wms.miljodirektoratet.no' 'http://npdwms.npd.no'
                 'http://kart.kystverket.no'
                 has been blocked from loading by Cross-Origin Resource Sharing policy:
                 No 'Access-Control-Allow-Origin' header is present on the requested resource.
                 **/
                case BW.Domain.SubLayer.SOURCES.proxyWms:
                    bwSubLayer.url = proxyHost + bwSubLayer.url;
                    source = new BW.MapImplementation.OL3.Sources.Wms(bwSubLayer);
                    _setTime(bwSubLayer);
                    break;
                case BW.Domain.SubLayer.SOURCES.vector:
                    source = new BW.MapImplementation.OL3.Sources.Vector(bwSubLayer, map.getView().getProjection());
                    _loadVectorLayer(bwSubLayer, source);
                    break;
                default:
                    throw "Unsupported source: BW.Domain.SubLayer.SOURCES.'" +
                            bwSubLayer.source +
                            "'. For SubLayer with url " + bwSubLayer.url +
                            " and name " + bwSubLayer.name + ".";
            }

            if(bwSubLayer.source === BW.Domain.SubLayer.SOURCES.vector){
                layer = new ol.layer.Vector({
                    source: source
                });
            }
            else if (bwSubLayer.tiled) {
                layer = new ol.layer.Tile({
                    extent: bwSubLayer.extent,
                    opacity: bwSubLayer.opacity,
                    source: source
                });
            } else {
                layer = new ol.layer.Image({
                    extent: bwSubLayer.extent,
                    opacity: bwSubLayer.opacity,
                    source: source
                });
            }

            layer.layerIndex = bwSubLayer.layerIndex;
            layer.guid = bwSubLayer.id;

            layerPool.push(layer);
        }

        return layer;
    }

    function _loadVectorLayer(bwSubLayer, source){
        var callback = function(data){
            var fromProj = ol.proj.get(bwSubLayer.coordinate_system);
            var toProj = ol.proj.get(source.getProjection().getCode());
            var features = source.parser.readFeatures(data);
            for(var i = 0; i < features.length; i++) {
                var feature = features[i];
                feature.getGeometry().transform(fromProj, toProj);
            }
            source.addFeatures(features);
        };
        httpHelper.get(bwSubLayer.url).success(callback);
    }

    function _getLayerFromPool(bwSubLayer){
        for(var i = 0; i < layerPool.length; i++){
            var layerInPool = layerPool[i];
            if(layerInPool.guid == bwSubLayer.id){
                return layerInPool;
            }
        }
        return null;
    }

    function setLayerBrightness(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setBrightness(Math.min(value,1));
        }
    }
    function setLayerContrast(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setContrast(Math.min(value,1));
        }
    }
    function setLayerOpacity(bwSubLayer, value){
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setOpacity(Math.min(value,1));
        }
    }
    function setLayerSaturation(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setSaturation(Math.min(value,1));
        }
    }
    function setLayerHue(bwSubLayer, value){
        // Require WebGL-rendering of map
        var layer = _getLayerByGuid(bwSubLayer.id);
        if(layer && !isNaN(value)){
            layer.setHue(Math.min(value,1));
        }
    }

    function _getLayersWithGuid(){
        return map.getLayers().getArray().filter(function(elem){
            return elem.guid !== undefined;
        });
    }

    function _getLayerByGuid(guid){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == guid){
                return layer;
            }
        }
        return null;
    }

    function getLayerIndex(bwSubLayer){
        var layers = _getLayersWithGuid();
        for(var i = 0; i < layers.length; i++){
            var layer = layers[i];
            if(layer.guid == bwSubLayer.id){
                return i;
            }
        }
        return null;
    }

    function getLayerByName(layerTitle) {
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            if (layers[i].get('title') == layerTitle) {
                return layers[i];
            }
        }
        return null;
    }

    function moveLayerToIndex(bwSubLayer, index){
        var subLayerIndex = getLayerIndex(bwSubLayer);
        var layersArray = map.getLayers().getArray();
        layersArray.splice(index, 0, layersArray.splice(subLayerIndex, 1)[0]);

        _trigLayersChanged();
    }

    function _trigLayersChanged(){
        var eventObject = _getUrlObject();
        eventHandler.TriggerEvent(BW.Events.EventTypes.ChangeLayers, eventObject);
    }

    function _getGuidsForVisibleLayers() {
        var visibleLayers = [];
        var layers = _getLayersWithGuid();
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            if (layer.getVisible() === true) {
                visibleLayers.push(layers[i]);
            }
        }

        visibleLayers.sort(_compareMapLayerIndex);
        var result = [];
        for(var j = 0; j < visibleLayers.length; j++){
            result.push(visibleLayers[j].guid);
        }
        return result.join(",");
    }

    function _compareMapLayerIndex(a, b) {
        if (a.mapLayerIndex < b.mapLayerIndex){
            return -1;
        }
        if (a.mapLayerIndex > b.mapLayerIndex){
            return 1;
        }
        return 0;
    }

    /*
        Layer functions End
     */

    /*
        Map Export Start
        Functionality in BW.;ap.OL3.Export
     */

    var _resizeEvent = function(){
        mapExport.WindowResized(map);
    };

    function activateExport(options) {
        mapExport.Activate(options, map, redrawMap);
        window.addEventListener('resize', _resizeEvent, false);
    }

    function deactivateExport() {
        window.removeEventListener('resize', _resizeEvent, false);
        mapExport.Deactivate(redrawMap);
    }

    function exportMap(callback){
        mapExport.ExportMap(callback, map);
    }

    function redrawMap(){
        map.updateSize();
    }

    function renderSync(){
        map.renderSync();
    }

    /*
        Map Export End
     */

    /*
        Feature Info Start
        Functionality in BW.MapImplementation.OL3.FeatureInfo
     */

    function activateInfoClick(callback){
        featureInfo.ActivateInfoClick(callback, map);
    }

    function deactivateInfoClick(){
        featureInfo.DeactivateInfoClick(map);
    }

    function getFeatureInfoUrl(bwSubLayer, coordinate){
        return featureInfo.GetFeatureInfoUrl(bwSubLayer, _getLayerFromPool(bwSubLayer), coordinate, map.getView());
    }

    function showHighlightedFeatures(features){
        featureInfo.ShowHighlightedFeatures(features, map);
    }

    function clearHighlightedFeatures(){
        featureInfo.ClearHighlightedFeatures();
    }

    function showInfoMarker(coordinate, element){
        featureInfo.ShowInfoMarker(coordinate, element, map);
    }

    function removeInfoMarker(element){
        featureInfo.RemoveInfoMarker(element, map);
    }

    function setHighlightStyle(style){
        featureInfo.SetHighlightStyle(style);
    }

    function activateBoxSelect(callback){
        featureInfo.ActivateBoxSelect(callback, map);
    }

    function deactivateBoxSelect(){
        featureInfo.DeactivateBoxSelect(map);
    }

    function getExtentForCoordinate(coordinate, pixelTolerance){
        return featureInfo.GetExtentForCoordinate(coordinate, pixelTolerance, map.getView().getResolution());
    }

    function getFeaturesInExtent(bwSubLayer, extent){
        return featureInfo.GetFeaturesInExtent(bwSubLayer, extent, _getLayerFromPool(bwSubLayer));
    }

    /*
        Feature Info End
     */

    /*
        Measure Start
        Functionality in BW.MapImplementation.OL3.Measure
     */

    function activateMeasure(callback){
        measure.Activate(map, callback);
        //var vector = measure.Activate(map, callback);

    }

    function deactivateMeasure(){
        measure.Deactivate(map);
    }

    /*
        Measure End
     */

    /*
        Utility functions start
     */

    var _getUrlObject = function(){
        var retVal = {
            layers: _getGuidsForVisibleLayers()
        };

        var view = map.getView();
        var center = view.getCenter();
        var zoom = view.getZoom().toString();
        if(zoom){
            retVal.zoom = zoom;
        }
        if(center){
            retVal.x = center[1].toFixed(2);
            retVal.y = center[0].toFixed(2);
        }
        return retVal;
    };

    function transformBox(fromCrs, toCrs, boxExtent){
        var returnExtent = boxExtent;

        if(fromCrs !== "" && toCrs !== ""){
            var fromProj = ol.proj.get(fromCrs);
            var toProj = ol.proj.get(toCrs);
            var transformedExtent = ol.proj.transformExtent(boxExtent, fromProj, toProj);

            returnExtent = transformedExtent;
            if(toCrs === "EPSG:4326"){
                returnExtent = transformedExtent[1] + "," + transformedExtent[0] + "," + transformedExtent[3] + "," + transformedExtent[2];
            }
        }

        return returnExtent;
    }

    function convertGmlToGeoJson(gml){
        var xmlParser = new ol.format.WMSCapabilities();
        var xmlFeatures = xmlParser.read(gml);
        var gmlParser = new ol.format.GML();
        var features = gmlParser.readFeatures(xmlFeatures);
        var jsonParser = new ol.format.GeoJSON();
        return jsonParser.writeFeatures(features);
    }

    function extentToGeoJson(x, y){
        var point = new ol.geom.Point([x, y]);
        var feature = new ol.Feature();
        feature.setGeometry(point);
        var geoJson = new ol.format.GeoJSON();
        return geoJson.writeFeature(feature);
    }

    function addZoom() {
        var zoom = new ol.control.Zoom();
        map.addControl(zoom);
    }

    function addZoomSlider() {
        var zoomslider = new ol.control.ZoomSlider();
        map.addControl(zoomslider);
    }

    /*
        Utility functions End
     */

    return {
        // Start up start
        InitMap: initMap,
        ChangeView: changeView,
        // Start up end

        /***********************************/

        // Layer start
        ShowLayer: showLayer,
        ShowBaseLayer: showBaseLayer,
        HideLayer: hideLayer,
        GetLayerByName: getLayerByName,
        SetLayerOpacity: setLayerOpacity,
        GetLayerParams: getLayerParams,
        SetLayerSaturation: setLayerSaturation,
        SetLayerHue: setLayerHue,
        SetLayerBrightness: setLayerBrightness,
        SetLayerContrast: setLayerContrast,
        MoveLayerToIndex: moveLayerToIndex,
        GetLayerIndex: getLayerIndex,
        // Layer end

        /***********************************/

        // Export start
        RedrawMap: redrawMap,
        RenderSync: renderSync,
        ExportMap: exportMap,
        ActivateExport: activateExport,
        DeactivateExport: deactivateExport,
        // Export end

        /***********************************/

        // Feature Info start
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        GetInfoUrl: getFeatureInfoUrl,
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        ShowInfoMarker: showInfoMarker,
        SetHighlightStyle: setHighlightStyle,
        RemoveInfoMarker: removeInfoMarker,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate,
        // Feature Info end

        /***********************************/

        // Measure start
        ActivateMeasure: activateMeasure,
        DeactivateMeasure: deactivateMeasure,
        // Measure end

        /***********************************/

        // Utility start
        TransformBox: transformBox,
        ConvertGmlToGeoJson: convertGmlToGeoJson,
        ExtentToGeoJson: extentToGeoJson,
        AddZoom: addZoom,
        AddZoomSlider: addZoomSlider

        // Utility end
    };
};

BW.MapImplementation.OL3.Map.RENDERERS = {
    canvas: 'canvas',
    webgl: 'webgl'
};