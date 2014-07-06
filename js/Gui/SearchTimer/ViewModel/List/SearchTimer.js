/**
 * @class
 * @constructor
 */
Gui.SearchTimer.ViewModel.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.SearchTimer.ViewModel.List.SearchTimer.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.SearchTimer.ViewModel.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * date regex
 * @type {RegExp}
 */
Gui.SearchTimer.ViewModel.List.SearchTimer.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

/**
 * init resource
 */
Gui.SearchTimer.ViewModel.List.SearchTimer.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};

/**
 * add timer specific methods to view
 */
Gui.SearchTimer.ViewModel.List.SearchTimer.prototype.initViewMethods = function () {

    var me = this, helper = this.helper();

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getStartDate = function () {

        if (!me.startDate) {
            me.startDate = helper.strToDate(me.resource.start_timestamp, me.dateReg);
        }

        return me.startDate;
    };

    this.data.view.getEndDate = function () {

        if (!me.endDate) {
            me.endDate = helper.strToDate(me.resource.stop_timestamp, me.dateReg);
        }

        return me.endDate;
    };
};
