var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.FeatureInfo = function(){
    var highLightLayer = null;
    var highlightStyle = null;
    var infoKey = "";
    var boundingBox;
    var infoMarkerOverlay;

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
        var infoMarkerOverlay = new ol.Overlay({
            element: element,
            stopEvent: false,
            offset: [-width / 2, -height]
        });
        infoMarkerOverlay.setPosition(coordinate);
        map.addOverlay(infoMarkerOverlay);
    }

    function removeInfoMarker(element, map){
        map.removeOverlay(infoMarkerOverlay);
    }

    function getFeatureInfoUrl(bwSubLayer, mapLayer, coordinate, view){
        var viewResolution = view.getResolution();

        var layerSource = mapLayer.getSource();
        var projection = view.getProjection();

        var url = layerSource.getGetFeatureInfoUrl(coordinate, viewResolution, projection, {'INFO_FORMAT': bwSubLayer.featureInfo.getFeatureInfoFormat, 'feature_count': 10});
        var decodedUrl = decodeURIComponent(url);
        var queryString = decodedUrl.substring(decodedUrl.lastIndexOf('?'), decodedUrl.length).replace('?', '');
        return bwSubLayer.url + queryString;
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
                // this is bogus, just to get the source initialized, can for sure be done a lot more appropriate.
                object: {
                    "type":"FeatureCollection",
                    "totalFeatures":1,
                    "features":[
                        {
                            "type":"Feature",
                            "id":"thc.1",
                            "geometry":
                            {
                                "type":"Point",
                                "coordinates":[21.7495,71.721]},
                            "geometry_name":"the_geom",
                            "properties":
                            {
                                "Year":2003
                            }
                        }
                    ],
                    "crs":
                    {
                        "type":"EPSG",
                        "properties":
                        {
                            "code":"4326"
                        }
                    }
                }
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
        var defaultStyle = new BW.MapImplementation.OL3.Styles.Default();
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