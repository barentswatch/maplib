var BW = BW || {};
BW.Language = BW.Language || {};
BW.Language.ConfigLanguage =  function () {

    /*'use strict';
    var language;
    var dict;
    var dateTimeFormatLang;

    var translations = "app/BW.Language/areamanagementEN.json";

    function init(lang) {
        language = lang;
        if (language === 'no') {
            language = 'nb';
        }
        dict = translations || {};

        if (typeof moment !== 'undefined') {
            moment.lang(language);
        }
    }

    function add(key, string) {
        dict[key] = string;
    }

    function translate(key) {
        if (dict[key]) {
            return dict[key];
        }
        return key;
    }

    function setDateTimeFormat(datetimeFormat) {
        dateTimeFormatLang = datetimeFormat;
    }

    *//*function formatDatetime(datetime) {
        return moment(datetime).format(datetimeFormatLang);
    }*//*
    return {
        Init: init,
        Add: add,
        Translate: translate,
        SetDateTimeFormat: setDateTimeFormat
    };*/

   /* var app = angular.module('at', ['pascalprecht.translate']);

    app.config(function ($translateProvider) {
        $translateProvider.translations('en', {
            "menu_select_layer" : "Select Map Layer",
            "menu_selected_layer": "Selected Map Layers",
            "menu_select_baselayer": "Select Basemap layer",
            "menu_close": "Close Menu",
            "menu_open": "Close Menu",
            "export_map_a4": "Export Map as A4 size sheet",
            "export_map_screensize": "Export Map in screen view format"
        });
        $translateProvider.translations('no', {
            "menu_select_layer": "Velg kartlag",
            "menu_selected_layer": "Valgte kartlag",
            "menu_select_baselayer": "Velg bakgrunnskart",
            "menu_close": "Lukk meny",
            "menu_open": "Lukk meny",
            "export_map_a4": "Eksporter kart som A4",
            "export_map_screensize": "Eksporter kart som vist"
        });
        $translateProvider.preferredLanguage('no');
    });

    app.controller('Ctrl', function ($scope, $translate) {
        $scope.changeLanguage = function (key) {
            $translate.use(key);
        };
    });*/

};
