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

        toggleSelected: function (feature) {
            this.selected = !this.selected;
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
            this.collection.getLayer().trigger('selectFeature');
        },

        deselectFeature: function () {
            this.get('feature').select = false;
            this.collection.getLayer().trigger('deselectFeature');
        },

        highlightFeature: function () {
            this.get('feature').over = true;
            this.collection.getLayer().dispatchEvent('overFeature');
        },

        unhighlightFeature: function () {
            this.get('feature').over = false;
            this.collection.getLayer().dispatchEvent('outFeature');
        }
    });

    ns.FeatureCollection = Backbone.Collection.extend({

        model: ns.FeatureModel,

        reset: function (models, options) {
            var modifiedModels = _.map(models, _.bind(this.parseGeom, this));
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
                console.log(model.feature);
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

        featuresDeselected: function () {
            this.trigger('allDeselected');
        },

        createLayer: function () {
            this.vectorSource = new ol.source.Vector();
            this.layer = new ol.layer.Vector({
                source: this.vectorSource,
                style: this.options.featureStyle
            });
            _.extend(this.layer, Backbone.Events);
            this.layer.on('alldeselect', this.featuresDeselected, this);
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
