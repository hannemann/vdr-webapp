
Gui.Recordings.ViewModel.List.Recording = function () {};

Gui.Recordings.ViewModel.List.Recording.prototype = new VDRest.Abstract.ViewModel();

Gui.Recordings.ViewModel.List.Recording.prototype.cacheKey = 'number';

Gui.Recordings.ViewModel.List.Recording.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

Gui.Recordings.ViewModel.List.Recording.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};

Gui.Recordings.ViewModel.List.Recording.prototype.initViewMethods = function () {

    var me = this;

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getStartDate = function () {

        if (!me.startDate) {
            me.startDate = new Date(me.resource.event_start_time * 1000);
        }

        return me.startDate;
    };

    this.data.view.getEndDate = function () {

        if (!me.endDate) {
            me.endDate = new Date(me.getStartDate().getTime() + me.resource.duration);
        }

        return me.endDate;
    };
};