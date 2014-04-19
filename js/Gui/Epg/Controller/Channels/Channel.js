
Gui.Epg.Controller.Channels.Channel = function () {};

Gui.Epg.Controller.Channels.Channel.prototype = new VDRest.Abstract.Controller();

Gui.Epg.Controller.Channels.Channel.prototype.cacheKey = 'channel_id';

Gui.Epg.Controller.Channels.Channel.prototype.isMuted = false;

Gui.Epg.Controller.Channels.Channel.prototype.init = function () {

    this.view = this.module.getView('Channels.Channel', {
        "channel_id" : this.data.channel_id
    });
    this.view.setParentView(this.data.parent.view);

    this.module.getViewModel('Channels.Channel', {
        "channel_id" : this.data.channel_id,
        "view" : this.view,
        "resource" : this.data.dataModel
    });

    this.streamUrl = 'http://'
        + VDRest.config.getItem('host')
        + ':'
        + VDRest.config.getItem('streamdevPort')
        + '/' + VDRest.config.getItem('streamdevParams') + '/'
        + this.data.dataModel.data.stream;
};

Gui.Epg.Controller.Channels.Channel.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * mute channel
 */
Gui.Epg.Controller.Channels.Channel.prototype.mute = function () {

    this.isMuted = true;
    this.view.node.addClass('is-muted');
};

/**
 * unmute channel
 */
Gui.Epg.Controller.Channels.Channel.prototype.unmute = function () {

    this.isMuted = false;
    this.view.node.removeClass('is-muted');
};

/**
 * add handler for up and down events
 */
Gui.Epg.Controller.Channels.Channel.prototype.addObserver = function () {

    this.view.node
        .on('mouseup', $.proxy(this.handleUp, this))
        .on('mousedown', $.proxy(this.handleDown, this));
};

/**
 * remove handler
 */
Gui.Epg.Controller.Channels.Channel.prototype.removeObserver = function () {

    this.view.node
        .off('mouseup', $.proxy(this.handleUp, this))
        .off('mousedown', $.proxy(this.handleDown, this));
};

/**
 * handle mouseup
 * @param {jQuery.Event} e
 * @returns {boolean}
 */
Gui.Epg.Controller.Channels.Channel.prototype.handleUp = function (e) {

    var channel = $(e.currentTarget).attr('data-channel-id');

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            if ("undefined" !== typeof this.channelClickTimeout) {
                window.clearTimeout(this.channelClickTimeout);
            }

            if (!this.module.getController('Epg').getIsChannelView()) {

                $.event.trigger({
                    "type" : "epg.channelview",
                    "payload" : this
                });

//                this.module.getView('Broadcasts').setIsChannelView();
//                this.module.getController('Channels').muteAll().view.setIsChannelView();
//                this.module.getView('Broadcasts.List', this.keyInCache).setIsActive();
//                this.view.setIsActive();

            } else {

                $.event.trigger({
                    "type" : "epg.channelview",
                    "payload" : false
                });
            }
        }
    }
};

/**
 * handle mousedown
 * @param {jQuery.Event} e
 */
Gui.Epg.Controller.Channels.Channel.prototype.handleDown = function (e) {

    if (!this.isMuted) {

        this.preventClick = undefined;
        this.channelClickTimeout = window.setTimeout($.proxy(function () {

            this.preventClick = true;
            e.preventDefault();

            if ("true" === VDRest.config.getItem('streamdevActive')) {

                window.location.href = this.streamUrl;
            }
        }, this), 1000);
    }
};
