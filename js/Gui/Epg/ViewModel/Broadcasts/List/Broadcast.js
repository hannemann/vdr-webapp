
Gui.Epg.ViewModel.Broadcasts.List.Broadcast = function () {};

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.ViewModel();

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.pixelPerSecond = 2/60;

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.init = function () {

    this.resource = this.data.resource.data;

    this.calculateMetrics();

    this.initViewMethods(this.data.view, this.data.resource);
};

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.calculateMetrics = function () {

    var duration,
        from = this.module.getFromDate(),
        width, left, right,
        me = this;

    if (this.resource.start_date < from) {

        duration = Math.round((this.resource.end_date.getTime() / 1000 - from.getTime() / 1000));
        left = 0;
    } else {
        duration = this.resource.duration;
        left = Math.round((this.resource.start_date.getTime() / 1000 - from.getTime() / 1000) * this.pixelPerSecond)
    }

    // TODO: configurable width of an hour
    width = Math.round(duration * this.pixelPerSecond);

    this.data.view.getWidth = function () {

        return width;
    };

    this.data.view.getLeft = function () {

        return left;
    };

    right = left + width;
    this.data.view.getRight = function () {

        return right;
    };
};