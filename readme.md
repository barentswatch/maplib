Barentswatch MapCore
====================

Dette er et javascript-bibliotek som inneholder kjernefunkjsonalitet for kart i Barentswatch. Biblioteket baserer seg på OpenLayers 2 og har i tillegg underscore.js som en avhengighet.

Biblioteket etterstreber å være *lettvekts*, *modularisert* og *gjenbrukbart*.

Oppsett
-------
    1. Installer node og npm (se http://howtonode.org/introduction-to-npm)
    2. Installer Grunt
    3. kjør npm install
    4. cd til js/
    5. kjør ''grunt'' for å bygge
    6. kjør ''grunt buster'' for å kjøre tester

Komponenter
-----------

MapConfig
---------

Hovedklassen er BW.MapCore.MapConfig, dette er en klasse som lar deg opprette et nytt kart på følgende måte:

    var map = new BW.MapCore.MapConfig('map', config);
    
Der der 'map' er IDen til et div-element og config en dict som i det minste må inneholde:
    
    var config = {
        baseLayers: [
                {id: 1, visible: true}
            ],
        baseLayerList: [
                {
                    id: 1,
                    protocol: 'WMTS',
                    name: 'Hovedkart Sjø',
                    url: 'http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?',
                    layerName: 'sjo_hovedkart2'
                }
        ]
    };

Dette lager et nytt kart med det gitte bakgrunnskartet, med default-parametere for resten av instillingene: 
    
    {
        bounds: [-2500000.0, 3500000.0, 3045984.0, 9045984.0],
        srs: 'EPSG:32633',
        maxResolution: 21664.0,
        numZoomLevels: 18,
        units: 'm',
        initPos: {x: 346108, y: 7432016},
        initZoom: 3
    }
    
For å legge til "overlays" må man definere disse (på samme måte som baseLayerList), enten ved å sette *overlayList* i config eller ved å kalle *setOverlayList()* med en lik liste. I tillegg må man sette *overlays* eller kalle *setOverlays()*. Eksempel:

        map.setOverlayList([
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
        ]).setOverlays([
            {id: 100, opacity: 0.7, visible: true},
            {id: 101, visible: true}
        ]);


CircleControl
-------------
Lar deg tegne en sirkel i kartet, se circle_demo.html        