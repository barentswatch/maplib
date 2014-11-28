/*
    BW.registerHoverEvents registers hover/click events on a given vector layer on a given map.
    The events are triggered as Backbone events, so it's assumed that prevoius code has done
    _.extend(feature, Backbone.events);

    This code does not change style or anything else, just triggers the "on" and "off" events.

    See ol3demo.html for example use.
*/

var BW = this.BW || {};
BW.SelectEvents = BW.SelectEvents || {};
(function (ns) {
    'use strict';

    function registerSelectEvents(condition, map, layer, on, off) {
        $(map.getViewport()).on(condition, function (evt) {
            var pixel = map.getEventPixel(evt.originalEvent);

            var features = layer.getSource().getFeatures();
            var selected  = _.find(features, function (feature) {
                return (feature[on] === true);
            });

            var feature = map.forEachFeatureAtPixel(pixel, function (feature, fLayer) {
                if (fLayer === layer) {
                    return feature;
                }
            });
            if (selected) {
                map.getTarget().style.cursor = '';
                selected[on] = false;
                selected.trigger(off, selected);
            }

            if (feature && feature !== selected) {
                map.getTarget().style.cursor = 'pointer';
                feature[on] = true;
                feature.trigger(on, feature);
            }
        });
    }


    ns.registerHoverEvents = function (map, layer) {
        //TODO when https://github.com/openlayers/ol3/pull/2965 gets merged
        //to ol3 master and released we should rewrite this to work in the same
        //fashion as registerClickEvents (using a ol.events.condition.mouseMove
        // condition with a Select interaction. Then we can drop all style-
        //related stuff in FeatureCollection.js
        registerSelectEvents('mousemove', map, layer, 'over', 'out');
    };


    ns.registerClickEvents = function (map, layer, selectStyle) {

        var selectClick = new ol.interaction.Select({
            condition: ol.events.condition.click,
            layers: [layer],
            style: selectStyle
        });
        map.addInteraction(selectClick);
        var features = selectClick.getFeatures();
        var selectedHere = null;

        features.on('change:length', function (e) {
            if (features.getLength() > 0) {
                var sel = features.getArray()[0];
                if (sel !== selectedHere) {
                    selectedHere = sel;
                    selectedHere.trigger('select', selectedHere);
                }
            } else {
                layer.getSource().forEachFeature(function (e) {
                    e.trigger('deselect', e);
                });
                selectedHere = null;
            }
        });

        layer.on('deselectFeature', function (e) {
            layer.getSource().forEachFeature(function (e) {
                if (!e.select) {
                    features.remove(e);
                }
            });
        });

        layer.on('selectFeature', function () {
            layer.getSource().forEachFeature(function (e) {
                if (e.select && e !== selectedHere) {
                    features.push(e);
                }
            });
        })
    };

}(BW.SelectEvents));
