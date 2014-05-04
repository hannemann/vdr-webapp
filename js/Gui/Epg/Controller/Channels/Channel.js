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

    this.streamUrl = 'http://'
        + VDRest.config.getItem('host')
        + ':'
        + VDRest.config.getItem('streamdevPort')
        + '/' + VDRest.config.getItem('streamdevParams') + '/'
        + this.data.dataModel.data.stream;
};

/**
 * dispatch view, add observer
 */
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

            if (this.module.getController('Epg').getIsChannelView()) {

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

    if (!this.isMuted) {

        this.preventClick = undefined;
        this.channelClickTimeout = window.setTimeout($.proxy(function () {

            this.preventClick = true;
            e.preventDefault();

            if (true === VDRest.config.getItem('streamdevActive')) {

                window.location.href = this.streamUrl;
            }
        }, this), 1000);
    }
};