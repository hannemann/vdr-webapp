/**
 * Info Module
 * @constructor
 */
VDRest.Info = function () {};

/**
 * prototype
 * @type {VDRest.Abstract.Module}
 */
VDRest.Info.prototype = new VDRest.Abstract.Module();

/**
 * Modulename
 * @type {string}
 */
VDRest.Info.prototype.name = 'Info';

/**
 * interval in ms
 * @type {number}
 */
VDRest.Info.prototype.interval = 60000;

/**
 * initialize module
 */
VDRest.Info.prototype.init = function () {

    var me = this;

    VDRest.Abstract.Module.prototype.init.call(this);

    $document.on('updateinfo', function () {

        me.getModel('Info').load();
    });

    if ('visible' === document.visibilityState) {
        this.startInfoInterval();
    }

    $document.on('visibilitychange', this.toggleInfoUpdate.bind(this));
};

/**
 * toggle
 */
VDRest.Info.prototype.toggleInfoUpdate = function () {

    if ('visible' === document.visibilityState) {
        this.stopInfoInterval()
            .startInfoInterval();
    } else {
        this.stopInfoInterval();
    }
};

/**
 * start interval
 */
VDRest.Info.prototype.startInfoInterval = function () {

    this.updateInfoInterval = setInterval(function () {
        $.event.trigger('updateinfo');
    }, this.interval);
};

/**
 * stop interval
 * @return {VDRest.Info}
 */
VDRest.Info.prototype.stopInfoInterval = function () {

    clearInterval(this.updateInfoInterval);
    return this;
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Info', true);

