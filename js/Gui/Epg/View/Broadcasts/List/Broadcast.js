
Gui.Epg.View.Broadcasts.List.Broadcast = function () {};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.cacheKey = 'channel/id';

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.init = function () {

    this.node = $('<div class="broadcast"><div></div></div>');
};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.decorate = function () {

    this.setWidth().addClasses().addTitle();
};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.setWidth = function () {

    this.node.css({
        "width" : this.getWidth() + 'px',
        "left" : this.getLeft() + 'px'
    });

    return this;
};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addClasses = function () {

    var classNames = [];

    if (this.getTimerActive()) {
        classNames.push('active-timer');
    }

    this.node.addClass(classNames.join(' '));
    return this;
};

Gui.Epg.View.Broadcasts.List.Broadcast.prototype.addTitle = function () {

    this.node.find('div').text(this.getTitle());

    return this;
};
