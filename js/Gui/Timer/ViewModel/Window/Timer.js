/**
 * @class
 * @constructor
 */
Gui.Timer.ViewModel.Window.Timer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Timer.ViewModel.Window.Timer.prototype = new Gui.Timer.ViewModel.List.Timer();

/**
 * @type {string}
 */
Gui.Timer.ViewModel.Window.Timer.prototype.cacheKey = 'id';

/**
 * initialize resources
 */
Gui.Timer.ViewModel.Window.Timer.prototype.init = function () {

    this.resource = this.data.resource;
    this.broadcast = this.data.broadcast;

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Timer.ViewModel.Window.Timer.prototype.initViewMethods = function () {

    var me = this;

    this.data.view.getBroadcast = function () {

        return me.broadcast;
    };

    this.data.view.getDate = function () {

        var date = new Date(me.data.resource.data.day);

        return VDRest.helper.getWeekDay(date, true) + '. ' + VDRest.helper.getDateString(date, true);
    };

    this.data.view.getStartTime = function () {

        return VDRest.helper.getTimeString(new Date(me.data.resource.data.start_timestamp));
    };

    this.data.view.getEndTime = function () {

        return VDRest.helper.getTimeString(new Date(me.data.resource.data.stop_timestamp))
    };

    this.data.view.getDirName = function () {

        return me.data.resource.data.filename.split('~').slice(0, -1).join('~');
    };

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this, this.data.broadcast, 'broadcast');

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getFilename = function () {

        var wholeName = me.data.resource.data.filename;

        return wholeName.split('~').pop();
    };
};
