var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Time = function() {

    var extentTime;
    var arrayLength;
    var jsonDates = [];

    // Retrieve the getCapabilities data from a given service url
    function getCapabilitiesJson(url) {
        url = url.replace(/\?$/g,'');   // remove trailing "?"
        var capabilitiesUrl = url + "?SERVICE=WMS&REQUEST=GetCapabilities&version=1.3.0";
        return $.ajax({
            url: capabilitiesUrl,
            type: 'GET'
        });
    }

    // Parse the capability info and get a json structure containing the dates, resolution and most current result
    function getWmsTime(capabilityResponse, layerName) {
        var parser = new ol.format.WMSCapabilities();
        var jsonCapabilities = parser.read(capabilityResponse);

        if (jsonCapabilities.Capability !== undefined) {
            for (var i = 0; i < jsonCapabilities.Capability.Layer.Layer.length; i++) {
                var layer = jsonCapabilities.Capability.Layer.Layer[i];
                if (layer.Name === layerName) {
                    extentTime = layer.Dimension[0].values;
                    var timeArray = extentTime.split(",");
                    timeArray.sort();
                    arrayLength = timeArray.length;

                    for (var j = 0; j < arrayLength; j++) {
                        var jsonItem = _analyzeDate(timeArray[j]);
                        jsonDates.push(jsonItem);
                    }
                    var resolution = _getResolution();

                    return {
                        "dates": jsonDates,
                        "resolution": resolution,
                        "current": _getCurrent(timeArray)
                    };
                }
            }
        }
        return undefined;
    }

    /////////////////////////////
    // Internal helper methods //
    /////////////////////////////

    // Get the time nearest before current time
    function _getCurrent(dateArray) {
        var current = '';
        arrayLength = dateArray.length;
        for (var j = 0; j < arrayLength; j++) {
            if (moment(dateArray[j]) < moment()) {
                current = dateArray[j];
            }
            else {
                return current;
            }
        }
    }

    // helper method when determining/validating the data resolution
    function _updateResolution(resolution, newResolution){
        if (resolution === undefined) {
            // First time called, set resolution
            resolution = newResolution;
        }
        else if (resolution !== newResolution) {
            // Different resolutions not supported
            return "error";
        }
        return resolution;
    }

    // Find resolution of the time array
    function _getResolution() {
        var resolution;
        var newResolution;

        for (var k = 1; k < arrayLength; k++) {

            var prev = jsonDates[k - 1];
            var curr = jsonDates[k];
            if (prev.type != curr.type) {
                // Different time formats, not supported
                return "error";
            }

            resolution = _updateResolution(resolution, newResolution);

            var dMinute = (curr.Minutes !== undefined) ? curr.Minutes - prev.Minutes : 0;
            if (dMinute !== 0) {
                newResolution = "Minutes";
                continue;
            }

            var dHour = (curr.Hours !== undefined) ? curr.Hours - prev.Hours : 0;
            if (dHour !== 0) {
                newResolution = "Hour";
                continue;
            }

            var dDay = (curr.Day !== undefined) ? curr.Day - prev.Day : 0;
            if (dDay !== 0) {
                newResolution = "Day";
                continue;
            }

            var dMonth = (curr.Month !== undefined) ? curr.Month - prev.Month : 0;
            if (dMonth !== 0) {
                newResolution = "Month";
                continue;
            }

            var dYear = curr.Year - prev.Year;
            if (dYear !== 0) {
                newResolution = "Year";
            }
        }

        return _updateResolution(resolution, newResolution);
    }

    // Validate date format and create date object
    function _analyzeDate(datestring) {
        var type = "";
        var dateFormat = 0;
        if (moment(datestring, "YYYY-MM-DDTHH:mm:ssZ").isValid()) {
            dateFormat = 1;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateFormat = 2;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateFormat = 3;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateFormat = 4;
        }
        else if (moment(datestring, "YYYY-MM-DD HH:mm:ss").isValid()) {
            dateFormat = 5;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateFormat = 6;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH").isValid()) {
            dateFormat = 7;
        }
        else if (moment(datestring, "YYYY-MM-DD").isValid()) {
            dateFormat = 8;
        }
        else if (moment(datestring, "YYYY-MM").isValid()) {
            dateFormat = 9;
        }
        else if (moment(datestring, "YYYY").isValid()) {
            dateFormat = 10;
        }
        else if (moment(datestring, "THH:mm:ssZ").isValid()) {
            dateFormat = 11;
        }
        else if (moment(datestring, "THH:mm:ss").isValid()) {
            dateFormat = 12;
        }
        else if (moment(datestring, "YYYYMMDD").isValid()) {
            dateFormat = 13;
        }
        else { // invalid format
            return {};
        }

        var year, month, day, hour, minutes;

        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]) {
            year = moment(datestring).year();
            type = "year";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]) {
            month = moment(datestring).month();
            type = "month";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            day = moment(datestring).day();
            type = "day";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 11, 12]) {
            hour = moment(datestring).hours();
            type = "hour";
        }
        if (dateFormat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            minutes = moment(datestring).minutes();
            type = "minutes";
        }
        return {
            "Value": datestring,
            "Year": year,
            "Month": month,
            "Day": day,
            "Hours": hour,
            "Minutes": minutes,
            "Type": type,
            "Format": dateFormat
        };
    }

    return {
        GetCapabilitiesJson: getCapabilitiesJson,
        GetWmsTime: getWmsTime
    };
};