/*global OpenLayers: false, proj4: false */

/**
    
    Utility function used to let a user draw a circle on the map and edit it
    by either dragging it or resizing it (depending on where the user clicks on
    the circle).

    Triggers a callback with an object that contains the center-point 
    (Lat/Lon) and radius (nautical miles) of the circle.

    Usage: 
        Init: 
            var circle = new BW.MapCore.CircleControl(
                theMap
                callbackFunction
            );

        activate: 
            circle.activate(); (enables draw and edit)
        
        deactivate: 
            circle.deactivate(); (disables draw and edit)
    );

**/


var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};

(function (ns) {
    'use strict';


    function meterToNauticalMiles(meters) {
        var metersPrNauticalMile = 1852;
        return Math.round((meters / metersPrNauticalMile) * 10) / 10;
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


    var ringStyle = {
        strokeColor: '#B80000',
        strokeWidth: 2,
        fillOpacity: 0.0,
    };


    var ringOverlayStyle = {
        strokeColor: '#B800FF',
        strokeWidth: 10,
        fillOpacity: 0.0,
        strokeOpacity: 0.0
    };


    var Drag = OpenLayers.Class(OpenLayers.Control.DragFeature, {

        moveFeature: function (pixel) {
            if (this.nomove) {
                this.events.triggerEvent('move', {xy: pixel});
            } else {
                OpenLayers.Control.DragFeature.prototype.moveFeature.apply(
                    this,
                    arguments
                );
            }
        },

        downFeature: function (pixel) {
            if (this.feature.geometry.CLASS_NAME === 'OpenLayers.Geometry.LineString') {
                this.nomove = true;
                this.events.triggerEvent('down', {xy: pixel});
            }
            this.lastPixel = pixel;
            this.onStart(this.feature, pixel);
        },

        upFeature: function (pixel) {
            if (this.nomove) {
                this.events.triggerEvent('up', {xy: pixel});
                this.nomove = false;
            }

            if (!this.over) {
                this.handlers.drag.deactivate();
            }
        }
    });


    ns.CircleControl = function (map, callback) {
        this.map = map;
        this.active = false;
        this.started = false;
        this.callback = callback;
        this.layer = new OpenLayers.Layer.Vector();

        this.dragControl = new Drag(
            this.layer,
            {
                onComplete: _.bind(this.circleModified, this)
            }
        );

        this.dragControl.events.on({
            down: _.bind(this.startEditDraw, this),
            up: _.bind(this.stopDraw, this),
            move: _.bind(this.move, this)
        });

        this.map.addControl(this.dragControl);
    };

    ns.CircleControl.prototype.activate = function () {
        if (!this.active) {
            this.active = true;
            this.map.addLayer(this.layer);
            this.map.events.register('click', this, this.click);

            if (this.centerPoint && this.radius) {
                this.sendCallback(this.centerPoint, this.radius);
            }
        }
    };

    ns.CircleControl.prototype.deactivate = function () {
        if (this.active) {
            this.active = false;
            this.map.removeLayer(this.layer);
            this.map.events.unregister('click', this, this.click);
        }
    };

    ns.CircleControl.prototype.startEditDraw = function (evt) {
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        this.draw();
    };

    ns.CircleControl.prototype.startDraw = function (evt) {
        console.log("start draw!");
        this.map.events.register('mousemove', this, this.move);
        this.point1 = this.map.getLonLatFromPixel(evt.xy);
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        this.draw();
    };

    ns.CircleControl.prototype.stopDraw = function (evt) {
        this.map.events.unregister('mousemove', this, this.move);
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        var coords = this.draw();
        this.map.events.unregister('click', this, this.click);
        this.dragControl.activate();
        this.sendCallback(coords.centerPoint, coords.radius);
    };

    ns.CircleControl.prototype.sendCallback = function (centerPoint, radius) {

        this.centerPoint = centerPoint;
        this.radius = radius;

        centerPoint = transformCoordTo4326(centerPoint);
        this.callback({
            Lon: centerPoint.lon,
            Lat: centerPoint.lat,
            Distance: meterToNauticalMiles(radius)
        });
    };

    ns.CircleControl.prototype.circleModified = function () {
        this.drawDragRing();
        var geom = this.feature.geometry;
        var centerPoint = geom.getCentroid();
        var bounds = geom.getBounds();
        var radius = (bounds.right - bounds.left) / 2;

        //get the "inner bounds" of the circle in order to re-establish point1
        var inner = OpenLayers.Geometry.Polygon.createRegularPolygon(
            centerPoint,
            radius,
            4
        ).getBounds();

        this.point1 = new OpenLayers.LonLat(inner.left, inner.top);
        this.sendCallback(centerPoint, radius);
    };

    ns.CircleControl.prototype.move = function (evt) {
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        this.draw();
    };

    ns.CircleControl.prototype.draw = function () {
        if (this.point1 && this.point2) {

            //sort the vertices
            var upper = Math.max(this.point1.lat, this.point2.lat);
            var lower = Math.min(this.point1.lat, this.point2.lat);
            var left = Math.min(this.point1.lon, this.point2.lon);
            var right = Math.max(this.point1.lon, this.point2.lon);

            var size = Math.max(
                Math.abs(upper - lower),
                Math.abs(right - left)
            );

            //figure out what goes where
            if (this.point1.lat < this.point2.lat) {
                upper = lower + size;
            } else {
                lower = upper - size;
            }
            if (this.point1.lon < this.point2.lon) {
                right = left + size;
            } else {
                left = right - size;
            }

            var centerPoint = new OpenLayers.Geometry.Point(
                left + (right - left) / 2,
                lower + (upper - lower) / 2
            );

            var radius = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2)) / 2;
            return this.drawRing(centerPoint, radius);
        }
    };

    ns.CircleControl.prototype.drawRing = function (centerPoint, radius) {

        var geom = OpenLayers.Geometry.Polygon.createRegularPolygon(
            centerPoint,
            radius,
            30
        );

        this.layer.removeAllFeatures();

        this.feature = new OpenLayers.Feature.Vector(
            geom,
            {},
            ringStyle
        );

        this.layer.addFeatures([this.feature]);
        this.drawDragRing();

        return {
            centerPoint: centerPoint,
            radius: radius
        };
    };

    ns.CircleControl.prototype.drawDragRing = function () {
        //this adds a completely transparent circle on the edge of the circle
        //used for resizing
        if (this.dragRing) {
            this.layer.removeFeatures([this.dragRing]);
        }

        this.dragRing =  new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.LineString(
                this.feature.geometry.components[0].components
            ),
            {},
            ringOverlayStyle
        );
        this.layer.addFeatures([this.dragRing]);
    };

    ns.CircleControl.prototype.click = function (evt) {
        this.started = !this.started;
        if (this.started) {
            this.startDraw(evt);
        } else {
            this.stopDraw(evt);
        }
    };

}(BW.MapCore));
