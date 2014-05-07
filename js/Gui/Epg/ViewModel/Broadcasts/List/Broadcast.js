/**
 * @class
 * @constructor
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.ViewModel();

/**
 * cache key
 * @type {string}
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * pixels per second
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.pixelPerSecond = VDRest.config.getItem('pixelPerSecond');

/**
 * init view methods
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.init = function () {

    this.resource = this.data.resource.data;

    this.calculateMetrics();

    VDRest.Helper.prototype.parseDescription.call(this, this.resource.description);

    this.initViewMethods();
};

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.initViewMethods = function () {

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    /**
     * determine if is currently recording
     * @returns {object}
     */
    this.data.view.getIsRecording = function () {

        var date = new Date(), recordingStartDate, recordingEndDate;

        if (this.getTimerExists() && this.getTimerActive()) {

            recordingStartDate = this.getVps() > 0 && VDRest.config.getItem('autoVps')
                ? new Date(this.getVps() * 1000)
                : new Date((this.getStartTime() - VDRest.config.getItem('recordingStartGap')) * 1000);

            recordingEndDate = new Date((this.getEndTime() + VDRest.config.getItem('recordingEndGap')) * 1000);

            if (date > recordingStartDate && date < recordingEndDate) {

                return true;
            }
        }

        return  false;
    };
};

/**
 * decorate view with methods to retrieve its metrics
 */
Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.calculateMetrics = function () {

    var duration,
        from = this.module.getFromDate(),
        width, left, right, me = this;

    if (this.resource.start_date < from) {

        duration = Math.round((this.resource.end_date.getTime() / 1000 - from.getTime() / 1000));
        left = 0;
    } else {
        duration = this.resource.duration;
        left = Math.round((this.resource.start_date.getTime() / 1000 - from.getTime() / 1000) * this.pixelPerSecond)
    }

    width = Math.round(duration * this.pixelPerSecond);

    /**
     * retrieve desired width of node
     * @returns {number}
     */
    this.data.view.getWidth = function () {

        return width;
    };

    /**
     * retrieve desired offset of node from left
     * @returns {number}
     */
    this.data.view.getLeft = function () {

        return left;
    };

    right = left + width;
    /**
     * retrieve desired offset of nodes right border from left
     * @returns {number}
     */
    this.data.view.getRight = function () {

        return right;
    };
    /**
     * retrieve offset of nodes relative to visible area
     * @returns {object}
     */
    this.data.view.getOffset = function () {

        return me.data.view.node.offset();
    };

    return this;
};


