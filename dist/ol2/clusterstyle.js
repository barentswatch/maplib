var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};
(function (ns) {
    'use strict';

    ns.createClusterStyleMap = function (color, singleSymbolizer) {

        var colors = {
            'black':    '#000000',
            'blue':     '#085382',
            'gray':     '#4C4C4E',
            'green':    '#118208',
            'orange':   '#F05A28',
            'red':      '#D72323',
            'sea':      '#0C969B',
            'sky':      '#76C2D2',
            'yellow':   '#F0BA28'
        };

        if (colors[color]) {
            color = colors[color];
        }

        var getRadius = function (numFeatures) {
            var max = 30;
            var min = 15;
            var radius = ((numFeatures - 2) / (20 - 2)) * (max - min) + min;
            if (radius > max) {
                return max;
            }
            if (radius < min) {
                return min;
            }
            return radius;
        };

        var clusterSymbolizer = {
            pointRadius: '${radius}',
            fillColor: color,
            fillOpacity: 1,
            strokeColor: color,
            strokeWidth: '${width}',
            strokeOpacity: 0.4,
            label : '${numFeatures}',
            fontColor: '#fff',
            fontSize: '12px',
            fontFamily: 'Courier New, monospace',
            fontWeight: 'bold',
            labelXOffset: 0,
            labelYOffset: -1,
            labelOutlineWidth: 0
        };

        var clusterRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO,
                property: 'count',
                value: 2,
            }),
            symbolizer: clusterSymbolizer
        });

        var markerRule = new OpenLayers.Rule({
            filter: new OpenLayers.Filter.Comparison({
                type: OpenLayers.Filter.Comparison.EQUAL_TO,
                property: 'count',
                value: 1,
            }),
            symbolizer: singleSymbolizer
        });
        var style = new OpenLayers.Style();
        style.addRules([clusterRule, markerRule]);
        style.context = {
            width: function (feature) {
                if (feature.cluster) {
                    return getRadius(feature.cluster.length) / 3;
                }
                return 2;
            },
            radius: function (feature) {
                if (feature.cluster) {
                    return getRadius(feature.cluster.length);
                }
                return 2;
            },
            numFeatures: function (feature) {
                return feature.cluster.length;
            }
        };

        var styleMap =  new OpenLayers.StyleMap({
            'default': style,
            'select': {
                strokeOpacity: 1
            }
        });
        return styleMap;

    };

}(BW.MapCore));
