/*global Backbone: false, ol: false*/

/*
    Provides functionality for mapping an openlayers vector layer and features to
    Backbone models and views.

    Usage:

    Create a new BW.FeatureModel (or a subclass) by passing it data that has a
    "geometry" field as a geoJSON geometry. ie:

    new BW.FeatureCollection([{
        "name": "myname",
        "geometry": {"type":"Point","coordinates":[10.0, 10.0]}
    }])

    The geometry field will be converted to a "feature"-attribute on the model,
    this is in fact an ol vector feature, and the geometry attribute will be unset.
    The created feature will also be extended to be able to pass Backbone-style events.

    The FeatureCollection also handles selects and hover events, and should be
    given two openlayers style obects in the options-dict:

    new BW.FeatureCollection(
        featureList,
        {
            featureStyle: styleForNormal,
            selectStyle: styleForSelected
        }
    );

    Expects the feature attribute to trigger the following events:
        - over
        - out
        - select
        - deselect

    These events changes the feature style and further triggers these events on
    the model, so that views can act accordingly.

    The FeatureCollection also provides a getLayer()-method, that returns an
    ol vector layer with a feature for all it's models.
*/

var BW = this.BW || {};
(function (ns) {
    'use strict';

    ns.FeatureModel = Backbone.Model.extend({
        initialize: function (data) {

            //la feature kunne trigge backbone-events
            _.extend(data.feature, Backbone.Events);

            //lytt på events fra feature
            this.get('feature').on('over', this.featureOver, this);
            this.get('feature').on('out', this.featureOut, this);
            this.get('feature').on('select', this.featureSelect, this);
            this.get('feature').on('deselect', this.featureDeselect, this);

            //Lytt på events fra seg selv
            this.on('over', this.highlightFeature, this);
            this.on('out', this.unhighlightFeature, this);
            this.on('select', this.selectFeature, this);
            this.on('deselect', this.deselectFeature, this);
        },

        featureOver: function () {
            this.trigger('over');
        },

        featureOut: function () {
            this.trigger('out');
        },

        featureSelect: function (feature) {
            this.trigger('select', feature);
        },

        featureDeselect: function (feature) {
            this.trigger('deselect', feature);
        },

        selectFeature: function () {
            this.get('feature').select = true;
            this.collection.getLayer().dispatchEvent('selectFeature');
        },

        deselectFeature: function () {
            this.get('feature').select = false;
            this.collection.getLayer().dispatchEvent('deselectFeature');
        },

        highlightFeature: function () {
            this.get('feature').setStyle(
                this.collection.options.hoverStyle
            );
        },

        unhighlightFeature: function () {
            this.get('feature').setStyle(
                this.collection.options.featureStyle
            );
        }

    });

    ns.FeatureCollection = Backbone.Collection.extend({

        model: ns.FeatureModel,

        reset: function (models, options) {
            var modifiedModels = _.map(models, this.parseGeom);
            var resetResult = Backbone.Collection.prototype.reset.apply(
                this,
                [modifiedModels, options]
            );
            this.populateLayer();
            return resetResult;
        },

        parseGeom: function (model) {
            var format = new ol.format.GeoJSON();
            if (!model.feature) {
                model.feature = new ol.Feature({
                    geometry: format.readGeometry(model.geometry)
                });
                delete model.geometry;
            }
            return model;
        },

        initialize: function (data, options) {
            options = options || {};
            this.options = options;
            this.on('select', this.featureSelected, this);
            this.createLayer();
        },

        featureSelected: function (selectedFeature) {
            this.each(function (model) {
                if (model.get('feature') !== selectedFeature) {
                    model.trigger('deselect', model.get('feature'));
                }
            });
        },

        createLayer: function () {
            this.vectorSource = new ol.source.Vector();
            this.layer = new ol.layer.Vector({
                source: this.vectorSource,
                style: this.options.featureStyle
            });
        },

        populateLayer: function () {
            this.each(function (model) {
                this.vectorSource.addFeature(model.get('feature'));
            }, this);
        },

        getLayer: function () {
            if (!this.layer) {
                this.createLayer();
            }
            return this.layer;
        }
    });

}(BW));

/*global Backbone:false */

/*
    Base Backbone view that can be used to provided map-list interactions as in Havnebase.

    Assumes that the model passed has a feature property (which should be an ol3 vector feature)

    Assumes that the model triggers the following events:
        over: for mouseover on marker
        out: for mouseout on marker
        select: for marker click
        deselect: for deselect marker

    This view triggers the same events on the models based on DOM-events (can be overridden in events).

    To use this class, subclass it and override the following methods:

        render
        highlight
        unhighlight
        select  (be sure to call super though)
        deselect (be sure to call super though)

        See ol3demo.html for example use
*/

var BW = this.BW || {};
(function (ns) {
    'use strict';

    ns.ListMapView = Backbone.View.extend({

        //lytt på dom-elementet
        events: {
            'mouseover': 'mouseover',
            'mouseout': 'mouseout',
            'click': 'click'
        },

        initialize: function () {

            //lytt på modellen
            this.model.on('over', this.highlight, this);
            this.model.on('out', this.unhighlight, this);
            this.model.on('select', this.select, this);
            this.model.on('deselect', this.deselect, this);

            this.selected = false;
        },

        render: function () {
            return this;
        },

        click: function () {
            if (this.selected) {
                this.model.trigger('deselect', this.model.get('feature'));
            } else {
                this.model.trigger('select', this.model.get('feature'));
            }
        },

        mouseover: function () {
            this.model.trigger('over');
        },

        mouseout: function () {
            this.model.trigger('out');
        },

        highlight: function () {
            return this;
        },

        unhighlight: function () {
            return this;
        },

        select: function () {
            this.selected = true;
        },

        deselect: function () {
            this.selected = false;
        }
    });

}(BW));
