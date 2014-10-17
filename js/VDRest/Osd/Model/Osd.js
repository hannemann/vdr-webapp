/**
 * Channels resource
 * @constructor
 */
VDRest.Osd.Model.Osd = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Osd.Model.Osd.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Osd.Model.Osd.prototype._class = 'VDRest.Osd.Model.Osd';

/**
 * @member {object} collection  store for channel models
 * @member {number} data.count  number of currently stored channel objects
 */
VDRest.Osd.Model.Osd.prototype.init = function () {

    this.currentOsd = null;
};

/**
 * fetch resource model and load channels
 * fire callback afterwards
 */
VDRest.Osd.Model.Osd.prototype.initOsd = function () {

    this.currentOsd = {
        "TextOsd":{
            "type":"TextOsd",
            "title":"VDR",
            "message":"",
            "red":"Aufnehmen",
            "green":"Audio",
            "yellow":"Pause",
            "blue":"Weiter",
            "items":[
                {"content":"  1  Programm","is_selected":true},
                {"content":"  2  Kan\u00e4le","is_selected":false},
                {"content":"  3  Timer","is_selected":false},
                {"content":"  4  Aufzeichnungen","is_selected":false},
                {"content":"  5  Schnellsuche","is_selected":false},
                {"content":"  6  markad Status","is_selected":false},
                {"content":"  7  Suche","is_selected":false},
                {"content":"  8  Timer-Konflikte","is_selected":false},
                {"content":"  9  Signalinformationen","is_selected":false},
                {"content":" 10 YaepgHD","is_selected":false},
                {"content":" 11 Programmf\u00fchrer","is_selected":false},
                {"content":" 12 Medien...","is_selected":false},
                {"content":" 13 Streamdev Verbindungen","is_selected":false},
                {"content":" 14 Einstellungen","is_selected":false},
                {"content":" 15 Befehle","is_selected":false}
            ]
        }
    };

    $.event.trigger({
        "type" : "osdloaded",
        "payload" : {
            "data" : this.currentOsd
        }
    });

    //this.module.getResource('Osd').load({
    //    "url" : "main",
    //    "callback" : $.proxy(function (result) {
    //        this.currentOsd = result
    //        $.event.trigger({
    //            "type" : "osdloaded",
    //            "payload" : {
    //                "data" : this.currentOsd
    //            }
    //        });
    //    }, this)
    //});
};

/**
 * retrieve osd
 */
VDRest.Osd.Model.Osd.prototype.getOsd = function () {

    return this.currentOsd;
};

