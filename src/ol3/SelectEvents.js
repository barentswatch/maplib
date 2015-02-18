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

        function triggerAllDeselect() {
            if (features.getLength() === 0) {
                layer.trigger('all' + off);
            }
        }

        features.on('change:length', function () {
            if (features.getLength() > 0) {
                var sel = features.getArray()[0];
                if (sel !== selectedHere) {
                    selectedHere = sel;
                    selectedHere.trigger(on, selectedHere);
                }
            } else {
                layer.getSource().forEachFeature(function (e) {
                    e.trigger(off, e);
                });
                selectedHere = null;
            }
            //if check length after 100 ms to see if no new ones has been added
            setTimeout(triggerAllDeselect, 100);
        });

        layer.on(off + 'Feature', function () {
            layer.getSource().forEachFeature(function (e) {
                if (!e[on]) {
                    features.remove(e);
                }
            });
        });

        layer.on(on + 'Feature', function () {
            layer.getSource().forEachFeature(function (e) {
                if (e[on] && e !== selectedHere) {
                    features.push(e);
                }
            });
        });
    }


    ns.registerHoverEvents = function (map, layer, hightlightStyle) {
        var on = 'over';
        var off = 'out';
        var condition = ol.events.condition.mouseMove;
        registerSelectEvents(map, layer, hightlightStyle, condition, on, off);
    };


    ns.registerClickEvents = function (map, layer, selectStyle) {
        var on = 'select';
        var off = 'deselect';
        var condition = ol.events.condition.click;
        registerSelectEvents(map, layer, selectStyle, condition, on, off);
    };


}(BW.SelectEvents));
