var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Measure = function(eventHandler){
    var measureKey = ""; // Key for map event pointermove
    var currentFeature; // The current draw object
    var circleRadius; // Distance for the initial circle
    var circleFeature; // The circle feature
    var circleOverlay; // Overlay for the circle

    var drawInteraction; // global so we can remove it later
    var drawLayer; // Where the measure features are drawn. If this is not added to the map it still works, but the objects are removed after double click

    function activate(map){
        measureKey = map.on('pointermove', _mouseMoveHandler);
        _addInteraction(map);
        map.addLayer(drawLayer);
    }

    function deactivate(map){
        map.removeLayer(drawLayer);
        map.unByKey(measureKey);
        measureKey = "";
        map.removeInteraction(drawInteraction);
        map.removeOverlay(circleOverlay);
    }

    function _mouseMoveHandler () { // evt
        if (currentFeature) {
            var output;
            var geom = (currentFeature.getGeometry());
            if (geom instanceof ol.geom.Polygon) {
                //output =
                var polygonArea = _formatArea(geom);
                var lineLength = _formatPolygonLength(geom);
                var circleArea = _drawCircle(geom);
                output = new BW.Domain.MeasureResult(polygonArea, lineLength, circleArea);
            }
            eventHandler.TriggerEvent(BW.Events.EventTypes.MeasureMouseMove, output);
        }
    }

    function _drawCircle(geom){
        var circleCoordinates = geom.getCoordinates()[0];
        if (circleCoordinates.length == 2) {
            circleFeature.getGeometry().setRadius(circleRadius);
            return Math.PI * Math.pow(circleRadius, 2);
        }
        else{
            circleFeature.getGeometry().setRadius(0);
            return null;
        }
    }

    function _addInteraction(map) {
        circleOverlay = new ol.FeatureOverlay();
        map.addOverlay(circleOverlay);

        var source = new ol.source.Vector();

        drawLayer = new ol.layer.Vector({
            source: source,
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        color: '#ffcc33'
                    })
                })
            })
        });

        var type = 'Polygon';// (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
        drawInteraction = new ol.interaction.Draw({
            source: source,
            type: type
        });
        map.addInteraction(drawInteraction);

        drawInteraction.on('drawstart',
            function(evt) {
                currentFeature = evt.feature;

                // Start circle drawing
                var firstPoint = currentFeature.getGeometry().getCoordinates()[0][0];
                circleFeature = new ol.Feature(new ol.geom.Circle(firstPoint, 0));
                circleOverlay.addFeature(circleFeature);
            }, this);

        drawInteraction.on('drawend',
            function() { // evt
                currentFeature = null;
            }, this);


    }
    function _formatLength (coordinates) {
        var length = _getLength(coordinates);
        circleRadius = length;
        length = Math.round(length*100)/100;
        var output;
        if (length > 100) {
            output = (Math.round(length / 1000 * 100) / 100) +
            ' ' + 'km';
        } else {
            output = (Math.round(length * 100) / 100) +
            ' ' + 'm';
        }
        return output;
    }

    /*var formatLineLength = function(line){
        return formatLength(line.getCoordinates());
    };*/

    function _formatPolygonLength(polygon){
        return _formatLength(polygon.getCoordinates()[0]);
    }

    function _formatArea(polygon) {
        var area = polygon.getArea();
        var output;
        if (area > 10000) {
            output = (Math.round(area / 1000000 * 100) / 100) +
            ' ' + 'km<sup>2</sup>';
        } else {
            output = (Math.round(area * 100) / 100) +
            ' ' + 'm<sup>2</sup>';
        }
        return output;
    }

    function _getLength(coordinates){
        var length;
        // Assume at least one coodinate
        if(coordinates.length > 0){
            var stride = coordinates[0].length; // 2D or 3D
            var flatCoordinates = _flatternCoordinates(coordinates);
            length = _getFlatLength(flatCoordinates, 0, flatCoordinates.length, stride);
        }
        return length;
    }

    function _flatternCoordinates(coordinates){
        var flatCoordinates = [];
        for(var i = 0; i < coordinates.length; i++){
            var thisCoordinate = coordinates[i];
            for(var j = 0; j < thisCoordinate.length; j++){
                flatCoordinates.push(thisCoordinate[j]);
            }
        }
        return flatCoordinates;
    }

    function _getFlatLength(flatCoordinates, offset, end, stride) {
        var x1 = flatCoordinates[offset];
        var y1 = flatCoordinates[offset + 1];
        var length = 0;
        var i;
        for (i = offset + stride; i < end; i += stride) {
            var x2 = flatCoordinates[i];
            var y2 = flatCoordinates[i + 1];
            length += Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            x1 = x2;
            y1 = y2;
        }
        return length;
    }

    return {
        Activate: activate,
        Deactivate: deactivate
    };
};