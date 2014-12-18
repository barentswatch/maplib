var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.Category=function(a){for(var b={catId:-1,name:"",isOpen:!1,parentId:-1,subCategories:[],bwLayers:[],isAllLayersSelected:!1},c=$.extend({},b,a),d=[],e=0;e<a.subCategories.length;e++)d.push(new BW.Domain.Category(a.subCategories[e]));return c.subCategories=d,c};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.FeatureInfo=function(a){var b={supportsGetFeatureInfo:!0,getFeatureInfoFormat:"application/json",getFeatureInfoCrs:"",supportsGetFeature:!0,getFeatureBaseUrl:"",getFeatureFormat:"application/json",getFeatureCrs:"EPSG:4326"},c=$.extend({},b,a);return c};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.FeatureResponse=function(){return{geometryObject:"",crs:"",attributes:[]}};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.Layer=function(a){for(var b={subLayers:[],name:"",categoryId:0,visibleOnLoad:!0,isVisible:!1,id:(new BW.Utils.Guid).newGuid(),isBaseLayer:!1,previewActive:!1,opacity:1,mapLayerIndex:-1,legendGraphicUrls:[],selectedLayerOpen:!1},c=$.extend({},b,a),d=[],e=0;e<a.subLayers.length;e++)d.push(new BW.Domain.SubLayer(a.subLayers[e]));return c.subLayers=d,c};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.LayerResponse=function(){return{id:-1,isLoading:!1,exception:"",features:[]}};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.LegendGraphic=function(a){function b(){return d.url+"&Request="+d.request+"&Version="+d.version+"&Format="+d.format+"&Width="+d.width+"&Height="+d.height+"&Layer="+d.layer}var c={width:"20",height:"20",format:"image/png",request:"GetLegendGraphic",version:"1.0.0",layer:"",url:""},d=$.extend({},c,a);return{GetLegendGraphicUrl:b}};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.MeasureResult=function(a,b,c){function d(){return h}function e(){return i}function f(){return j}function g(){return"Polygon area: "+d()+"<br>Length: "+e()+"<br>Circle area: "+f()}var h=a,i=b,j=c;return{PolygonArea:d,EdgeLength:e,CircleArea:f,GetParsedResult:g}};var BW=BW||{};BW.Domain=BW.Domain||{},BW.Domain.SubLayer=function(a){var b={name:"",providerName:"",source:BW.Domain.SubLayer.SOURCES.wmts,url:"",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"",extent:[-1,1,-1,1],extentUnits:"m",id:(new BW.Utils.Guid).newGuid(),transparent:!0,layerIndex:-1,legendGraphicUrl:"",featureInfo:new BW.Domain.FeatureInfo},c=$.extend({},b,a);-1==c.url.indexOf("?")&&(c.url+="?");var d=new BW.Domain.LegendGraphic({url:c.url,layer:c.name});return c.legendGraphicUrl=d.GetLegendGraphicUrl(),c},BW.Domain.SubLayer.SOURCES={wmts:"WMTS",wms:"WMS",vector:"VECTOR",proxyWmts:"proxyWmts",proxyWms:"proxyWms"},BW.Domain.SubLayer.FORMATS={imagepng:"image/png",imagejpeg:"image/jpeg",geoJson:"application/json"};var BW=BW||{};BW.Events=BW.Events||{},BW.Events.EventHandler=function(){function a(a,b){c.push({eventType:a,callBack:b})}function b(a,b){for(var d=0;d<c.length;d++){var e=c[d];e.eventType==a&&e.callBack(b)}}var c=[];return{RegisterEvent:a,TriggerEvent:b}},BW.Events.EventTypes={ChangeCenter:"ChangeCenter",ChangeResolution:"ChangeResolution",ChangeLayers:"ChangeLayers",FeatureInfoStart:"FeatureInfoStart",FeatureInfoEnd:"FeatureInfoEnd",MapConfigLoaded:"MapConfigLoaded",MapLoaded:"MapLoaded",ShowExportPanel:"ShowExportPanel",MeasureMouseMove:"MeasureMouseMove"};var BW=BW||{};BW.Facade=BW.Facade||{},BW.Facade.ServerConfigFacade=function(){function a(a,b){$.getJSON(a,function(a){b(a)})}return{GetMapConfig:a}};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Export=function(){function a(a,b,c){i=a.layout,j=!0,h=e(b),g=[b.on("precompose",k),b.on("postcompose",l)],c()}function b(a){if(j=!1,g){for(var b=0;b<g.length;b++)g[b].src.unByKey(g[b]);a()}}function c(a,b){b.once("postcompose",function(b){var c=b.context.canvas;a(c,h)})}function d(a){j&&(h=e(a),a.render())}function e(a){var b,c,d=210/297,e=a.getSize();"a4portrait"===i.value?(c=e[1]*d,c>e[0]?(c=e[0],b=e[0]/d):b=e[1]):(b=e[0]*d,b>e[1]?(b=e[1],c=e[1]/d):c=e[0]);var f=[e[0]*ol.has.DEVICE_PIXEL_RATIO/2,e[1]*ol.has.DEVICE_PIXEL_RATIO/2];return{minx:f[0]-c/2,miny:f[1]-b/2,maxx:f[0]+c/2,maxy:f[1]+b/2}}function f(a){var b=a.getSize();return{height:b[1]*ol.has.DEVICE_PIXEL_RATIO,width:b[0]*ol.has.DEVICE_PIXEL_RATIO}}var g,h,i="",j=!1,k=function(a){var b=a.context;b.save()},l=function(a){var b=a.context,c=f(a.target);b.beginPath(),b.moveTo(0,0),b.lineTo(c.width,0),b.lineTo(c.width,c.height),b.lineTo(0,c.height),b.lineTo(0,0),b.closePath(),b.moveTo(h.minx,h.miny),b.lineTo(h.minx,h.maxy),b.lineTo(h.maxx,h.maxy),b.lineTo(h.maxx,h.miny),b.lineTo(h.minx,h.miny),b.closePath(),b.fillStyle="rgba(25, 25, 25, 0.75)",b.fill(),b.restore()};return{Activate:a,Deactivate:b,ExportMap:c,WindowResized:d}};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.FeatureInfo=function(){function a(a,c){o(c),b();for(var d=new ol.format.GeoJSON,e=0;e<a.length;e++){var f=a[e],g=d.readFeature(f.geometryObject);g.getGeometry().transform(ol.proj.get(f.crs),ol.proj.get(c.getView().getProjection().getCode())),t.getSource().addFeature(g)}}function b(){var a=t.getSource();a.clear()}function c(a,b,c){var d=$(b),e=d.height(),f=d.width(),g=new ol.Overlay({element:b,stopEvent:!1,offset:[-f/2,-e]});g.setPosition(a),c.addOverlay(g)}function d(a,b){b.removeOverlay(s)}function e(a,b,c,d){var e=d.getResolution(),f=b.getSource(),g=d.getProjection(),h=f.getGetFeatureInfoUrl(c,e,g,{INFO_FORMAT:a.featureInfo.getFeatureInfoFormat,feature_count:10}),i=decodeURIComponent(h),j=i.substring(i.lastIndexOf("?"),i.length).replace("?",""),k=encodeURIComponent(j);return a.url.replace("proxy/wms","proxy/")+k}function f(a,b){v=b.on("singleclick",function(b){a(b.coordinate)})}function g(a){a.unByKey(v),v=""}function h(a,b){r=new ol.interaction.DragBox({condition:ol.events.condition.always,style:new ol.style.Style({stroke:new ol.style.Stroke({color:[0,0,255,1]}),fill:new ol.style.Fill({color:"rgba(255,255,255,0.8)"})})}),b.addInteraction(r),r.on("boxend",function(){a(r.getGeometry().getExtent())})}function i(a){a.removeInteraction(r)}function j(a,b,c){var d=c.getSource(),e=[];d.forEachFeatureInExtent(b,function(a){e.push(a)});var f=new ol.format.GeoJSON,g=f.writeFeatures(e);return g.crs=k(d.getProjection().getCode()),g}function k(a){return new l(a.split(":"))}function l(a){this.type=a[0],this.properties=new m(a[1])}function m(a){this.code=a}function n(a,b,c){var d=b*c,e=a[0],f=a[1],g=e-d,h=f-d,i=e+d,j=f+d;return[g,h,i,j]}function o(a){if(null==t){null==u&&q();var b=new ol.source.GeoJSON({projection:"EPSG:4326",object:{type:"FeatureCollection",totalFeatures:1,features:[{type:"Feature",id:"thc.1",geometry:{type:"Point",coordinates:[21.7495,71.721]},geometry_name:"the_geom",properties:{Year:2003}}],crs:{type:"EPSG",properties:{code:"4326"}}}});t=new ol.layer.Vector({source:b,style:u}),a.addLayer(t)}else a.removeLayer(t),a.addLayer(t)}function p(a){u=a,t.setStyle(u)}function q(){var a=new BW.Map.OL3.Styles.Default;u=a.Styles}var r,s,t=null,u=null,v="";return{ShowHighlightedFeatures:a,ClearHighlightedFeatures:b,SetHighlightStyle:p,ShowInfoMarker:c,RemoveInfoMarker:d,GetFeatureInfoUrl:e,ActivateInfoClick:f,DeactivateInfoClick:g,ActivateBoxSelect:h,DeactivateBoxSelect:i,GetFeaturesInExtent:j,GetExtentForCoordinate:n}};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Map=function(a,b,c,d,e,f){function g(a,b){$=b.proxyHost;var c=b.numZoomLevels,d=[];d[0]=b.newMaxRes;for(var e=1;c>e;e++)d[e]=d[e-1]/2;var f=new ol.proj.Projection({code:b.coordinate_system,extent:b.extent,units:b.extentUnits});Y=new ol.Map({target:a,renderer:b.renderer,layers:[],view:new ol.View({projection:f,center:b.center,zoom:b.zoom,resolutions:d,maxResolution:b.newMaxRes,numZoomLevels:c}),controls:[],overlays:[]}),h()}function h(){var a=Y.getView(),c=function(){var a=ab();b.TriggerEvent(BW.Events.EventTypes.ChangeCenter,a)},d=function(){var a=ab();b.TriggerEvent(BW.Events.EventTypes.ChangeResolution,a)};a.on("change:center",c),a.on("change:resolution",d)}function i(a){var b,c,d,e=Y.getView();if(a.x&&(b=a.x),a.y&&(c=a.y),a.zoom&&(d=a.zoom),void 0!==b&&void 0!==c){var f=parseFloat(c.replace(/,/g,".")),g=parseFloat(b.replace(/,/g,"."));isFinite(f)&&isFinite(g)&&e.setCenter([f,g])}void 0!==d&&e.setZoom(d)}function j(a){var b=m(a);Y.addLayer(b),z()}function k(a){var b=m(a);Y.getLayers().insertAt(0,b),z()}function l(a){var b=v(a.id);b&&(Y.removeLayer(b),z())}function m(a){var b,c,d=o(a);if(null!=d)b=d;else{switch(a.source){case BW.Domain.SubLayer.SOURCES.wmts:c=new BW.Map.OL3.Sources.Wmts(a);break;case BW.Domain.SubLayer.SOURCES.proxyWmts:a.url=$+a.url,c=new BW.Map.OL3.Sources.Wmts(a);break;case BW.Domain.SubLayer.SOURCES.wms:c=new BW.Map.OL3.Sources.Wms(a);break;case BW.Domain.SubLayer.SOURCES.proxyWms:a.url=$+a.url,c=new BW.Map.OL3.Sources.Wms(a);break;case BW.Domain.SubLayer.SOURCES.vector:c=new BW.Map.OL3.Sources.Vector(a,Y.getView().getProjection()),n(a,c);break;default:throw"Unsupported source: BW.Domain.SubLayer.SOURCES.'"+a.source+"'. For SubLayer with url "+a.url+" and name "+a.name+"."}b=a.source===BW.Domain.SubLayer.SOURCES.vector?new ol.layer.Vector({source:c}):a.tiled?new ol.layer.Tile({extent:a.extent,opacity:a.opacity,source:c}):new ol.layer.Image({extent:a.extent,opacity:a.opacity,source:c}),b.layerIndex=a.layerIndex,b.guid=a.id,Z.push(b)}return b}function n(a,b){var d=function(c){for(var d=ol.proj.get(a.coordinate_system),e=ol.proj.get(b.getProjection().getCode()),f=b.parser.readFeatures(c),g=0;g<f.length;g++){var h=f[g];h.getGeometry().transform(d,e)}b.addFeatures(f)};c.get(a.url).success(d)}function o(a){for(var b=0;b<Z.length;b++){var c=Z[b];if(c.guid==a.id)return c}return null}function p(a,b){var c=v(a.id);c&&!isNaN(b)&&c.setBrightness(Math.min(b,1))}function q(a,b){var c=v(a.id);c&&!isNaN(b)&&c.setContrast(Math.min(b,1))}function r(a,b){var c=v(a.id);c&&!isNaN(b)&&c.setOpacity(Math.min(b,1))}function s(a,b){var c=v(a.id);c&&!isNaN(b)&&c.setSaturation(Math.min(b,1))}function t(a,b){var c=v(a.id);c&&!isNaN(b)&&c.setHue(Math.min(b,1))}function u(){return Y.getLayers().getArray().filter(function(a){return void 0!==a.guid})}function v(a){for(var b=u(),c=0;c<b.length;c++){var d=b[c];if(d.guid==a)return d}return null}function w(a){for(var b=u(),c=0;c<b.length;c++){var d=b[c];if(d.guid==a.id)return c}return null}function x(a){for(var b=u(),c=0;c<b.length;c++)if(b[c].get("title")==a)return b[c];return null}function y(a,b){var c=w(a),d=Y.getLayers().getArray();d.splice(b,0,d.splice(c,1)[0]),z()}function z(){var a=ab();b.TriggerEvent(BW.Events.EventTypes.ChangeLayers,a)}function A(){for(var a=[],b=u(),c=0;c<b.length;c++){var d=b[c];d.getVisible()===!0&&a.push(b[c])}a.sort(B);for(var e=[],f=0;f<a.length;f++)e.push(a[f].guid);return e.join(",")}function B(a,b){return a.mapLayerIndex<b.mapLayerIndex?-1:a.mapLayerIndex>b.mapLayerIndex?1:0}function C(a){f.Activate(a,Y,F),window.addEventListener("resize",_,!1)}function D(){window.removeEventListener("resize",_,!1),f.Deactivate(F)}function E(a){f.ExportMap(a,Y)}function F(){Y.updateSize()}function G(){Y.renderSync()}function H(a){e.ActivateInfoClick(a,Y)}function I(){e.DeactivateInfoClick(Y)}function J(a,b){return e.GetFeatureInfoUrl(a,o(a),b,Y.getView())}function K(a){e.ShowHighlightedFeatures(a,Y)}function L(){e.ClearHighlightedFeatures()}function M(a,b){e.ShowInfoMarker(a,b,Y)}function N(a){e.RemoveInfoMarker(a,Y)}function O(a){e.SetHighlightStyle(a)}function P(a){e.ActivateBoxSelect(a,Y)}function Q(){e.DeactivateBoxSelect(Y)}function R(a,b){return e.GetExtentForCoordinate(a,b,Y.getView().getResolution())}function S(a,b){return e.GetFeaturesInExtent(a,b,o(a))}function T(a){d.Activate(Y,a)}function U(){d.Deactivate(Y)}function V(a,b,c){var d=c;if(""!==a&&""!==b){var e=ol.proj.get(a),f=ol.proj.get(b),g=ol.proj.transformExtent(c,e,f);d=g,"EPSG:4326"===b&&(d=g[1]+","+g[0]+","+g[3]+","+g[2])}return d}function W(a){var b=new ol.format.WMSCapabilities,c=b.read(a),d=new ol.format.GML,e=d.readFeatures(c),f=new ol.format.GeoJSON;return f.writeFeatures(e)}function X(a,b){var c=new ol.geom.Point([a,b]),d=new ol.Feature;d.setGeometry(c);var e=new ol.format.GeoJSON;return e.writeFeature(d)}var Y,Z=[],$="",_=function(){f.WindowResized(Y)},ab=function(){var a={layers:A()},b=Y.getView(),c=b.getCenter(),d=b.getZoom().toString();return d&&(a.zoom=d),c&&(a.x=c[1].toFixed(2),a.y=c[0].toFixed(2)),a};return{InitMap:g,ChangeView:i,ShowLayer:j,ShowBaseLayer:k,HideLayer:l,GetLayerByName:x,SetLayerOpacity:r,SetLayerSaturation:s,SetLayerHue:t,SetLayerBrightness:p,SetLayerContrast:q,MoveLayerToIndex:y,GetLayerIndex:w,RedrawMap:F,RenderSync:G,ExportMap:E,ActivateExport:C,DeactivateExport:D,ActivateInfoClick:H,DeactivateInfoClick:I,GetInfoUrl:J,ShowHighlightedFeatures:K,ClearHighlightedFeatures:L,ShowInfoMarker:M,SetHighlightStyle:O,RemoveInfoMarker:N,ActivateBoxSelect:P,DeactivateBoxSelect:Q,GetFeaturesInExtent:S,GetExtentForCoordinate:R,ActivateMeasure:T,DeactivateMeasure:U,TransformBox:V,ConvertGmlToGeoJson:W,ExtentToGeoJson:X}},BW.Map.OL3.Map.RENDERERS={canvas:"canvas",webgl:"webgl"};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Measure=function(a){function b(a){s=a.on("pointermove",d),f(a),a.addLayer(r)}function c(a){a.removeLayer(r),a.unByKey(s),s="",a.removeInteraction(q),a.removeOverlay(p)}function d(){if(m){var b,c=m.getGeometry();if(c instanceof ol.geom.Polygon){var d=i(c),f=h(c),g=e(c);b=new BW.Domain.MeasureResult(d,f,g)}a.TriggerEvent(BW.Events.EventTypes.MeasureMouseMove,b)}}function e(a){var b=a.getCoordinates()[0];return 2==b.length?(o.getGeometry().setRadius(n),Math.PI*Math.pow(n,2)):(o.getGeometry().setRadius(0),null)}function f(a){p=new ol.FeatureOverlay,a.addOverlay(p);var b=new ol.source.Vector;r=new ol.layer.Vector({source:b,style:new ol.style.Style({fill:new ol.style.Fill({color:"rgba(255, 255, 255, 0.2)"}),stroke:new ol.style.Stroke({color:"#ffcc33",width:2}),image:new ol.style.Circle({radius:7,fill:new ol.style.Fill({color:"#ffcc33"})})})});var c="Polygon";q=new ol.interaction.Draw({source:b,type:c}),a.addInteraction(q),q.on("drawstart",function(a){m=a.feature;var b=m.getGeometry().getCoordinates()[0][0];o=new ol.Feature(new ol.geom.Circle(b,0)),p.addFeature(o)},this),q.on("drawend",function(){m=null},this)}function g(a){var b=j(a);n=b,b=Math.round(100*b)/100;var c;return c=b>100?Math.round(b/1e3*100)/100+" km":Math.round(100*b)/100+" m"}function h(a){return g(a.getCoordinates()[0])}function i(a){var b,c=a.getArea();return b=c>1e4?Math.round(c/1e6*100)/100+" km<sup>2</sup>":Math.round(100*c)/100+" m<sup>2</sup>"}function j(a){var b;if(a.length>0){var c=a[0].length,d=k(a);b=l(d,0,d.length,c)}return b}function k(a){for(var b=[],c=0;c<a.length;c++)for(var d=a[c],e=0;e<d.length;e++)b.push(d[e]);return b}function l(a,b,c,d){var e,f=a[b],g=a[b+1],h=0;for(e=b+d;c>e;e+=d){var i=a[e],j=a[e+1];h+=Math.sqrt((i-f)*(i-f)+(j-g)*(j-g)),f=i,g=j}return h}var m,n,o,p,q,r,s="";return{Activate:b,Deactivate:c}};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Utilities=function(){function a(a){var b=new ol.format.WMSCapabilities,c=b.read(a),d=new ol.format.GML,e=d.readFeatures(c),f=new ol.format.GeoJSON;return f.writeFeatures(e)}function b(a,b){var c=new ol.geom.Point([a,b]),d=new ol.Feature;d.setGeometry(c);var e=new ol.format.GeoJSON;return e.writeFeature(d)}return{ConvertGmlToGeoJson:a,ExtentToGeoJson:b}};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Sources=BW.Map.OL3.Sources||{},BW.Map.OL3.Sources.Vector=function(a,b){var c;switch(a.format){case BW.Domain.SubLayer.FORMATS.geoJson:c=new ol.source.GeoJSON({projection:b,strategy:ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({maxZoom:19}))}),c.parser=new ol.format.GeoJSON}return c};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Sources=BW.Map.OL3.Sources||{},BW.Map.OL3.Sources.Wms=function(a){return a.tiled?new ol.source.TileWMS({params:{LAYERS:a.name,VERSION:"1.1.1"},url:a.url,format:a.format,crossOrigin:"anonymous",transparent:a.transparent}):new ol.source.ImageWMS({params:{LAYERS:a.name,VERSION:"1.1.1"},url:a.url,format:a.format,crossOrigin:"anonymous",transparent:a.transparent})};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Sources=BW.Map.OL3.Sources||{},BW.Map.OL3.Sources.Wmts=function(a){for(var b=new ol.proj.Projection({code:a.coordinate_system,extent:a.extent,units:a.extentUnits}),c=b.getExtent(),d=ol.extent.getWidth(c)/256,e=new Array(14),f=new Array(14),g=18,h=0;g>h;++h)e[h]=d/Math.pow(2,h),f[h]=b.getCode()+":"+h;return new ol.source.WMTS({url:a.url,layer:a.name,format:a.format,projection:b,matrixSet:a.coordinate_system,crossOrigin:"anonymous",tileGrid:new ol.tilegrid.WMTS({origin:ol.extent.getTopLeft(c),resolutions:e,matrixIds:f})})};var BW=BW||{};BW.Map=BW.Map||{},BW.Map.OL3=BW.Map.OL3||{},BW.Map.OL3.Styles=BW.Map.OL3.Styles||{},BW.Map.OL3.Styles.Default=function(){var a=function(){var a=new ol.style.Fill({color:"rgba(255,0,0,0.8)"}),b=new ol.style.Stroke({color:"#3399CC",width:2.25}),c=[new ol.style.Style({image:new ol.style.Circle({fill:a,stroke:b,radius:8}),fill:a,stroke:b})];return c};return{Styles:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Categories=function(){function a(a){d=a.categories}function b(){return d}function c(a){for(var b=0;b<d.length;b++){var c=d[b];if(c.catId.toString()===a.toString())return c;for(var e=0;e<d[b].subCategories.length;e++){var f=d[b].subCategories[e];if(f.catId.toString()===a.toString())return f}}}var d=[];return{Init:a,GetCategoryById:c,GetCategories:b}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.CustomCrsLoader=function(){function a(){proj4.defs("EPSG:32633","+proj=utm +zone=33 +ellps=WGS84 +datum=WGS84 +units=m +no_defs")}return{LoadCustomCrs:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Map=BW.MapModel.Map||{},BW.MapModel.FeatureInfo=function(a,b,c,d){function e(a){var b=f(a);c.TriggerEvent(BW.Events.EventTypes.FeatureInfoStart,b)}function f(a){for(var b=[],c=0;c<a.length;c++){var d=a[c],e=new BW.Domain.LayerResponse;e.id=d.id,e.isLoading=!0,b.push(e)}return b}function g(a,c){var d=function(a){h(c,a)};b.get(a).success(d)}function h(a,b){var e,f;try{e=d.Parse(b)}catch(g){f=g}var h=new BW.Domain.LayerResponse;h.id=a.id,h.isLoading=!1,h.features=e,h.exception=f,c.TriggerEvent(BW.Events.EventTypes.FeatureInfoEnd,h)}function i(a,c,d){var e,f=function(a){var b=j(a);d(b)},g=a.url.replace("proxy/wms","proxy/"),h="?",i=g.indexOf(h)>-1;i||(g+=encodeURIComponent(h));var k="SERVICE="+c+"&REQUEST=GETCAPABILITIES";(a.source===BW.Domain.SubLayer.SOURCES.proxyWms||a.source==BW.Domain.SubLayer.SOURCES.proxyWmts)&&(k=encodeURIComponent(k)),e=g+k,b.get(e).success(f)}function j(a){var b=new ol.format.WMSCapabilities,c=b.read(a);return c}function k(b,c){A===!0&&s(b),e(c);for(var d=0;d<c.length;d++){var f=c[d];switch(f.source){case BW.Domain.SubLayer.SOURCES.wmts:case BW.Domain.SubLayer.SOURCES.wms:case BW.Domain.SubLayer.SOURCES.proxyWms:case BW.Domain.SubLayer.SOURCES.proxyWmts:l(f,b);break;case BW.Domain.SubLayer.SOURCES.vector:var g=a.GetFeaturesInExtent(f,a.GetExtentForCoordinate(b,B));h(f,g)}}}function l(b,c){var d=a.GetInfoUrl(b,c);g(d,b)}function m(a,b){var c="WMS",d=function(a){var c=a.Capability.Request.GetFeatureInfo.Format;b(c)};i(a,c,d)}function n(b,c){e(c);for(var d=0;d<c.length;d++){var f=c[d];switch(f.source){case BW.Domain.SubLayer.SOURCES.wmts:case BW.Domain.SubLayer.SOURCES.wms:case BW.Domain.SubLayer.SOURCES.proxyWms:case BW.Domain.SubLayer.SOURCES.proxyWmts:o(f,b);break;case BW.Domain.SubLayer.SOURCES.vector:var g=a.GetFeaturesInExtent(f,b);h(f,g)}}}function o(a,b){var c=p(a,b);g(c,a)}function p(b,c){var d=b.featureInfo.getFeatureCrs,e=a.TransformBox(b.coordinate_system,b.featureInfo.getFeatureCrs,c),f="service=WFS&request=GetFeature&typeName="+b.name+"&srsName="+d+"&outputFormat="+b.featureInfo.getFeatureFormat+"&bbox="+e;return f=decodeURIComponent(f),f=f.substring(f.lastIndexOf("?"),f.length),f=f.replace("?",""),f=encodeURIComponent(f),b.url.replace("proxy/wms","proxy/")+f}function q(a,b){var c="WFS",d=function(a){var c=a.Capability.Request.GetFeature.Format;b(c)};i(a,c,d)}function r(){y=document.createElement("img"),y.src=z,w(),u()}function s(b){t(y,!0),y.style.visibility="visible",a.ShowInfoMarker(b,y)}function t(b,c){A===!0&&(c===!0&&(a.RemoveInfoMarker(y),w()),y=b,u())}function u(){document.body.appendChild(y),A=!0}function v(){t(y,!0)}function w(){y.style.visibility="hidden"}function x(a){z=a}var y,z="assets/img/pin-md-orange.png",A=!1,B=5;return{HandlePointSelect:k,HandleBoxSelect:n,CreateDefaultInfoMarker:r,SetInfoMarker:t,RemoveInfoMarker:v,GetSupportedGetFeatureInfoFormats:m,GetSupportedGetFeatureFormats:q,SetInfoMarkerPath:x}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Layers=function(a){function b(a){t=a,u=a.layers,c();for(var b=e(),d=0;d<b.length;d++){var j=b[d];j.visibleOnLoad&&g(j)}for(var k=f(),l=0;l<k.length;l++){var m=k[l];m.visibleOnLoad?h(m):i(m)}}function c(){for(var a=0,b=e(),c=0;c<b.length;c++)for(var d=b[c],g=0;g<d.subLayers.length;g++)d.subLayers[g].layerIndex=a,a++;for(var h=f(),i=0;i<h.length;i++)for(var j=h[i],k=0;k<j.subLayers.length;k++)j.subLayers[k].layerIndex=a,a++}function d(){return void 0!==t?t.layers:[]}function e(){return d().filter(function(a){return a.isBaseLayer===!0})}function f(){return d().filter(function(a){return a.isBaseLayer===!1})}function g(a){for(var b=k(),c=0;c<b.length;c++){var d=b[c];i(d)}o(a)}function h(b){for(var c=b.subLayers,d=0;d<c.length;d++){var e=c[d];a.HideLayer(e),r(e)&&a.ShowLayer(e)}b.isVisible=!0,p()}function i(b){for(var c=b.subLayers,d=0;d<c.length;d++){var e=c[d];a.HideLayer(e)}b.isVisible=!1,b.mapLayerIndex=-1,p()}function j(){for(var a=[],b=q(),c=0;c<b.length;c++)for(var d=b[c],e=0;e<d.subLayers.length;e++){var f=d.subLayers[e];r(f)&&a.push(f)}return a}function k(){return e().filter(function(a){return a.isVisible===!0})}function l(a){for(var b=0;b<u.length;b++){var c=u[b];if(c.id.toString()===a.toString())return c}}function m(b,c){for(var d=b.subLayers,e=0;e<d.length;e++){var f=d[e];r(f)&&a.MoveLayerToIndex(f,c)}p(),a.RedrawMap()}function n(b,c){for(var d=s(c),e=b.subLayers,f=0;f<e.length;f++){var g=e[f];r(g)&&a.MoveLayerToIndex(g,d)}}function o(b){for(var c=b.subLayers,d=0;d<c.length;d++){var e=c[d];a.HideLayer(e),r(e)&&a.ShowBaseLayer(e)}b.isVisible=!0,p()}function p(){for(var a=q(),b=0;b<a.length;b++){var c=a[b];c.mapLayerIndex=s(c)}}function q(){return f().filter(function(a){return a.isVisible===!0})}function r(){return!0}function s(b){for(var c=b.subLayers,d=[],e=0;e<c.length;e++){var f=c[e],g=a.GetLayerIndex(f);null!=g&&d.push(g)}return Math.max(d)}var t,u;return{Init:b,GetBaseLayers:e,GetOverlayLayers:f,SetBaseLayer:g,HideLayer:i,ShowLayer:h,GetVisibleSubLayers:j,GetVisibleBaseLayers:k,GetLayerById:l,MoveLayerToIndex:m,MoveLayerAbove:n,ShouldBeVisible:r}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Map=function(a,b,c,d,e){function f(c,f){a.InitMap(c,f),d.Init(f),e.Init(f),g(),b.TriggerEvent(BW.Events.EventTypes.MapLoaded)}function g(){var a=new BW.MapModel.CustomCrsLoader;a.LoadCustomCrs()}function h(a){d.ShowLayer(a)}function i(a){d.HideLayer(a)}function j(b,c){for(var d=b.subLayers,e=0;e<d.length;e++){var f=d[e];a.SetLayerOpacity(f,c)}a.RedrawMap()}function k(a){d.SetBaseLayer(a)}function l(){return d.GetBaseLayers()}function m(){return d.GetVisibleBaseLayers()[0]}function n(){return d.GetOverlayLayers()}function o(){return d.GetVisibleSubLayers()}function p(a){return d.GetLayerById(a)}function q(a,b){d.MoveLayerToIndex(a,b)}function r(a,b){d.MoveLayerAbove(a,b)}function s(a){return d.ShouldBeVisible(a)}function t(a){return e.GetCategoryById(a)}function u(){return e.GetCategories()}function v(b){a.ExportMap(b)}function w(b){a.ActivateExport(b)}function x(){a.DeactivateExport()}function y(){return a.RenderSync()}function z(a){c.SetInfoMarkerPath(a),c.CreateDefaultInfoMarker()}function A(a,b){c.SetInfoMarker(a,b)}function B(){c.RemoveInfoMarker()}function C(b){a.ShowHighlightedFeatures(b)}function D(){a.ClearHighlightedFeatures()}function E(b){a.SetHighlightStyle(b)}function F(){a.ActivateInfoClick(M)}function G(){a.DeactivateInfoClick()}function H(){a.ActivateBoxSelect(O)}function I(){a.DeactivateBoxSelect()}function J(a,b){c.GetSupportedGetFeatureInfoFormats(a,b)}function K(a,b){c.GetSupportedGetFeatureFormats(a,b)}function L(b){return a.ConvertGmlToGeoJson(b)}function M(a){c.HandlePointSelect(a,N())}function N(){var a=o();return a.filter(function(a){return a.featureInfo.supportsGetFeatureInfo===!0})}function O(a){c.HandleBoxSelect(a,P())}function P(){var a=o();return a.filter(function(a){return a.featureInfo.supportsGetFeature===!0})}function Q(){}function R(){}function S(b,c){a.ExtentToGeoJson(b,c)}function T(b){if(a.ChangeView(b),b.layers){var c=b.layers,d=c.split(",");d.forEach(function(a){var b=p(a);b&&(b.isBaseLayer===!0?k(b):h(b))})}}function U(a){a.legendGraphicUrls=[];for(var b=0;b<a.subLayers.length;b++){var c=a.subLayers[b];a.isVisible&&s(c)&&a.legendGraphicUrls.push(c.legendGraphicUrl)}}return{Init:f,ShowLayer:h,HideLayer:i,GetOverlayLayers:n,GetBaseLayers:l,GetLayerById:p,GetFirstVisibleBaseLayer:m,SetBaseLayer:k,SetStateFromUrlParams:T,SetLayerOpacity:j,MoveLayerToIndex:q,MoveLayerAbove:r,GetCategoryById:t,GetCategories:u,RenderSync:y,ExportMap:v,ActivateExport:w,DeactivateExport:x,ActivateInfoClick:F,DeactivateInfoClick:G,ShowHighlightedFeatures:C,ClearHighlightedFeatures:D,SetHighlightStyle:E,SetInfoMarker:A,SetImageInfoMarker:z,GetSupportedGetFeatureInfoFormats:J,GetSupportedGetFeatureFormats:K,RemoveInfoMarker:B,ActivateBoxSelect:H,DeactivateBoxSelect:I,ActivateMeasure:Q,DeactivateMeasure:R,ConvertGmlToGeoJson:L,SetLegendGraphics:U,ExtentToGeoJson:S}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.Base=function(a){function b(b){var e,f="exception",g="<?xml",h="<html",i="msgmloutput";if(b.type)"FeatureCollection"==b.type&&(e="geoJson");else{if(b.toLowerCase().indexOf(f)>-1)return c(b);if(b.toLowerCase().indexOf(g)>-1)e="kartKlifNo";else{if(b.toLowerCase().indexOf(h)>-1)return d(b);if(!(b.toLowerCase().indexOf(i)>-1))return null;e="fisheryDirectory"}}var j=a.CreateParser(e);return j.Parse(b)}function c(a){var b=new BW.MapModel.Parsers.Exception;b.Parse(a)}function d(a){var b=a.indexOf("<table");if(b>-1){var c=a.substring(b,a.length),d=c.indexOf("</body>");c=c.substring(0,d),console.log(c);var e=xml2json.parser(c);console.log(e)}return[]}return{Parse:b}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.Exception=function(){function a(a){var b=a.replace(/(<([^>]+)>)/gi,"");throw b}return{Parse:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.Factory=function(a,b,c,d){function e(e){var f;switch(e){case"geoJson":f=a;break;case"gml":f=b;break;case"kartKlifNo":f=c;break;case"fisheryDirectory":f=d}return f}return{CreateParser:e}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.FiskeriDir=function(a){function b(a){var b=[];a=a.replace(/:gml/g,""),a=a.replace(/gml:/g,h),a=a.replace(/s:x/g,"sx");var d=xml2json.parser(a),e=d[Object.keys(d)[0]];for(var f in e){var g=e[f];if(g instanceof Object)for(var i in g){var j=g[i];j instanceof Array&&(b=c(j))}}return b}function c(b){for(var c=[],i=0;i<b.length;i++){var j=b[i],k=new BW.Domain.FeatureResponse;k.attributes=d(j);var l=g[Object.keys(g)[0]].srsname,m=g[Object.keys(g)[0]][h+"coordinates"];m=m.replace(/ /g,","),k.crs=l,k.geometryObject=a.ExtentToGeoJson(e,f),c.push(k)}return c}function d(a){var b=[];for(var c in a)-1===c.toLocaleLowerCase().indexOf(h)?(b.push([c,a[c]]),"x"==c&&(e=a[c]),"y"==c&&(f=a[c])):g=a[c];return b}var e,f,g,h="insteadofgml";return{Parse:b}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.GML=function(){function a(a){console.log(a)}return{Parse:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.GeoJSON=function(){function a(a){var c,d=[];if(a.crs){var e=a.crs;e.properties.code?c=e.type+":"+e.properties.code:e.properties.name&&(c=e.properties.name.substring(e.properties.name.indexOf("EPSG"),e.properties.name.length))}for(var f=a.features,g=0;g<f.length;g++){var h=f[g],i=new BW.Domain.FeatureResponse;i.crs=c,i.geometryObject=h,i.attributes=b(h.properties),d.push(i)}return d}function b(a){var b=[];for(var c in a)b.push([c,a[c]]);return b}return{Parse:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Parsers=BW.MapModel.Parsers||{},BW.MapModel.Parsers.KartKlifNo=function(){function a(a){var c=[];a=a.replace(/:/g,"");var d=xml2json.parser(a);if(d.featureinforesponse){var e=d.featureinforesponse;if(e.fields){var f=e.fields;if(f instanceof Array)for(var g=0;g<f.length;g++)c.push(f[g]);else c.push(f)}}return b(c)}function b(a){for(var b=[],d=0;d<a.length;d++){var e=new BW.Domain.FeatureResponse;e.attributes=c(a[d]),b.push(e)}return b}function c(a){var b=[];for(var c in a)b.push([c,a[c]]);return b}return{Parse:a}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Tools=BW.MapModel.Tools||{},BW.MapModel.Tools.Tool=function(a){var b={id:"",activate:function(){console.log("Not implemented")},deactivate:function(){console.log("Not implemented")},messageObject:[],description:"",isCommand:!1},c=$.extend({},b,a);return c.Extend=function(a){return c=$.extend(c,a)},c};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Tools=BW.MapModel.Tools||{},BW.MapModel.Tools.ToolFactory=function(a){function b(a){h.push(a)}function c(){for(var a=[],b=0;b<h.length;b++)a.push(h[b].id);return a}function d(a){for(var b=!1,c=0;c<h.length;c++){var d=h[c];d.deactivate(),d.id==a&&(d.activate(),b=d.isCommand)}return b}function e(a){for(var b=0;b<a.length;b++){var c=a[b],d=f(c.id);d&&h.push(d)}}function f(a){for(var b=0;b<g.length;b++){var c=g[b];if(c.id===a)return c}return!1}var g=[],h=[];return g=a.GetTools(),{AddTool:b,GetAvailableTools:c,ActivateTool:d,SetupTools:e}};var BW=BW||{};BW.MapModel=BW.MapModel||{},BW.MapModel.Tools=BW.MapModel.Tools||{},BW.MapModel.Tools.Tools=function(a){function b(){return c}var c=[],d={id:"PointSelect",description:"This tool activates a get feature info click on the map",activate:function(){a.ActivateInfoClick()},deactivate:function(){a.DeactivateInfoClick(),a.RemoveInfoMarker()},messageObject:[]},e=new BW.MapModel.Tools.Tool(d);c.push(e);var f={id:"DefaultZoom",description:"This is the default tool",activate:function(){},deactivate:function(){},messageObject:[]},g=new BW.MapModel.Tools.Tool(f);c.push(g);var h={id:"BoxSelect",description:"This tool activates box select functionality to the map",activate:function(){a.ActivateBoxSelect()},deactivate:function(){a.DeactivateBoxSelect()},messageObject:[]},i=new BW.MapModel.Tools.Tool(h);c.push(i);var j={id:"Measure",description:"This tool lets the user measure in the map",activate:function(){a.ActivateMeasure()},deactivate:function(){a.DeactivateMeasure()},messageObject:[]},k=new BW.MapModel.Tools.Tool(j);return c.push(k),{GetTools:b}};var BW=BW||{};BW.Repository=BW.Repository||{},BW.Repository.Category=function(a){var b={catId:"",name:"",parentId:"",subCategories:[],isOpen:!1};return $.extend({},b,a)};var BW=BW||{};BW.Repository=BW.Repository||{},BW.Repository.ConfigRepository=function(a,b){function c(a){var b={numZoomLevels:18,newMaxRes:21664,center:[-20617,7661666],zoom:4,extent:[-25e5,35e5,3045984,9045984],layers:[],proxyHost:"https://www.barentswatch.no/proxy?url=",tools:[]};$.extend(b,a);for(var c=[],d=0;d<a.layers.length;d++)c.push(new BW.Domain.Layer(a.layers[d]));return b.layers=c,new BW.Repository.MapConfig(b)}function d(d){a.GetMapConfig(d,function(a){var d=c(a);b.TriggerEvent(BW.Events.EventTypes.MapConfigLoaded,d)})}return{GetMapConfig:d}};var BW=BW||{};BW.Repository=BW.Repository||{},BW.Repository.MapConfig=function(a){var b={name:"",comment:"",useCategories:!0,categories:[],numZoomLevels:10,newMaxRes:2e4,renderer:BW.Map.OL3.Map.RENDERERS.canvas,center:[-1,1],zoom:5,layers:[],coordinate_system:"EPSG:32633",extent:[-1,-1,-1,-1],extentUnits:"m",proxyHost:""};
return $.extend({},b,a)};var BW=BW||{};BW.Repository=BW.Repository||{},BW.Repository.StaticRepository=function(){function a(){return b}var b=new BW.Repository.MapConfig({numZoomLevels:18,newMaxRes:21664,renderer:BW.Map.OL3.Map.RENDERERS.canvas,center:[-20617,7661666],zoom:4,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentunits:"m",proxyHost:"",layers:[new BW.Domain.Layer({name:"Hovedkart Sjø",visibleOnLoad:!0,isBaseLayer:!0,subLayers:[new BW.Domain.SubLayer({name:"sjo_hovedkart2",source:BW.Domain.SubLayer.SOURCES.wmts,url:"http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]}),new BW.Domain.Layer({name:"Havbunn Grunnkart",visibleOnLoad:!1,isBaseLayer:!0,subLayers:[new BW.Domain.SubLayer({name:"havbunn_grunnkart",source:BW.Domain.SubLayer.SOURCES.wmts,url:"http://opencache.statkart.no/gatekeeper/gk/gk.open_wmts?",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]}),new BW.Domain.Layer({name:"Forvaltningsplanområde Norskehavet",visibleOnLoad:!1,category:"Kategori 1",subLayers:[new BW.Domain.SubLayer({name:"forvaltningsplanomrader_hav:fp_norskehavet",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]}),new BW.Domain.Layer({name:"Forvaltningsplanområde Nordsjøen",visibleOnLoad:!1,category:"Kategori 1",subLayers:[new BW.Domain.SubLayer({name:"forvaltningsplanomrader_hav:fp_nordsjoen",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]}),new BW.Domain.Layer({name:"Forvaltningsplanområde Barentshavet",visibleOnLoad:!1,category:"Kategori 1",subLayers:[new BW.Domain.SubLayer({name:"forvaltningsplanomrader_hav:fp_barentshavet",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]}),new BW.Domain.Layer({name:"Grenser",visibleOnLoad:!1,category:"Kategori 2",subLayers:[new BW.Domain.SubLayer({name:"fp_barentshavet_grenser",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"}),new BW.Domain.SubLayer({name:"fp_norskehavet_grenser",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"}),new BW.Domain.SubLayer({name:"fp_nordsjoen_grenser",source:BW.Domain.SubLayer.SOURCES.wms,url:"http://wms.dirnat.no/geoserver/forvaltningsplanomrader_hav/wms",format:BW.Domain.SubLayer.FORMATS.imagepng,coordinate_system:"EPSG:32633",extent:[-25e5,35e5,3045984,9045984],extentUnits:"m"})]})]});return{GetMapConfig:a}};var BW=BW||{};BW.Utils=BW.Utils||{},BW.Utils.Guid=function(){function a(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}function b(){return a()+a()+"-"+a()+"-"+a()+"-"+a()+"-"+a()+a()+a()}return{newGuid:b}};