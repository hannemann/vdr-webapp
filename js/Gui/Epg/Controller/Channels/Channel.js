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

    this.eventPrefix = 'channel_view.' + this.data.channel_id.replace(/\s/g, '.').toCacheKey();

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

    if (VDRest.helper.isTouchDevice) {
        this.view.node
            .on('touchend', this.handleUp.bind(this))
            .on('touchstart', this.handleDown.bind(this))
            .on('touchmove', this.preventAll.bind(this))
        ;
    } else {
        this.view.node
            .on('mouseup', this.handleUp.bind(this))
            .on('mousedown', this.handleDown.bind(this))
            .on('mousemove', this.preventAll.bind(this))
        ;
    }
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
Gui.Epg.Controller.Channels.Channel.prototype.handleUp = function (e) {

    e.preventDefault();

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.channelClickTimeout) {
                window.clearTimeout(this.channelClickTimeout);
            }

            if (this.module.getController('Epg').getIsChannelView()) {

                this.vibrate();

                this.module.getController('Channels').handleChannelView({"payload" : this});
            } else {

                VDRest.app.saveHistoryState(
                    this.eventPrefix + '.hashChanged',
                    this.module.toggleChannelView.bind(this.module),
                    'channelView'
                );
                this.module.toggleChannelView(this);
            }
        }
    }
    document.onselectstart = function () {
        return true
    };
};

/**
 * handle mousedown
 */
Gui.Epg.Controller.Channels.Channel.prototype.handleDown = function () {

    document.onselectstart = function () {
        return false
    };

    this.preventClick = undefined;
    if (!this.isMuted && VDRest.info.getStreamer()) {

        this.channelClickTimeout = window.setTimeout(function () {

            this.vibrate(100);

            this.preventClick = true;

            this.startStream();
        }.bind(this), 500);
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