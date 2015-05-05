/**
 * @class
 * @constructor
 */
Gui.Timer.ViewModel.List.Timer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Timer.ViewModel.List.Timer.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.Timer.ViewModel.List.Timer.prototype.cacheKey = 'id';

/**
 * date regex
 * @type {RegExp}
 */
Gui.Timer.ViewModel.List.Timer.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

/**
 * init resource
 */
Gui.Timer.ViewModel.List.Timer.prototype.init = function () {

    this.initViewMethods();
};

/**
 * add timer specific methods to view
 */
Gui.Timer.ViewModel.List.Timer.prototype.initViewMethods = function () {

    var me = this, helper = this.helper();

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getStartDate = function () {

        if (!me.startDate) {
            me.startDate = helper.strToDate(me.data.resource.data.start_timestamp, me.dateReg);
        }

        return me.startDate;
    };

    this.data.view.getEndDate = function () {

        if (!me.endDate) {
            me.endDate = helper.strToDate(me.data.resource.data.stop_timestamp, me.dateReg);
        }

        return me.endDate;
    };
};
