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

    $(document).on('updateinfo', function () {

        me.getModel('Info').load();
    });

    setInterval(function () {

        $.event.trigger('updateinfo');
    }, 60000);
};

/**
 * register module
 */
VDRest.app.registerModule('VDRest.Info', true);

