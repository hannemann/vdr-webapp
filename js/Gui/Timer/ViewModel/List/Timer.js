
Gui.Timer.ViewModel.List.Timer = function () {};

Gui.Timer.ViewModel.List.Timer.prototype = new VDRest.Abstract.ViewModel();

Gui.Timer.ViewModel.List.Timer.prototype.cacheKey = 'id';

Gui.Timer.ViewModel.List.Timer.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Gui.Timer.ViewModel.List.Timer.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};

Gui.Timer.ViewModel.List.Timer.prototype.initViewMethods = function () {

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