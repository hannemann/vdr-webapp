/**
 * @class
 * @constructor
 */
Gui.Recordings.ViewModel.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Recordings.ViewModel.List.Recording.prototype = new VDRest.Abstract.ViewModel();

/**
 * @type {string}
 */
Gui.Recordings.ViewModel.List.Recording.prototype.cacheKey = 'file_name';

/**
 * date regex
 * @type {RegExp}
 */
Gui.Recordings.ViewModel.List.Recording.prototype.dateReg = /([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})/;

/**
 * initilize view
 */
Gui.Recordings.ViewModel.List.Recording.prototype.init = function () {

    this.initViewMethods();
};

/**
 * add specific methods to view
 */
Gui.Recordings.ViewModel.List.Recording.prototype.initViewMethods = function () {

    var me = this;

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getStartDate = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getWeekDay(date, true) + '. ' + me.helper().getDateString(date, true);

        return string;
    };

    this.data.view.getStartTime = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getTimeString(date);

        return string;
    };

    this.data.view.getStartDateTime = function () {

        var date = new Date(me.data.resource.data.event_start_time * 1000), string = '';

        string += me.helper().getWeekDay(date, true) + '. ' + me.helper().getDateTimeString(date, true);

        return string;
    };

    this.data.view.getDurationString = function () {

        return '(' + me.helper().getDurationAsString(this.getDuration()) + ')';
    };

    this.data.view.getNormalizedFileName = function () {

        return me.data.view.getName().split('~').pop();
    };

    this.data.view.getPath = function () {

        return me.data.view.getName().split('~').slice(0, -1).join('~');
    };

    VDRest.Helper.prototype.parseDescription.call(this, this.data.resource.data.event_description);
};