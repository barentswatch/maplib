var BW = BW || {};
BW.Repository = BW.Repository || {};

BW.Repository.StaticRepository = function() {
    var mapConfig = new BW.Repository.MapConfig({
        numZoomLevels: 18,
        newMaxRes: 21664.0,
        renderer: BW.Map.OL3.Map.RENDERERS.canvas,
        center: [-20617, 7661666],
        zoom: 4,
        coordinate_system: "EPSG:32633",
        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
        extentunits: 'm',
        layers:[
            new BW.Domain.Layer({
                name: 'Hovedkart Sjø',
                visibleOnLoad: true,
                isBaseLayer: true,
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'sjo_hovedkart2',
                        source: BW.Domain.SubLayer.SOURCES.wmts,
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Havbunn Grunnkart',
                visibleOnLoad: false,
                isBaseLayer: true,
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'havbunn_grunnkart',
                        source: BW.Domain.SubLayer.SOURCES.wmts,
                        url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Norskehavet',
                visibleOnLoad: false,
                category:"Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_norskehavet',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Nordsjøen',
                visibleOnLoad: false,
                category:"Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_nordsjoen',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Forvaltningsplanområde Barentshavet',
                visibleOnLoad: false,
                category: "Kategori 1",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'forvaltningsplanomrader_hav:fp_barentshavet',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            }),
            new BW.Domain.Layer({
                name: 'Grenser',
                visibleOnLoad: false,
                category:"Kategori 2",
                subLayers: [
                    new BW.Domain.SubLayer({
                        name: 'fp_barentshavet_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    }),
                    new BW.Domain.SubLayer({
                        name: 'fp_norskehavet_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    }),
                    new BW.Domain.SubLayer({
                        name: 'fp_nordsjoen_grenser',
                        source: BW.Domain.SubLayer.SOURCES.wms,
                        url: 'http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms',
                        format: BW.Domain.SubLayer.FORMATS.imagepng,
                        coordinate_system: 'EPSG:32633',
                        extent: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
                        extentUnits: 'm'
                    })
                ]
            })

        ]
    });

    function _getMapConfig(){
        return mapConfig;
    }

    return {
        GetMapConfig: _getMapConfig
    };
};