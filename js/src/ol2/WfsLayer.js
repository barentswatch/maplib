var BW = this.BW || {};
BW.MapCore = BW.MapCore || {};

(function (ns) {
    'use strict';

    /*
    Mapping of WFS features to a Backbone Collection and model.
    Supports fetching of data as GeoJSON via WFS (using JSONP).
    */


    function createWFSParameters(typeName, callback) {
        return {
            service: 'WFS',
            version: '2.0',
            request: 'GetFeature',
            typeName: typeName,
            outputFormat: 'text/javascript',
            format_options: 'callback:' + callback,
            SrsName: 'EPSG:32633'
        };
    }


    function getWFSLayer(geoserverUrl, layername, callback, errorCallback) {
        var cbName = 'get' + layername.replace(':', '_');
        var parameters = createWFSParameters(
            layername,
            cbName
        );
        var url = geoserverUrl + $.param(parameters);

        if ($.jsonp) {
            $.jsonp({
                url: url,
                callback: cbName,
                success: callback,
                error: errorCallback
            });
        } else {
            console.warn('jQuery Jsonp-plugin not found, will not handle errors!');
            $.ajax({
                url: url,
                dataType: 'jsonp',
                jsonpCallback: cbName,
                success: callback
            });
        }
    }


    ns.FeatureModel = Backbone.Model.extend({

        redrawFeature: function (intent) {
            var feature = this.get('feature');
            if (feature.layer) {
                feature.layer.drawFeature(feature, intent);
                feature.renderIntent = intent;
                return true;
            }
            return false;
        },

        intersects: function (extent) {
            return extent.intersectsBounds(
                this.get('feature').geometry.getBounds(),
                true
            );
        }
    });


    ns.WFSCollection = Backbone.Collection.extend({

        model: ns.FeatureModel,

        initialize: function (features, options) {
            this.layername = options.layername;
            this.serverUrl = options.serverUrl;
            _.bindAll(this, 'dataFetched', 'dataError');

            this.createLayer(options);
            this.on('reset', this.resetLayer, this);
        },

        createLayer: function (options) {

            var layerOptions = options.layerOptions || {};
            this.layer = new OpenLayers.Layer.Vector(
                this.layername,
                layerOptions
            );
        },

        getData: function () {
            getWFSLayer(
                this.serverUrl,
                this.layername,
                this.dataFetched,
                this.dataError
            );
            return this;
        },

        dataFetched: function (data) {
            var format = new OpenLayers.Format.GeoJSON();

            var list = _.map(data.features, function (feature) {
                var modelData = _.extend({id: feature.id}, feature.properties);
                var geom = format.read(feature.geometry)[0];
                geom.id = feature.id;
                modelData.feature = geom;
                return modelData;
            });

            this.reset(list);
        },

        dataError: function () {
            this.trigger('loadError');
        }

    });

}(BW.MapCore));