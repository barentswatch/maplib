var BW = BW || {};
BW.MapModel = BW.MapModel || {};
BW.MapModel.Map = BW.MapModel.Map || {};
BW.MapModel.FeatureInfo = function (mapInstance, httpHelper, eventHandler, featureParser) {
  var infoMarker;
  var infoMarkerPath = 'assets/img/pin-md-orange.png';
  var useInfoMarker = false;
  var pixelTolerance = 5;
  function _trigStartGetInfoRequest(layersToRequest) {
    var responseFeatureCollections = _createResponseFeatureCollections(layersToRequest);
    eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoStart, responseFeatureCollections);
  }
  function _createResponseFeatureCollections(layersToRequest) {
    var responseFeatureCollections = [];
    for (var i = 0; i < layersToRequest.length; i++) {
      var layerToRequest = layersToRequest[i];
      var responseFeatureCollection = new BW.MapModel.Parsers.LayerResponse();
      responseFeatureCollection.id = layerToRequest.id;
      responseFeatureCollection.isLoading = true;
      responseFeatureCollections.push(responseFeatureCollection);
    }
    return responseFeatureCollections;
  }
  function _handleGetInfoRequest(url, subLayer) {
    var callback = function (data) {
      _handleGetInfoResponse(subLayer, data);
    };
    httpHelper.get(url).success(callback);
  }
  function _handleGetInfoResponse(subLayer, result) {
    var parsedResult;
    var exception;
    try {
      parsedResult = featureParser.Parse(result);
    } catch (e) {
      exception = e;
    }
    var responseFeatureCollection = new BW.MapModel.Parsers.LayerResponse();
    responseFeatureCollection.id = subLayer.id;
    responseFeatureCollection.isLoading = false;
    responseFeatureCollection.features = parsedResult;
    responseFeatureCollection.exception = exception;
    eventHandler.TriggerEvent(BW.Events.EventTypes.FeatureInfoEnd, responseFeatureCollection);
  }
  function _getSupportedFormatsForService(bwSubLayer, service, callback) {
    var parseCallback = function (data) {
      var jsonCapabilities = parseGetCapabilities(data);
      callback(jsonCapabilities);
    };
    var wmsUrl = bwSubLayer.url.replace('proxy/wms', 'proxy/');
    var getCapabilitiesUrl;
    var questionMark = '?';
    var urlHasQuestionMark = wmsUrl.indexOf(questionMark) > -1;
    if (!urlHasQuestionMark) {
      wmsUrl = wmsUrl + encodeURIComponent(questionMark);
    }
    var request = 'SERVICE=' + service + '&REQUEST=GETCAPABILITIES';
    if (bwSubLayer.source === BW.Domain.SubLayer.SOURCES.proxyWms || bwSubLayer.source == BW.Domain.SubLayer.SOURCES.proxyWmts) {
      request = encodeURIComponent(request);
    }
    getCapabilitiesUrl = wmsUrl + request;
    httpHelper.get(getCapabilitiesUrl).success(parseCallback);
  }
  function parseGetCapabilities(getCapabilitiesXml) {
    var parser = new ol.format.WMSCapabilities();
    var result = parser.read(getCapabilitiesXml);
    return result;
  }
  function handlePointSelect(coordinate, layersSupportingGetFeatureInfo) {
    if (useInfoMarker === true) {
      _showInfoMarker(coordinate);
    }
    _trigStartGetInfoRequest(layersSupportingGetFeatureInfo);
    for (var i = 0; i < layersSupportingGetFeatureInfo.length; i++) {
      var subLayer = layersSupportingGetFeatureInfo[i];
      switch (subLayer.source) {
      case BW.Domain.SubLayer.SOURCES.wmts:
      case BW.Domain.SubLayer.SOURCES.wms:
      case BW.Domain.SubLayer.SOURCES.proxyWms:
      case BW.Domain.SubLayer.SOURCES.proxyWmts:
        _sendGetFeatureInfoRequest(subLayer, coordinate);
        break;
      case BW.Domain.SubLayer.SOURCES.vector:
        var features = mapInstance.GetFeaturesInExtent(subLayer, mapInstance.GetExtentForCoordinate(coordinate, pixelTolerance));
        _handleGetInfoResponse(subLayer, features);
        break;
      }
    }
  }
  function _sendGetFeatureInfoRequest(subLayer, coordinate) {
    var infoUrl = mapInstance.GetInfoUrl(subLayer, coordinate);
    _handleGetInfoRequest(infoUrl, subLayer);
  }
  function getSupportedGetFeatureInfoFormats(bwSubLayer, callback) {
    var service = 'WMS';
    var getFormatCallback = function (jsonCapabilities) {
      var formats = jsonCapabilities.Capability.Request.GetFeatureInfo.Format;
      callback(formats);
    };
    _getSupportedFormatsForService(bwSubLayer, service, getFormatCallback);
  }
  function handleBoxSelect(boxExtent, layersSupportingGetFeature) {
    _trigStartGetInfoRequest(layersSupportingGetFeature);
    for (var i = 0; i < layersSupportingGetFeature.length; i++) {
      var subLayer = layersSupportingGetFeature[i];
      switch (subLayer.source) {
      case BW.Domain.SubLayer.SOURCES.wmts:
      case BW.Domain.SubLayer.SOURCES.wms:
      case BW.Domain.SubLayer.SOURCES.proxyWms:
      case BW.Domain.SubLayer.SOURCES.proxyWmts:
        _sendBoxSelectRequest(subLayer, boxExtent);
        break;
      case BW.Domain.SubLayer.SOURCES.vector:
        var features = mapInstance.GetFeaturesInExtent(subLayer, boxExtent);
        _handleGetInfoResponse(subLayer, features);
        break;
      }
    }
  }
  function _sendBoxSelectRequest(bwSubLayer, boxExtent) {
    var infoUrl = _getFeatureUrl(bwSubLayer, boxExtent);
    _handleGetInfoRequest(infoUrl, bwSubLayer);
  }
  function _getFeatureUrl(bwSubLayer, boxExtent) {
    var crs = bwSubLayer.featureInfo.getFeatureCrs;
    var adaptedExtent = mapInstance.TransformBox(bwSubLayer.coordinate_system, bwSubLayer.featureInfo.getFeatureCrs, boxExtent);
    var url = 'service=WFS&request=GetFeature&typeName=' + bwSubLayer.name + '&srsName=' + crs + '&outputFormat=' + bwSubLayer.featureInfo.getFeatureFormat + '&bbox=' + adaptedExtent;
    url = decodeURIComponent(url);
    url = url.substring(url.lastIndexOf('?'), url.length);
    url = url.replace('?', '');
    url = encodeURIComponent(url);
    return bwSubLayer.url.replace('proxy/wms', 'proxy/') + url;
  }
  function getSupportedGetFeatureFormats(bwSubLayer, callback) {
    var service = 'WFS';
    var getFormatCallback = function (jsonCapabilities) {
      var formats = jsonCapabilities.Capability.Request.GetFeature.Format;
      callback(formats);
    };
    _getSupportedFormatsForService(bwSubLayer, service, getFormatCallback);
  }
  function createDefaultInfoMarker() {
    infoMarker = document.createElement('img');
    infoMarker.src = infoMarkerPath;
    _hideInfoMarker();
    _addInfoMarker();
  }
  function _showInfoMarker(coordinate) {
    setInfoMarker(infoMarker, true);
    infoMarker.style.visibility = 'visible';
    mapInstance.ShowInfoMarker(coordinate, infoMarker);
  }
  function setInfoMarker(element, removeCurrent) {
    if (useInfoMarker === true) {
      if (removeCurrent === true) {
        mapInstance.RemoveInfoMarker(infoMarker);
        _hideInfoMarker();
      }
      infoMarker = element;
      _addInfoMarker();
    }
  }
  function _addInfoMarker() {
    document.body.appendChild(infoMarker);
    useInfoMarker = true;
  }
  function removeInfoMarker() {
    setInfoMarker(infoMarker, true);
  }
  function _hideInfoMarker() {
    infoMarker.style.visibility = 'hidden';
  }
  function setInfoMarkerPath(path) {
    infoMarkerPath = path;
  }
  return {
    HandlePointSelect: handlePointSelect,
    HandleBoxSelect: handleBoxSelect,
    CreateDefaultInfoMarker: createDefaultInfoMarker,
    SetInfoMarker: setInfoMarker,
    RemoveInfoMarker: removeInfoMarker,
    GetSupportedGetFeatureInfoFormats: getSupportedGetFeatureInfoFormats,
    GetSupportedGetFeatureFormats: getSupportedGetFeatureFormats,
    SetInfoMarkerPath: setInfoMarkerPath
  };
};