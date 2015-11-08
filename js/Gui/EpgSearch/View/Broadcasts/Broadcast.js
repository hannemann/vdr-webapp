/**
 * @class
 * @constructor
 */
Gui.EpgSearch.View.Broadcasts.Broadcast = function () {};

/**
 * @type {Gui.Epg.View.Broadcasts.List.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype = new Gui.Epg.View.Broadcasts.List.Broadcast();

/**
 * render dom
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.addImage();
    this.addChannel();
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.setWidth = function () {

    return this;
};

/**
 * @returns {number}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.getWidth = function () {

    return window.innerWidth;
};

/**
 * override method as its not needed here
 * @returns {Gui.EpgSearch.View.Broadcast}
 */
Gui.EpgSearch.View.Broadcasts.Broadcast.prototype.addChannel = function () {

    var channelView;

    if (!this.channel) {

        channelView = VDRest.app.getModule('Gui.Epg').getView('Channels.Channel', this.getChannel());

        if ("function" === typeof channelView.hasImage && channelView.hasImage()) {

            this.channel = $('<div>').addClass('channel-logo');

            if (VDRest.config.getItem('indicateChannelHD') && this.getChannelName().match(/HD$/)) {
                this.channel.get(0).dataset['hd'] = "true";
            }

            $('<img>')
                .attr(
                'src', channelView.getImage()
            ).appendTo(this.channel);

            if ("undefined" !== typeof this.channelViewImage) {
                this.channel.insertAfter(this.channelViewImage);
            } else {
                this.channel.prependTo(this.channelView);
            }

        } else {

            this.channel = $('<span class="channel">')
                .text(this.getChannelName())
                .appendTo(this.channelView);
        }
    }
};
