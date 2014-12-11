var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};
BW.MapCore.Markers = function (imgUrl) {
    'use strict';

    function createStyleDict(color, size) {
        return {
            externalGraphic: imgUrl + '/pin-' + size + '-' + color + '.png',
            graphicWidth: 33,
            graphicHeight: 40,
            graphicYOffset: -40,
            graphicOpacity: 1
        };
    }

    function createStyle(color, size) {
        return new OpenLayers.Style(createStyleDict(color, size));
    }

    function createStyleMap(color, size, intent) {
        if (!intent) {
            intent = 'default';
        }
        var map = {};
        map[intent] = createStyle(color, size);
        return new OpenLayers.StyleMap(map);
    }

    return {
        createStyleMap: createStyleMap,
        createStyle: createStyle,
        createStyleDict: createStyleDict
    };
};
