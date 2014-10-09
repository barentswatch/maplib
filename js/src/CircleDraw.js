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
                callbackFunction,
                initData
            );

            Where initData is a an optional pojo in the form of 
            {
                Lon: longitude in WGS84,
                Lat: latitude in WGS84,
                Distance: radius in nautical miles
            }

        show: 
            circle.show(); shows the circle but does not enable edit            

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


    function nauticalMilesToMeter(nauticalMiles) {
        var metersPrNauticalMile = 1852;
        return nauticalMiles * metersPrNauticalMile;
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


    //used to draw the ring itself
    var ringStyle = {
        strokeColor: '#B80000',
        strokeWidth: 2,
        fillOpacity: 0.0,
    };


    //used to draw an invisible, thick, line on the circumference of the ring to 
    //allow for easy resize
    var ringOverlayStyle = {
        strokeColor: '#B800FF',
        strokeWidth: 10,
        fillOpacity: 0.0,
        strokeOpacity: 0.0
    };


    function getGeomType(feature) {
        if (!feature.geometry) {
            return null;
        }
        return feature.geometry.CLASS_NAME.replace('OpenLayers.Geometry.', '');
    }


    function polyContainsLonLat(feature, lonlat) {
        if (getGeomType(feature) !== 'Polygon') {
            return false;
        }
        var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
        return feature.geometry.containsPoint(point);
    }

    /**
        Override the DragFeature control to allow for resize when clicking the 
        circumference linestring of a polygon feature. The circumference line
        is added in ns.CircleControl
    **/
    var Drag = OpenLayers.Class(OpenLayers.Control.DragFeature, {

        moveFeature: function (pixel) {
            if (this.nomove) {
                //tell other control about resize
                this.events.triggerEvent('move', {xy: pixel});
            } else {
                //handle drag as normal                
                OpenLayers.Control.DragFeature.prototype.moveFeature.apply(
                    this,
                    arguments
                );
            }
        },

        downFeature: function (pixel) {

            //if it's the circumference we want to shortcut the drag option
            //and tell the other control that we now are in "resize mode"
            if (getGeomType(this.feature) === 'LineString') {
                this.nomove = true;
                this.events.triggerEvent('down', {xy: pixel});
            }
            this.lastPixel = pixel;
            this.onStart(this.feature, pixel);
        },

        upFeature: function (pixel) {

            //if we are in resize mode we have to stop that
            if (this.nomove) {

                // "deselect" the line feature
                this.outFeature(this.feature);

                //find out if we are over a polygon feature, if so, "select" it
                var point = this.map.getLonLatFromPixel(pixel);
                var i, length, feature;
                for (i = 0, length = this.layer.features.length; i < length; i++) {
                    feature = this.layer.features[i];
                    polyContainsLonLat(feature, point);
                    if (polyContainsLonLat(feature, point)) {
                        this.overFeature(feature);
                        break;
                    }
                }

                //tell other control to stop resize
                this.events.triggerEvent('up', {xy: pixel});
                this.nomove = false;
            }
            if (!this.over) {
                this.handlers.drag.deactivate();
            }
        }
    });


    ns.CircleControl = function (map, callback, initData) {
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
            move: _.bind(this.move, this),
            drag: _.bind(this.updateShadow, this)
        });

        this.map.addControl(this.dragControl);


        if (initData) {
            this.setInitData(initData);
        }
    };

    ns.CircleControl.prototype.setInitData = function (initData) {
        this.centerPoint = transformCoordFrom4326({
            x: initData.Lon,
            y: initData.Lat
        });
        this.radius = nauticalMilesToMeter(initData.Distance);
    };

    ns.CircleControl.prototype.show = function () {
        if (this.centerPoint && this.radius) {
            this.map.addLayer(this.layer);
            this.drawRing(this.centerPoint, this.radius);
        }
    };

    ns.CircleControl.prototype.activate = function () {
        if (!this.active) {
            this.active = true;
            this.map.addLayer(this.layer);
            this.map.events.register('click', this, this.click);
            if (this.centerPoint && this.radius) {
                this.drawRing(this.centerPoint, this.radius);
                this.sendCallback(this.centerPoint, this.radius);
                this.dragControl.activate();
            }

        }
    };

    ns.CircleControl.prototype.removeLayer = function () {
        this.feature = null;
        if (this.layer) {
            this.layer.removeAllFeatures();
            if (this.layer.map) {
                this.map.removeLayer(this.layer);
            }
        }
    };

    ns.CircleControl.prototype.deactivate = function () {
        if (this.active) {
            this.active = false;
            this.removeLayer();
            this.map.events.unregister('click', this, this.click);
            this.dragControl.deactivate();
        }
    };

    ns.CircleControl.prototype.startEditDraw = function (evt) {
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        //set the start point to a point mirrored across the center point from point1
        var point = this.feature.geometry.getCentroid();
        var deltax = point.x - this.point2.lon;
        var deltay = point.y - this.point2.lat;
        var newPoint = new OpenLayers.Geometry.Point(point.x + deltax, point.y + deltay);
        this.point1 = new OpenLayers.LonLat(newPoint.x, newPoint.y);
    };

    ns.CircleControl.prototype.startDraw = function (evt) {
        this.map.events.register('mousemove', this, this.move);
        this.point1 = this.map.getLonLatFromPixel(evt.xy);
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        this.draw();
    };

    ns.CircleControl.prototype.stopDraw = function (evt) {
        this.map.events.unregister('mousemove', this, this.move);
        this.point2 = this.map.getLonLatFromPixel(evt.xy);
        this.map.events.unregister('click', this, this.click);
        this.dragControl.activate();

        var coords = this.p;
        if (coords) {
            this.sendCallback(coords.centerPoint, coords.radius);
        }
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
        this.p = this.draw();
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

        this.updateShadow();
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

    ns.CircleControl.prototype.updateShadow = function () {
        //console.log('update Shadow');
    };

}(BW.MapCore));
