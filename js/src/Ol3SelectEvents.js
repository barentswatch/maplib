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
        registerSelectEvents('mousemove', map, layer, 'over', 'out');
    };


    ns.registerClickEvents = function (map, layer) {
        registerSelectEvents('click', map, layer, 'select', 'deselect');
    };

}(BW.SelectEvents));
