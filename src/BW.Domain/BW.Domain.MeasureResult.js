var BW = BW || {};
BW.Domain = BW.Domain || {};

BW.Domain.MeasureResult = function(polygonArea, edgeLength, circleArea){
    var pa = polygonArea;
    var el = edgeLength;
    var ca = circleArea;

    function getPolygonArea(){
        return pa;
    }

    function getEdgeLength(){
        return el;
    }

    function getCircleArea(){
        return ca;
    }

    function getParsedResult(){
        return 'Polygon area: ' + getPolygonArea() + '<br>Length: ' + getEdgeLength() + '<br>Circle area: ' + getCircleArea();
    }

    return {
        PolygonArea: getPolygonArea,
        EdgeLength: getEdgeLength,
        CircleArea: getCircleArea,
        GetParsedResult: getParsedResult
    };
};
