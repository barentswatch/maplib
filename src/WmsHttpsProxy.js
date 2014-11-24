(function () {
    'use strict';

    /*
    "Monkey-patches" OpenLayers to pipe all Http-request based map requests through
    the OpenLayers.ProxyHost if this is set and the URL is not https-based.
    This is to avoid browesers displaying warnings to the user about non-secure content
    mixed with secure content.

    Tested on OpenLayers 2.13.1, but should work at least back to 2.11
    */

    function isHttps(url) {
        return (url.lastIndexOf('https', 0) === 0);
    }

    OpenLayers.Layer.HTTPRequest.prototype.getFullRequestString = function(newParams, altUrl) {

        //!!!!!!
        //this is original OpenLayers 2.13.1 code (from Layer/HttpRequest.js line 200)
        //!!!!!!
        // if not altUrl passed in, use layer's url
        var url = altUrl || this.url;

        // create a new params hashtable with all the layer params and the
        // new params together. then convert to string
        var allParams = OpenLayers.Util.extend({}, this.params);
        allParams = OpenLayers.Util.extend(allParams, newParams);
        var paramsString = OpenLayers.Util.getParameterString(allParams);

        // if url is not a string, it should be an array of strings,
        // in which case we will deterministically select one of them in
        // order to evenly distribute requests to different urls.
        //
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(paramsString, url);
        }

        // ignore parameters that are already in the url search string
        var urlParams =
            OpenLayers.Util.upperCaseObject(OpenLayers.Util.getParameters(url));
        for(var key in allParams) {
            if(key.toUpperCase() in urlParams) {
                delete allParams[key];
            }
        }

        paramsString = OpenLayers.Util.getParameterString(allParams);
        //!!!!!!
        //end original code (line 224)
        //!!!!!!
        var fullUrl = OpenLayers.Util.urlAppend(url, paramsString);
        if (isHttps(url) || !OpenLayers.ProxyHost) {
            return fullUrl;
        }
        return OpenLayers.ProxyHost + encodeURIComponent(fullUrl);
    };

}());
