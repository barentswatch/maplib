var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Time = function() {

    //var Extent_Time = "2015-03-03T12:30Z,2015-03-03T13:30Z,2015-03-03T14:30Z,2015-03-03T15:30Z,2015-03-03T16:30Z,2015-03-03T17:30Z,2015-03-03T18:30Z,2015-03-03T19:30Z,2015-03-03T20:30Z,2015-03-03T21:30Z,2015-03-03T22:30Z,2015-03-03T23:30Z";
    var Extent_Time;
    var arrayLength;
    var json_dates = [];

    function getCapabilitiesJson() {
        var capabilitiesUrl = "http://bw-wms.met.no/barentswatch/default.map?SERVICE=WMS&REQUEST=GetCapabilities&version=1.3.0";
        return $.ajax({
            url: capabilitiesUrl,
            type: 'GET'
        });
    }

    function getWmsTime(capabilityResponse) {
        var parser = new ol.format.WMSCapabilities();
        var layername = "osisaf.iceconcentration";
        result = parser.read(capabilityResponse);
        for (var i = 0; i < result.Capability.Layer.Layer.length; i++) {
            var layer = result.Capability.Layer.Layer[i];
            if (layer.Name === layername) {
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
                console.log(k, "Error");
                return "error";
            }

            dMinute = (curr.Minutes !== undefined) ? curr.Minutes - prev.Minutes : 0;
            if (dMinute !== 0) {
                if (resolution === undefined) {
                    resolution = "Minutes";
                }
                else if (resolution !== "Minutes") {
                    console.log(k, "Error");
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
                    console.log(k, "Error");
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
                    console.log(k, "Error");
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
                    console.log(k, "Error");
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
                    console.log(k, "Error");
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
        else if (moment(datestring, "YYYYMMDD").isValid()) {
            dateformat = 13;
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