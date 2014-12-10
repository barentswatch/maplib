var BW = BW || {};
BW.Map = BW.Map || {};
BW.Map.OL3 = BW.Map.OL3 || {};

BW.Map.OL3.FeatureInfo = function(){
    var highLightLayer = null;
    var highlightStyle = null;
    var infoKey = "";
    var boundingBox;

    function showHighlightedFeatures(features, map){
        _ensureHighlightLayer(map);
        clearHighlightedFeatures();
        var geoJsonParser = new ol.format.GeoJSON();
        for(var i = 0; i < features.length; i++){
            var feature = features[i];
            var mapFeature = geoJsonParser.readFeature(feature.geometryObject);
            mapFeature.getGeometry().transform(ol.proj.get(feature.crs), ol.proj.get(map.getView().getProjection().getCode()));
            highLightLayer.getSource().addFeature(mapFeature);
        }
    }

    function clearHighlightedFeatures(){
        var vectorSource = highLightLayer.getSource();
        vectorSource.clear();
    }

    function showInfoMarker(coordinate, element, map){
        var $element = $(element);
        var height = $element.height();
        var width = $element.width();
        var popup = new ol.Overlay({
            element: element,
            stopEvent: false,
            offset: [-width / 2, -height]
        });
        popup.setPosition(coordinate);
        map.addOverlay(popup);
    }

    function removeInfoMarker(element, map){
        var overlays = map.getOverlays().getArray();
        for(var i = 0; i < overlays.length; i++){
            var overlay = overlays[i];
            if(overlay.getElement() == element){
                map.removeOverlay(overlay);
            }
        }
    }

    function getFeatureInfoUrl(bwSubLayer, mapLayer, coordinate, view){
        var viewResolution = view.getResolution();

        var layerSource = mapLayer.getSource();
        var projection = view.getProjection();

        /*var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': bwSubLayer.featureInfo.getFeatureInfoFormat, 'feature_count': 10});
        url = decodeURIComponent(url);
        url = url.substring(url.lastIndexOf('?'), url.length);
        url = url.replace('?', '');
        url = encodeURIComponent(url);
        return bwSubLayer.url.replace('proxy/wms', 'proxy/') + url;*/

        var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': bwSubLayer.featureInfo.getFeatureInfoFormat, 'feature_count': 10});
        var decodedUrl = decodeURIComponent(url);
        var queryString = decodedUrl.substring(decodedUrl.lastIndexOf('?'), decodedUrl.length).replace('?', '');
        var queryStringEncoded = encodeURIComponent(queryString);
        return bwSubLayer.url.replace('proxy/wms', 'proxy/') + queryStringEncoded;
    }

    function activateInfoClick(callback, map){
        infoKey = map.on('singleclick', function(evt) {
            callback(evt.coordinate);
        });
    }

    function deactivateInfoClick(map){
        map.unByKey(infoKey);
        infoKey = "";
    }

    function activateBoxSelect(callback, map){
        boundingBox = new ol.interaction.DragBox({
            condition: ol.events.condition.always,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: [0,0,255,1]
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255,255,255,0.8)'
                })
            })
        });

        map.addInteraction(boundingBox);

        boundingBox.on('boxend', function(){
            callback(boundingBox.getGeometry().getExtent());
        });
    }

    function deactivateBoxSelect(map){
        map.removeInteraction(boundingBox);
    }

    function getFeaturesInExtent(bwSubLayer, extent, mapLayer){
        var source = mapLayer.getSource();
        var features = [];
        source.forEachFeatureInExtent(extent, function(feature){
            features.push(feature);
        });
        var geoJson = new ol.format.GeoJSON();
        var featureCollection = geoJson.writeFeatures(features);
        featureCollection.crs = _createCrsObjectForGeoJson(source.getProjection().getCode());
        return featureCollection;
    }

    function _createCrsObjectForGeoJson(crsCode){
        return new CrsObject(crsCode.split(':'));
    }

    function CrsObject(codes){
        this.type = codes[0];
        this.properties = new CrsProperties(codes[1]);
    }

    function CrsProperties(code){
        this.code = code;
    }

    function getExtentForCoordinate(coordinate, pixelTolerance, resolution){
        var toleranceInMapUnits = pixelTolerance * resolution;
        var n = coordinate[0];
        var e = coordinate[1];
        var minN = n - toleranceInMapUnits;
        var minE = e - toleranceInMapUnits;
        var maxN = n + toleranceInMapUnits;
        var maxE = e + toleranceInMapUnits;
        return [minN, minE, maxN, maxE];
    }

    function _ensureHighlightLayer(map){
        if(highLightLayer == null){

            if(highlightStyle == null){
                _setDefaultHighlightStyle();
            }

            var vectorSource = new ol.source.GeoJSON({
                projection: 'EPSG:4326',
                url: 'assets/mapConfig/testdata.json'
            });
            highLightLayer = new ol.layer.Vector({
                source: vectorSource,
                style: highlightStyle
            });
            map.addLayer(highLightLayer);
        }
        else {
            map.removeLayer(highLightLayer);
            map.addLayer(highLightLayer);
        }
    }

    function setHighlightStyle(style){
        highlightStyle = style;
        highLightLayer.setStyle(highlightStyle);
    }

    function _setDefaultHighlightStyle(){
        var defaultStyle = new BW.Map.OL3.Styles.Default();
        highlightStyle = defaultStyle.Styles;
    }

    return {
        ShowHighlightedFeatures: showHighlightedFeatures,
        ClearHighlightedFeatures: clearHighlightedFeatures,
        SetHighlightStyle: setHighlightStyle,
        ShowInfoMarker: showInfoMarker,
        RemoveInfoMarker: removeInfoMarker,
        GetFeatureInfoUrl: getFeatureInfoUrl,
        ActivateInfoClick: activateInfoClick,
        DeactivateInfoClick: deactivateInfoClick,
        ActivateBoxSelect: activateBoxSelect,
        DeactivateBoxSelect: deactivateBoxSelect,
        GetFeaturesInExtent: getFeaturesInExtent,
        GetExtentForCoordinate: getExtentForCoordinate
    };
};