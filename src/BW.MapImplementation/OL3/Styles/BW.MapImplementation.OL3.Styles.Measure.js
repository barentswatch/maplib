var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};
BW.MapImplementation.OL3.Styles = BW.MapImplementation.OL3.Styles || {};

BW.MapImplementation.OL3.Styles.Measure = function(){
    var styles = function(){
        return new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.8)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        });
    };

    return {
        Styles: styles
    };
};