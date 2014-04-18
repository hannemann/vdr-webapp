
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

        var date = new Date(me.resource.event_start_time*1000), string = '';

        string += me.helper().getWeekDay(date, true) + '. ' + me.helper().getDateString(date, true);

        return string;
    };

    this.data.view.getDurationString = function () {

        return '(' + me.helper().getDurationAsString(this.getDuration()) + ')';
    };

    VDRest.Helper.prototype.parseDescription.call(this, this.resource.event_description);
};