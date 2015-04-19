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

VDRest.Info.prototype.toggleInfoUpdate = function () {

    if ('visible' === document.visibilityState) {
        this.stopInfoInterval()
            .startInfoInterval();
    } else {
        this.stopInfoInterval();
    }
};

VDRest.Info.prototype.startInfoInterval = function () {

    this.updateInfoInterval = setInterval(function () {
        $.event.trigger('updateinfo');
    }, 60000);
};

VDRest.Info.prototype.stopInfoInterval = function () {

    clearInterval(this.updateInfoInterval);
    return this;
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Info', true);

