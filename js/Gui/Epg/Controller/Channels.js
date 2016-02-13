/**
 * @class
 * @constructor
 * @property {string} currentGroup
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
    this.groups = [];
    this.channelsCSS = new VDRest.Lib.StyleSheet();
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
};

/**
 * dispatch
 */
Gui.Epg.Controller.Channels.prototype.dispatchView = function () {

    this.broadcastsController = this.module.getController('Broadcasts');

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.showGroup();

    this.preventReload()
        .addObserver();

    if (this.dataModel.getCollection().length) {
        this.iterateChannels({
            "iterate": this.dataModel.collectionIterator.bind(this.dataModel)
        });
    }

    this.broadcastsWrapper = this.broadcastsController.view.wrapper.get(0);
};

/**
 * handle channelview event
 * @param {jQuery.Event} e
 * @param {Gui.Epg.Controller.Channels.Channel|{}} e.payload
 */
Gui.Epg.Controller.Channels.prototype.handleChannelView = function (e) {

    var i = 0, l = this.channelsList.length;

    if ("undefined" !== typeof this.broadcastsController.touchScroll) {
        setTimeout(function () {
            this.broadcastsController.touchScroll.enableScrollBars();
        }.bind(this), 200);
        this.broadcastsController.touchScroll.disableScrollBars();
    }

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        if (this.channelView) {

            this.channelView.unsetIsActive();
            this.module.getController('Broadcasts.List', this.channelView.keyInCache).detachChannelView();
        }

        this.channelView = e.payload.view;

        Gui.Epg.Controller.Broadcasts.List.prototype.isChannelView = true;

        this.module.getController('Broadcasts.List', this.channelView.keyInCache).attachChannelView();

        this.channelView.setIsActive();

    } else {

        this.channelView.unsetIsActive();
        this.module.getController('Broadcasts.List', this.channelView.keyInCache).detachChannelView();

        Gui.Epg.Controller.Broadcasts.List.prototype.isChannelView = false;

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

        var group = channelModel.getData('group');

        if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

            return true;
        }

        this.channelsList.push(this.module.getController('Channels.Channel', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

        if (this.groups.indexOf(group) < 0) {
            this.groups.push(group);
            this.channelsCSS.addRule(
                '#epg[data-show-group="' + group + '"]:not(.channel-view) .channel[data-channel-group="' + group + '"]',
                'display: block'
            );
        }

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
 * show channel group
 * @param {string} [group]
 */
Gui.Epg.Controller.Channels.prototype.showGroup = function (group) {

    var headline = VDRest.app.translate(this.module.headline),
        height, fullHeight;

    if (this.groups.indexOf(group) < 0) {
        group = 'all';
    } else {
        headline += ' - ' + group;
    }

    this.currentGroup = group;

    VDRest.app.getModule('Gui.Menubar')
        .getView('Default')
        .setTitle(headline);

    this.broadcastsController.view.unsetWrapperHeight();
    fullHeight = this.broadcastsController.view.wrapper.height();
    this.broadcastsController.view.setWrapperHeight('auto');

    this.module.getView('Epg').node[0].dataset['showGroup'] = group;

    height = this.broadcastsController.view.wrapper.height();

    if (height < fullHeight) {
        this.broadcastsController.view.setWrapperHeight(height);
    } else {
        this.broadcastsController.view.unsetWrapperHeight();
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