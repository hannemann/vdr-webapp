
Gui.Epg.ViewModel.Broadcasts.List.Broadcast = function () {};

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.ViewModel();

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.init = function () {

    this.resource = this.data.resource.data;

    this.calculateWidth();

    this.initViewGetters(this.data.view, this.data.resource);
};

Gui.Epg.ViewModel.Broadcasts.List.Broadcast.prototype.calculateWidth = function () {

    var duration, from = this.module.getFromDate(), me = this;

    if (this.resource.start_date < from) {

        duration = Math.round((this.resource.end_date.getTime() / 1000 - from.getTime() / 1000))
    } else {
        duration = this.resource.duration;
    }

    // TODO: configurable width of an hour
    this.width = Math.round(duration / 30);

    this.data.view.getWidth = function () {

        return me.width;
    };
};