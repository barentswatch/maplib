var BW = BW || {};
BW.MapImplementation = BW.MapImplementation || {};
BW.MapImplementation.OL3 = BW.MapImplementation.OL3 || {};

BW.MapImplementation.OL3.Time = function() {

    var Extent_Time = "2015-03-01T12:30Z,2015-03-01T13:30Z,2015-03-01T14:30Z,2015-03-01T15:30Z,2015-03-01T16:30Z,2015-03-01T17:30Z,2015-03-01T18:30Z,2015-03-01T19:30Z,2015-03-01T20:30Z,2015-03-01T21:30Z,2015-03-01T22:30Z,2015-03-01T23:30Z,2015-03-02T00:30Z,2015-03-02T01:30Z,2015-03-02T02:30Z,2015-03-02T03:30Z,2015-03-02T04:30Z,2015-03-02T05:30Z,2015-03-02T06:30Z,2015-03-02T07:30Z,2015-03-02T08:30Z,2015-03-02T09:30Z,2015-03-02T10:30Z,2015-03-02T11:30Z,2015-03-02T12:30Z,2015-03-02T13:30Z,2015-03-02T14:30Z,2015-03-02T15:30Z,2015-03-02T16:30Z,2015-03-02T17:30Z,2015-03-02T18:30Z,2015-03-02T19:30Z,2015-03-02T20:30Z,2015-03-02T21:30Z,2015-03-02T22:30Z,2015-03-02T23:30Z,2015-03-03T00:30Z,2015-03-03T01:30Z,2015-03-03T02:30Z,2015-03-03T03:30Z,2015-03-03T04:30Z,2015-03-03T05:30Z,2015-03-03T06:30Z,2015-03-03T07:30Z,2015-03-03T08:30Z,2015-03-03T09:30Z,2015-03-03T10:30Z,2015-03-03T11:30Z,2015-03-03T12:30Z,2015-03-03T13:30Z,2015-03-03T14:30Z,2015-03-03T15:30Z,2015-03-03T16:30Z,2015-03-03T17:30Z,2015-03-03T18:30Z,2015-03-03T19:30Z,2015-03-03T20:30Z,2015-03-03T21:30Z,2015-03-03T22:30Z,2015-03-03T23:30Z,2015-03-04T00:30Z,2015-03-04T01:30Z,2015-03-04T02:30Z,2015-03-04T03:30Z,2015-03-04T04:30Z,2015-03-04T05:30Z,2015-03-04T06:30Z,2015-03-04T07:30Z,2015-03-04T08:30Z,2015-03-04T09:30Z,2015-03-04T10:30Z,2015-03-04T11:30Z,2015-03-04T12:30Z,2015-03-04T13:30Z,2015-03-04T14:30Z,2015-03-04T15:30Z,2015-03-04T16:30Z,2015-03-04T17:30Z,2015-03-04T18:30Z,2015-03-04T19:30Z,2015-03-04T20:30Z,2015-03-04T21:30Z,2015-03-04T22:30Z,2015-03-04T23:30Z,2015-03-05T00:30Z,2015-03-05T01:30Z,2015-03-05T02:30Z,2015-03-05T03:30Z,2015-03-05T04:30Z,2015-03-05T05:30Z,2015-03-05T06:30Z,2015-03-05T07:30Z,2015-03-05T08:30Z,2015-03-05T09:30Z,2015-03-05T10:30Z,2015-03-05T11:30Z,2015-03-05T12:30Z,2015-03-05T13:30Z,2015-03-05T14:30Z,2015-03-05T15:30Z,2015-03-05T16:30Z,2015-03-05T17:30Z,2015-03-05T18:30Z,2015-03-05T19:30Z,2015-03-05T20:30Z,2015-03-05T21:30Z,2015-03-05T22:30Z,2015-03-05T23:30Z,2015-03-06T00:30Z,2015-03-06T01:30Z,2015-03-06T02:30Z,2015-03-06T03:30Z,2015-03-06T04:30Z,2015-03-06T05:30Z,2015-03-06T06:30Z,2015-03-06T07:30Z,2015-03-06T08:30Z,2015-03-06T09:30Z,2015-03-06T10:30Z,2015-03-06T11:30Z,2015-03-06T12:30Z,2015-03-06T13:30Z,2015-03-06T14:30Z,2015-03-06T15:30Z,2015-03-06T16:30Z,2015-03-06T17:30Z,2015-03-06T18:30Z,2015-03-06T19:30Z,2015-03-06T20:30Z,2015-03-06T21:30Z,2015-03-06T22:30Z,2015-03-06T23:30Z,2015-03-07T00:30Z,2015-03-07T01:30Z,2015-03-07T02:30Z,2015-03-07T03:30Z,2015-03-07T04:30Z,2015-03-07T05:30Z,2015-03-07T06:30Z,2015-03-07T07:30Z,2015-03-07T08:30Z,2015-03-07T09:30Z,2015-03-07T10:30Z,2015-03-07T11:30Z,2015-03-07T12:30Z,2015-03-07T13:30Z,2015-03-07T14:30Z,2015-03-07T15:30Z,2015-03-07T16:30Z,2015-03-07T17:30Z,2015-03-07T18:30Z,2015-03-07T19:30Z,2015-03-07T20:30Z,2015-03-07T21:30Z,2015-03-07T22:30Z,2015-03-07T23:30Z,2015-03-08T00:30Z,2015-03-08T01:30Z,2015-03-08T02:30Z,2015-03-08T03:30Z,2015-03-08T04:30Z,2015-03-08T05:30Z,2015-03-08T06:30Z,2015-03-08T07:30Z,2015-03-08T08:30Z,2015-03-08T09:30Z,2015-03-08T10:30Z,2015-03-08T11:30Z,2015-03-08T12:30Z,2015-03-08T13:30Z,2015-03-08T14:30Z,2015-03-08T15:30Z,2015-03-08T16:30Z,2015-03-08T17:30Z,2015-03-08T18:30Z,2015-03-08T19:30Z,2015-03-08T20:30Z,2015-03-08T21:30Z,2015-03-08T22:30Z,2015-03-08T23:30Z,2015-03-09T00:30Z,2015-03-09T01:30Z,2015-03-09T02:30Z,2015-03-09T03:30Z,2015-03-09T04:30Z,2015-03-09T05:30Z,2015-03-09T06:30Z,2015-03-09T07:30Z,2015-03-09T08:30Z,2015-03-09T09:30Z,2015-03-09T10:30Z,2015-03-09T11:30Z,2015-03-09T12:30Z,2015-03-09T13:30Z,2015-03-09T14:30Z,2015-03-09T15:30Z,2015-03-09T16:30Z,2015-03-09T17:30Z,2015-03-09T18:30Z,2015-03-09T19:30Z,2015-03-09T20:30Z,2015-03-09T21:30Z,2015-03-09T22:30Z,2015-03-09T23:30Z,2015-03-10T00:30Z,2015-03-10T01:30Z,2015-03-10T02:30Z,2015-03-10T03:30Z,2015-03-10T04:30Z,2015-03-10T05:30Z,2015-03-10T06:30Z,2015-03-10T07:30Z,2015-03-10T08:30Z,2015-03-10T09:30Z,2015-03-10T10:30Z,2015-03-10T11:30Z,2015-03-10T12:30Z,2015-03-10T13:30Z,2015-03-10T14:30Z,2015-03-10T15:30Z,2015-03-10T16:30Z,2015-03-10T17:30Z,2015-03-10T18:30Z,2015-03-10T19:30Z,2015-03-10T20:30Z,2015-03-10T21:30Z,2015-03-10T22:30Z,2015-03-10T23:30Z,2015-03-11T00:30Z,2015-03-11T01:30Z,2015-03-11T02:30Z,2015-03-11T03:30Z,2015-03-11T04:30Z,2015-03-11T05:30Z,2015-03-11T06:30Z,2015-03-11T07:30Z,2015-03-11T08:30Z,2015-03-11T09:30Z,2015-03-11T10:30Z,2015-03-11T11:30Z";
    var timeArray = Extent_Time.split(",");
    var arrayLength = timeArray.length;
    var json_dates = [];

    function getWmsTime() {
        for (var i = 0; i < arrayLength; i++) {
            var json_item = analyzeDate(timeArray[i]);
            json_dates.push(json_item);
        }
        var resolution = getResolution();

        var result = {
            "dates": json_dates,
            "resolution": resolution,
            "current": json_dates[json_dates.length-1]
        };

        return result;
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
        GetWmsTime: getWmsTime
    };
};