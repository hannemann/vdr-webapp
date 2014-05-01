/**
 * EPG Module
 * @constructor
 */
VDRest.Epg = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Epg.prototype = new VDRest.Abstract.Module();

/**
 * initialize module
 * @member {Date} now       Date Object of now
 * @member {Date} prime     Date Object of prime time 20:15 today or tomorrow
 */
VDRest.Epg.prototype.init = function () {

    // call parent init method
    VDRest.Abstract.Module.prototype.init.apply(this);

    this.now = new Date();

    this.prime = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate(),
        20, 15, 0
    );

    if (this.now > this.prime) {

        this.prime.setTime(this.prime.getTime() + 24 * 60 * 60 * 1000);
    }
};

/**
 * initialize observer
 */
VDRest.Epg.prototype.initLate = function () {

    this.getModel('Observer');
};

/**
 * Modulename
 * @type {string}
 */
VDRest.Epg.prototype.name = 'Epg';

/**
 * not really implemented yet
 * @param type
 * @param broadcast
 * @returns {*|VDRest.Abstract.View}
 */
VDRest.Epg.prototype.dispatchView = function (type, broadcast) {

    return this.getController(type, broadcast).dispatchView(type);
};

/**
 * initialize channels controller
 */
VDRest.Epg.prototype.initChannels = function () {

    this.getController('Channels');
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Epg', true);

