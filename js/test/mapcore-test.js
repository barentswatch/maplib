(function () {
    "use strict";

    var assert = assert || buster.assertions.assert;
    var refute = refute || buster.assertions.refute;

    buster.testCase('Mapcore test', {

        setUp: function () {

            this.baseLayers = [
                {id: 1, visible: true}
            ];

            this.baseLayerList = [
                {
                    id: 1,
                    protocol: 'WMTS',
                    name: 'Hovedkart Sjø',
                    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                    layerName: 'sjo_hovedkart2'
                }
            ];

            this.overlayList = [
                {
                    id: 100,
                    protocol: 'WMS',
                    name: 'Grenser',
                    url: 'http://maps.imr.no/geoserver/wms?',
                    layerName: 'currents:atlantic_water',
                    tiled: false
                },
                {
                    id: 101,
                    protocol: 'WMS',
                    name: 'Fartøy med oljevernutstyr',
                    url: 'http://kart.kystverket.no/wms.aspx',
                    layerName: 'layer_452',
                    tiled: false
                }
            ];

            this.overlays = [
                {id: 100, opacity: 0.7, visible: true},
                {id: 101, visible: true}
            ];

            this.config = {
                baseLayers: this.baseLayers,
                baseLayerList: this.baseLayerList
            };
        },

        'Should be able to create a map with defaults': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            assert(map);
        },

        'Should get an OpenLayers Map': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            assert(map.map instanceof OpenLayers.Map);
        },

        'The OpenLayers map should have two layers': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            assert.equals(map.map.layers.length, 2);
        },

        'Should have an empty overlays collection': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            assert.equals(map.overlays.length, 0);
        },

        'Should a baseLayers collection with one layer': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            assert.equals(map.baseLayers.length, 1);
        },

        'Should be able to add new overlay layers': function () {            
            var map = new BW.MapCore.MapConfig('map', this.config);
            map.setOverlayList(this.overlayList).setOverlays(this.overlays);
            assert.equals(map.overlays.length, 2);
        },

        'Should be able to add new overlay layers in config': function () {            
            this.config.overlayList = this.overlayList;
            this.config.overlays = this.overlays;
            var map = new BW.MapCore.MapConfig('map', this.config);            
            assert.equals(map.overlays.length, 2);
        }

    });
}());