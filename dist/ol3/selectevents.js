/*global ol:false */
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

    function registerSelectEvents(map, layer, style, condition, on, off) {
        var interaction = new ol.interaction.Select({
            condition: condition,
            layers: [layer],
            style: style
        });
        map.addInteraction(interaction);
        var features = interaction.getFeatures();
        var selectedHere = null;

        features.on('change:length', function () {
            if (features.getLength() > 0) {
                var sel = features.getArray()[0];
                sel.trigger(on, sel);
                sel.set('selected', true);
            } else {
                layer.getSource().forEachFeature(function (e) {
                    e.trigger(off, e);
                });
            }
        });
        return interaction;
    }

    ns.registerHoverEvents = function (map, layer, hightlightStyle) {
        var on = 'over';
        var off = 'out';
        var condition = ol.events.condition.pointerMove;
        return registerSelectEvents(map, layer, hightlightStyle, condition, on, off);
    };

    ns.registerClickEvents = function (map, layer, selectStyle) {
        var on = 'select';
        var off = 'deselect';
        var condition = ol.events.condition.click;
        return registerSelectEvents(map, layer, selectStyle, condition, on, off);
    };


}(BW.SelectEvents));
