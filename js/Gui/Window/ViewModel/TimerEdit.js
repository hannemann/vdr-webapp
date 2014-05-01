/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.TimerEdit = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.TimerEdit.prototype = new Gui.Timer.ViewModel.List.Timer();

/**
 * initialize resources
 */
Gui.Window.ViewModel.TimerEdit.prototype.init = function () {

    this.resource = this.data.resource;
    this.broadcast = this.data.broadcast;

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Window.ViewModel.TimerEdit.prototype.initViewMethods = function () {

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

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this, this.broadcast.data, 'broadcast');

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);
};
