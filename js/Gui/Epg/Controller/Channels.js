/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Channels = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();

/**
 * @type {Gui.Epg.View.Channels.Channel|boolean}
 */
Gui.Epg.Controller.Channels.prototype.channelView = false;

/**
 * init view and channelslist
 */
Gui.Epg.Controller.Channels.prototype.init = function () {

    this.view = this.module.getView('Channels');
    this.node = this.view.node.get(0);
    this.view.setParentView(this.data.parent.view);
    this.channelsList = [];
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
};

/**
 * dispatch
 */
Gui.Epg.Controller.Channels.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.preventReload()
        .addObserver();

    if (this.dataModel.getCollection().length) {
        this.iterateChannels({
            "iterate": this.dataModel.collectionIterator.bind(this.dataModel)
        });
    }

    this.broadcastsWrapper = this.module.getController('Broadcasts').view.wrapper.get(0);
};

/**
 * handle channelview event
 * @param {jQuery.Event} e
 * @param {Gui.Epg.Controller.Channels.Channel|{}} e.payload
 */
Gui.Epg.Controller.Channels.prototype.handleChannelView = function (e) {

    var i = 0, l = this.channelsList.length;

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        if (this.channelView) {

            this.channelView.unsetIsActive();
            this.module.getController('Broadcasts.List', this.channelView.keyInCache).detachChannelView();
        }

        this.channelView = e.payload.view;

        for (i; i < l; i++) {

            this.module.getController('Broadcasts.List', this.channelsList[i].keyInCache).isChannelView = true;
        }
        this.module.getController('Broadcasts.List', this.channelView.keyInCache).attachChannelView();

        this.channelView.setIsActive();

    } else {

        this.channelView.unsetIsActive();
        this.module.getController('Broadcasts.List', this.channelView.keyInCache).detachChannelView();

        for (i; i < l; i++) {

            this.module.getController('Broadcasts.List', this.channelsList[i].keyInCache).isChannelView = false;
        }

        this.channelView = false;
        this.handleScroll();
    }
};

/**
 * mute all or specific channel
 * @param channel
 */
Gui.Epg.Controller.Channels.prototype.mute = function (channel) {

    var i = 0, l = this.channelsList.length;

    if ("all" === channel) {

        for (i; i<l; i++) {

            this.channelsList[i].mute();
        }
    } else {

        channel.mute();
    }
};

/**
 * unmute all or specific channel
 * @param channel
 */
Gui.Epg.Controller.Channels.prototype.unmute = function (channel) {

    var i = 0, l = this.channelsList.length;

    if ("all" === channel) {

        for (i; i<l; i++) {

            this.channelsList[i].unmute();
        }
    } else {

        channel.unmute();
    }
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Channels.prototype.addObserver = function () {

    $document.one('channelsloaded', this.iterateChannels.bind(this));
    $document.on('epg.channelview', this.handleChannelView.bind(this));
};

/**
 * remove event listners
 */
Gui.Epg.Controller.Channels.prototype.removeObserver = function () {

    $document.off('epg.channelview');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.Epg.Controller.Channels.prototype.iterateChannels = function (collection) {

    collection.iterate(function (channelModel) {

        if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

            return true;
        }

        this.channelsList.push(this.module.getController('Channels.Channel', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

    }.bind(this));

    this.dispatchChannels();
};

/**
 * iterate list and dispatch members
 */
Gui.Epg.Controller.Channels.prototype.dispatchChannels = function () {

    var i= 0, l=this.channelsList.length;

    for (i;i<l;i++) {
        this.channelsList[i].dispatchView();
    }
};

/**
 * handle scroll events
 * @param {{x: Number, y: Number, jsStyle: String}|Event} [e]
 */
Gui.Epg.Controller.Channels.prototype.handleScroll = function (e) {

    var scroll = (e && e.y) ? e.y : this.broadcastsWrapper.scrollTop * -1;

    e = e || {};

    if (!this.channelView) {
        e.jsStyle = e.jsStyle || TouchMove.Helper.getTransformVendorPrefix(this.node).jsStyle;
        this.node.style[e.jsStyle] = "translateY(" + scroll + "px)";
    }
};

/**
 * destruct
 */
Gui.Epg.Controller.Channels.prototype.destructView = function () {

    var i= 0, l=this.channelsList.length;

    for (i;i<l;i++) {

        this.channelsList[i].destructView();
    }

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};