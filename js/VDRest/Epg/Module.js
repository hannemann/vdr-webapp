/**
 * EPG Module
 * @constructor
 * @property {VDRest.Lib.Cache} cache
 */
VDRest.Epg = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Epg.prototype = new VDRest.Abstract.Module();

VDRest.Epg.prototype.nowOffset = 1000 * 60 * 30;

/**
 * initialize module
 * @member {Date} now       Date Object of now
 * @member {Date} prime     Date Object of prime time 20:15 today or tomorrow
 */
VDRest.Epg.prototype.init = function () {

    // call parent init method
    VDRest.Abstract.Module.prototype.init.apply(this);

    if ('custom' === VDRest.config.getItem('lastEpg')) {

        VDRest.config.setItem('lastEpg', 'now');
    }

    this.initTimes();
};

/**
 * init date objects
 */
VDRest.Epg.prototype.initTimes = function (custom) {

    this.now = new Date(Date.now() - 1000 * 60 * 30);

    this.custom = custom || this.now;

    this.prime = new Date(
        this.now.getFullYear(),
        this.now.getMonth(),
        this.now.getDate(),
        20, 15, 0
    );

    if (this.now > this.prime) {

        this.prime.setTime(this.prime.getTime() + 24 * 60 * 60 * 1000);
    }

    this.debugUpdate = false;

    return this;
};

VDRest.Epg.prototype.updateNow = function () {

    if (this.debugUpdate) {

        /**
         * for debugging auto scroll
         * set this.debugUpdate to true in method initTimes
         */
        if (!this.first) {

            var m = Math.round(Math.random() * 1440);

            this.now = new Date(this.now.getTime() + 1000 * 60 * m);
            console.log(m, this.now);
            this.first = true;
        } else {
            this.now = new Date(this.now.getTime() + 1000 * 60);
        }
    } else {

        this.now = new Date(Date.now() - this.nowOffset);
    }

    return this.now;
};

/**
 * initialize observer
 */
VDRest.Epg.prototype.initLate = function () {

    this.getModel('Observer');
    this.getModel('ContentDescriptors').initContentDescriptors();
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

