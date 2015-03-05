var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Time = function() {

    var Extent_Time;
    var arrayLength;
    var json_dates = [];

    function getCapabilitiesJson(url) {
        var capabilitiesUrl = url + "?SERVICE=WMS&REQUEST=GetCapabilities&version=1.3.0";
        return $.ajax({
            url: capabilitiesUrl,
            type: 'GET'
        });
    }

    function getWmsTime(capabilityResponse, layerName) {
        var parser = new ol.format.WMSCapabilities();
        result = parser.read(capabilityResponse);
        for (var i = 0; i < result.Capability.Layer.Layer.length; i++) {
            var layer = result.Capability.Layer.Layer[i];
            if (layer.Name === layerName) {
                Extent_Time = layer.Dimension[0].values;
                var timeArray = Extent_Time.split(",");
                arrayLength = timeArray.length;

                for (var j = 0; j < arrayLength; j++) {
                    var json_item = analyzeDate(timeArray[j]);
                    json_dates.push(json_item);
                }
                var resolution = getResolution();

                var result = {
                    "dates": json_dates,
                    "resolution": resolution,
                    "current": json_dates[json_dates.length - 1]
                };

                return result;
            }
        }
    }

    function getResolution() {
        var resolution;

        for (var k = 1; k < arrayLength; k++) {
            var prev = json_dates[k - 1];
            var curr = json_dates[k];
            if (prev.type != curr.type) {
                // Different time formats, not supported
                return "error";
            }

            dMinute = (curr.Minutes !== undefined) ? curr.Minutes - prev.Minutes : 0;
            if (dMinute !== 0) {
                if (resolution === undefined) {
                    resolution = "Minutes";
                }
                else if (resolution !== "Minutes") {
                    // Different resolutions not supported
                    return "error";
                }
                continue;
            }

            dHour = (curr.Hours !== undefined) ? curr.Hours - prev.Hours : 0;
            if (dHour !== 0) {
                if (resolution === undefined) {
                    resolution = "Hour";
                }
                else if (resolution !== "Hour") {
                    // Different resolutions not supported
                    return "error";
                }
                continue;
            }

            dDay = (curr.Day !== undefined) ? curr.Day - prev.Day : 0;
            if (dDay !== 0) {
                if (resolution === undefined) {
                    resolution = "Day";
                }
                else if (resolution !== "Day") {
                    // Different resolutions not supported
                    return "error";
                }
                continue;
            }

            dMonth = (curr.Month !== undefined) ? curr.Month - prev.Month : 0;
            if (dMonth !== 0) {
                if (resolution === undefined) {
                    resolution = "Month";
                }
                else if (resolution !== "Month") {
                    // Different resolutions not supported
                    return "error";
                }
                continue;
            }

            dYear = curr.Year - prev.Year;
            if (dYear !== 0) {
                if (resolution === undefined) {
                    resolution = "Year";
                }
                else if (resolution !== "Year") {
                    // Different resolutions not supported
                    return "error";
                }
            }
        }
        return resolution;
    }

    function analyzeDate(datestring) {
        var type = "";
        var dateformat = 0;
        if (moment(datestring, "YYYY-MM-DDTHH:mm:ssZ").isValid()) {
            dateformat = 1;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateformat = 2;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateformat = 3;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm:ss").isValid()) {
            dateformat = 4;
        }
        else if (moment(datestring, "YYYY-MM-DD HH:mm:ss").isValid()) {
            dateformat = 5;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH:mm").isValid()) {
            dateformat = 6;
        }
        else if (moment(datestring, "YYYY-MM-DDTHH").isValid()) {
            dateformat = 7;
        }
        else if (moment(datestring, "YYYY-MM-DD").isValid()) {
            dateformat = 8;
        }
        else if (moment(datestring, "YYYY-MM").isValid()) {
            dateformat = 9;
        }
        else if (moment(datestring, "YYYY").isValid()) {
            dateformat = 10;
        }
        else if (moment(datestring, "THH:mm:ssZ").isValid()) {
            dateformat = 11;
        }
        else if (moment(datestring, "THH:mm:ss").isValid()) {
            dateformat = 12;
        }
        else if (moment(datestring, "YYYYMMDD").isValid()) {
            dateformat = 13;
        }
        else { // invalid format
            return {};
        }

        var year, month, day, hour, minutes;

        if (dateformat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]) {
            year = moment(datestring).year();
            type = "year";
        }
        if (dateformat in [1, 2, 3, 4, 5, 6, 7, 8, 9, 13]) {
            month = moment(datestring).month();
            type = "month";
        }
        if (dateformat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            day = moment(datestring).day();
            type = "day";
        }
        if (dateformat in [1, 2, 3, 4, 5, 6, 7, 11, 12]) {
            hour = moment(datestring).hours();
            type = "hour";
        }
        if (dateformat in [1, 2, 3, 4, 5, 6, 7, 8]) {
            minutes = moment(datestring).minutes();
            type = "minutes";
        }
        var date_item = {
            "Value": datestring,
            "Year": year,
            "Month": month,
            "Day": day,
            "Hours": hour,
            "Minutes": minutes,
            "Type": type,
            "Format": dateformat
        };
        return date_item;
    }

    return {
        GetCapabilitiesJson: getCapabilitiesJson,
        GetWmsTime: getWmsTime
    };
};