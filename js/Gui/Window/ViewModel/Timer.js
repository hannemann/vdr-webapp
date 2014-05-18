/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Timer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.Timer.prototype = new Gui.Timer.ViewModel.List.Timer();

/**
 * @type {string}
 */
Gui.Window.ViewModel.Timer.prototype.cacheKey = 'id';

/**
 * initialize resources
 */
Gui.Window.ViewModel.Timer.prototype.init = function () {

    this.resource = this.data.resource;
    this.broadcast = this.data.broadcast;

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Window.ViewModel.Timer.prototype.initViewMethods = function () {

    var me = this;

    this.data.view.getBroadcast = function () {

        return me.broadcast;
    };

    this.data.view.getDate = function () {

        var date = new Date(me.resource.day);

        return VDRest.helper.getWeekDay(date, true) + '. ' + VDRest.helper.getDateString(date, true);
    };

    this.data.view.getStartTime = function () {

        return VDRest.helper.getTimeString(new Date(me.resource.start_timestamp));
    };

    this.data.view.getEndTime = function () {

        return VDRest.helper.getTimeString(new Date(me.resource.stop_timestamp))
    };

    this.data.view.getDirName = function () {

        return me.resource.filename.split('~').slice(0, -1).join('~');
    };

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this, this.broadcast.data, 'broadcast');

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getFilename = function () {

        var wholename = me.resource.filename;

        return wholename.split('~').pop();
    };
};
