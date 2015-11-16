Barentswatch maplib
====================

Fetching the code
----------------
	1. Install nodejs and bower, make sure you can run the commands "node" and "bower" in your preferred command line
	2. Run "bower install https://code.barentswatch.net/stash/scm/bw/maplib.git" (add "--save-dev" to save it to your bower.json)
		or
	add "maplib": "https://code.barentswatch.net/stash/scm/bw/maplib.git" to your bower.json dependencies and run "bower install"

Contributing
------------
    1. Install nodejs and npm
    2. Install grunt
    3. Install ruby and compass to build scss
    4. Clone the git-repository "https://code.barentswatch.net/stash/scm/bw/maplib.git"
    5. Run "npm install" on the command line from within the fetched directory
    6. Run "bower install"
    7. Build and run unit tests with "grunt build"

Architecture
------------

The maplib library is split in two functional parts, BW.MapAPI and BW.MapImplementaion.

The public API used by a consumer is known as the MapAPI, and all classes in this part of the architecture uses the namespace BW.MapAPI.
All logic regarding map functionality is, as far as it is possible, in this part of maplib. Such as handling layers and their sublayers,
what order they are shown in etc., parsing feature responses and creating and activating tools.

All map functionality is handled inside the BW.MapImplementaion namespace. That is, all objects coming from an external map library is
kept within this domain. This is to ensure that the logic of maplib (BW.MapAPI) is not polluted with map-implementation specific logic.
This way the logic inside MapAPI is kept focused on the task of handling the map functionality. Likewise, the BW.Layer-object is not sent
to the MapImplementations, since it only deals with the logic of the map (handling showing of sublayers depending on for example zoom-
levels), instead the BW.SubLayer-objects are processed in the MapImplementations, where Map-specific objects for each sublayer is created,
stored and processed.

Example configuration file
--------------------------
{
  "name": "example-config",
  "comment": "delvis generert via adminverktøy",
  "useCategories": true,
  "categories": [
	{
	  "catId": 0,
	  "name": "cat_0",
	  "isOpen": false,
	  "parentId": -1,
	  "subCategories": []
	}
  ],
  "numZoomLevels": 18,
  "newMaxRes": 20000,
  "renderer": "canvas",
  "center": [
	-20617,
	7661666
  ],
  "zoom": 4,
  "layers": [
	{
	  "subLayers": [
		{
		  "name": "layer_245",
		  "providerName": "",
		  "source": "proxyWms",
		  "url": "http://kart.fiskeridir.no/wms.aspx?",
		  "format": "image/png",
		  "coordinate_system": "EPSG:32633",
		  "extent": [
			-2500000,
			3500000,
			3045984,
			9045984
		  ],
		  "extentUnits": "m",
		  "id": 1170,
		  "transparent": true,
		  "layerIndex": -1,
		  "legendGraphicUrl": "http://kart.fiskeridir.no/wms.aspx?&Request=GetLegendGraphic&Version=1.0.0&Format=image/png&Width=20&Height=20&Layer=layer_245",
		  "featureInfo": {
			"supportsGetFeatureInfo": true,
			"getFeatureInfoFormat": "application/json",
			"getFeatureInfoCrs": "",
			"supportsGetFeature": true,
			"getFeatureBaseUrl": "",
			"getFeatureFormat": "application/json",
			"getFeatureCrs": "EPSG:4326"
		  },
		  "tiled": false
		}
	  ],
	  "name": "",
	  "categoryId": "1",
	  "visibleOnLoad": false,
	  "isVisible": false,
	  "id": 1170,
	  "isBaseLayer": false,
	  "previewActive": false,
	  "opacity": 1,
	  "mapLayerIndex": -1,
	  "legendGraphicUrls": [],
	  "selectedLayerOpen": false
	}
  ],
  "coordinate_system": "EPSG:32633",
  "extent": [
	-2500000,
	3500000,
	3045984,
	9045984
  ],
  "extentUnits": "m",
  "proxyHost": "",
  "languages": {
	"no": {},
	"en": {}
  },
  "tools": [
	{
	  "id": "DefaultZoom",
	  "title": "DefaultZoom_title",
	  "hover": "DefaultZoom_hover",
	  "symbol": "glyphicon glyphicon-zoom-in",
	  "sortOrder": 0,
	  "isSelected": true
	},
	{
	  "id": "PointSelect",
	  "title": "PointSelect_title",
	  "hover": "PointSelect_hover",
	  "symbol": "glyphicon glyphicon-map-marker",
	  "sortOrder": 1,
	  "isSelected": false
	},
	{
	  "id": "BoxSelect",
	  "title": "BoxSelect_title",
	  "hover": "BoxSelect_hover",
	  "symbol": "glyphicon glyphicon-unchecked",
	  "sortOrder": 2,
	  "isSelected": false
	},
	{
	  "id": "Measure",
	  "title": "Measure_title",
	  "hover": "Measure_hover",
	  "symbol": "glyphicon glyphicon-pencil",
	  "sortOrder": 4,
	  "isSelected": false
	}
  ],
  "isRootLevelCategory": true
}