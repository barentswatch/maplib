var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};

(function (ns) {
    'use strict';

    function meterToNauticalMiles(meters) {
        var metersPrNauticalMile = 1852;
        return Math.round((meters / metersPrNauticalMile) * 10) / 10;
    }

    function nauticalMilesToMeter(nauticalMiles) {
        var metersPrNauticalMile = 1852;
        return nauticalMiles * metersPrNauticalMile;
    }

    function getMidpoint(line) {
        var x = (line.components[0].x + line.components[1].x) / 2;
        var y = (line.components[0].y + line.components[1].y) / 2;
        return new OpenLayers.Geometry.Point(x, y);
    }

    function transformCoordTo4326(coord) {
        var transformed = proj4(
            proj4.defs['EPSG:32633'],
            proj4.defs['EPSG:4326']
        ).forward([coord.x, coord.y]);
        return {
            lon: transformed[0],
            lat: transformed[1]
        };
    }

    function transformCoordFrom4326(coord) {
        var transformed = proj4(
            proj4.defs['EPSG:4326'],
            proj4.defs['EPSG:32633']
        ).forward([coord.x, coord.y]);
        return {
            x: transformed[0],
            y: transformed[1]
        };
    }

    var labelStyle = {
        label: '',
        fontColor: "#000000",
        fontSize: "14px",
        fontFamily: "Arial",
        labelAlign: "cm",
        labelOutlineColor: "white",
        labelOutlineWidth: 3
    };

    var circleStyle = {
        fillColor: "#ccc",
        fillOpacity: 0.4,
        strokeColor: "#B80000",
        strokeWidth: 0
    };

    var ringStyle = {
        strokeColor: "#B80000",
        strokeWidth: 2
    };

    var lineStyle = {
        strokeColor: "#B80000",
        strokeWidth: 2,
        strokeDashstyle: "longdash"
    };

    function polyFromExtent(extent) {

        var p1 = new OpenLayers.Geometry.Point(extent.left, extent.bottom);
        var p2 = new OpenLayers.Geometry.Point(extent.right, extent.bottom);
        var p3 = new OpenLayers.Geometry.Point(extent.right, extent.top);
        var p4 = new OpenLayers.Geometry.Point(extent.left, extent.top);
        var p5 = new OpenLayers.Geometry.Point(extent.left, extent.bottom);

        return new OpenLayers.Geometry.Polygon(
            new OpenLayers.Geometry.LinearRing([
                p1, p2, p3, p4, p5
            ])
        );
    }

    function ringFromPointAndRadius(point, radius) {
        return OpenLayers.Geometry.Polygon.createRegularPolygon(
            point,
            radius,
            30
        ).components[0];
    }

    function createPoint(lon, lat) {
        var point = transformCoordFrom4326({x: lon, y: lat});
        return new OpenLayers.Geometry.Point(point.x, point.y);
    }

    function createCircleAndRing(map, lon, lat, radius) {
        var circle = new OpenLayers.Feature.Vector(
            polyFromExtent(map.getExtent()),
            {},
            circleStyle
        );
        circle.geometry.components[1] = ringFromPointAndRadius(
            createPoint(lon, lat),
            nauticalMilesToMeter(radius)
        );

        var ring = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString(
                circle.geometry.components[1].components
            ),
            {},
            ringStyle
        );

        return [circle, ring];
    }

    ns.createAreaLayer = function (map, lon, lat, radius) {
        var layer = new OpenLayers.Layer.Vector();
        layer.addFeatures(createCircleAndRing(map, lon, lat, radius));
        return layer;
    };

    ns.CircleControl = function (map, callback) {
        this.map = map;
        this.active = false;
        this.started = false;
        this.callback = callback;
        this.layer = new OpenLayers.Layer.Vector();

        this.circle = new OpenLayers.Feature.Vector(
            polyFromExtent(map.getExtent()),
            {},
            circleStyle
        );
        this.ring = new OpenLayers.Feature.Vector(null, {}, ringStyle);
    };

    ns.CircleControl.prototype.activate = function (lon, lat, distance) {
        if (!this.active) {
            this.active = true;

            this.map.addLayer(this.layer);
            this.layer.addFeatures([this.circle, this.ring]);

            if (lon && lat && distance) {
                this.redrawCircle(
                    createPoint(lon, lat),
                    nauticalMilesToMeter(distance)
                );
                this.callback({
                    Lon: lon,
                    Lat: lat,
                    Distance: distance
                });
            }

            this.map.events.register("click", this, this.click);
            this.map.events.register("mousemove", this, this.move);
        }
    };

    ns.CircleControl.prototype.deactivate = function () {
        if (this.active) {
            this.active = false;
            this.map.removeLayer(this.layer);
            this.map.events.unregister("click", this, this.click);
            this.map.events.unregister("mousemove", this, this.move);
        }
    };

    ns.CircleControl.prototype.click = function (evt) {
        this.started = !this.started;
        var point = this.map.getLonLatFromPixel(evt.xy);

        if (this.started) {
            this.layer.removeAllFeatures();
            this.line = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString([
                    new OpenLayers.Geometry.Point(point.lon, point.lat),
                    new OpenLayers.Geometry.Point(point.lon, point.lat)
                ]),
                {},
                lineStyle
            );

            this.point = new OpenLayers.Feature.Vector(null, {}, labelStyle);
            this.updateCircle();
            this.layer.addFeatures([this.line]);
        } else {
            this.layer.removeFeatures([this.line, this.point]);
            var coords = transformCoordTo4326(this.line.geometry.components[0]);
            this.callback({
                Lon: coords.lon,
                Lat: coords.lat,
                Distance: meterToNauticalMiles(this.line.geometry.getLength())
            });
        }
    };

    ns.CircleControl.prototype.updateCircle = function () {
        var start = this.line.geometry.components[0];
        var radius = this.line.geometry.getLength();

        this.layer.removeFeatures([this.point]);
        this.redrawCircle(start, radius);

        this.point.geometry = getMidpoint(this.line.geometry);
        this.point.style.label = meterToNauticalMiles(radius) + ' nm';
        this.layer.drawFeature(this.point);

    };

    ns.CircleControl.prototype.redrawCircle = function (point, radius) {
        this.layer.removeFeatures([this.circle, this.ring]);
        this.circle.geometry.components[1] = ringFromPointAndRadius(
            point,
            radius
        );
        this.ring.geometry = new OpenLayers.Geometry.LineString(
            this.circle.geometry.components[1].components
        );
        this.layer.addFeatures([this.circle, this.ring]);
    };

    ns.CircleControl.prototype.move = function (evt) {
        if (this.started) {
            var point = this.map.getLonLatFromPixel(evt.xy);
            this.line.geometry.components[1] = new OpenLayers.Geometry.Point(
                point.lon,
                point.lat
            );
            this.layer.drawFeature(this.line);
            this.updateCircle();
        }
    };


}(BW.MapCore));
