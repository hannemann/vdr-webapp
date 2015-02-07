/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Channels.Channel = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Channels.Channel.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.Epg.Controller.Channels.Channel.prototype.cacheKey = 'channel_id';

/**
 * @type {boolean}
 */
Gui.Epg.Controller.Channels.Channel.prototype.isMuted = false;

/**
 * initialize view, streamurl
 */
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

    this.addObserver();
};

/**
 * dispatch view, add observer
 */
Gui.Epg.Controller.Channels.Channel.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
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
        .on('mouseup touchend', this.handleUp.bind(this))
        .on('mousedown touchstart', this.handleDown.bind(this))
        .on('mousemove touchmove', this.preventAll.bind(this))
    ;
};

/**
 * remove handler
 */
Gui.Epg.Controller.Channels.Channel.prototype.removeObserver = function () {

    this.view.node.off('touchend touchstart mouseup mousedown mousemove touchmove');
};

/**
 * handle mouseup
 */
Gui.Epg.Controller.Channels.Channel.prototype.handleUp = function () {

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            if ("undefined" !== typeof this.channelClickTimeout) {
                window.clearTimeout(this.channelClickTimeout);
            }

            if (this.module.getController('Epg').getIsChannelView()) {

                this.vibrate();

                this.module.getController('Channels').handleChannelView({"payload" : this});
            }
        }
    }
};

/**
 * handle mousedown
 * @param {jQuery.Event} e
 */
Gui.Epg.Controller.Channels.Channel.prototype.handleDown = function (e) {

    if (!this.module.getController('Epg').getIsChannelView()) {
        e.preventDefault();
        this.vibrate();
    }

    if (!this.isMuted && VDRest.info.getStreamer()) {

        this.preventClick = undefined;
        this.channelClickTimeout = window.setTimeout($.proxy(function () {

            this.vibrate(100);

            this.preventClick = true;

            this.startStream();
        }, this), 500);
    }
};

/**
 * prevent all actions
 */
Gui.Epg.Controller.Channels.Channel.prototype.preventAll = function () {

    if (this.module.getController('Epg').getIsChannelView()) {

        this.preventClick = true;

        if ("undefined" !== typeof this.channelClickTimeout) {
            window.clearTimeout(this.channelClickTimeout);
        }
    }
};

/**
 * start streaming
 * @param {VDRest.Epg.Model.Channels.Channel} [channel]
 */
Gui.Epg.Controller.Channels.Channel.prototype.startStream = function (channel) {

    var windowModule = VDRest.app.getModule('Gui.Window');

    channel = channel || this.data.dataModel;

    if (VDRest.info.canUseHtmlPlayer()) {

        if (windowModule.hasVideoPlayer()) {
            windowModule.getVideoPlayer().changeSrc(channel);
        } else {
            $.event.trigger({
                "type" : "window.request",
                "payload" : {
                    "type" : "VideoPlayer",
                    "data" : {
                        "sourceModel" : channel
                    }
                }
            });
        }

    } else {
        window.location.href = channel.getStreamUrl();
    }
};