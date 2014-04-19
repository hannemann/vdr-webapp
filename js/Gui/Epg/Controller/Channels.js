/**
 * @class
 * @constructor
 */
Gui.Epg.Controller.Channels = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Epg.Controller.Channels.prototype = new VDRest.Abstract.Controller();
Gui.Epg.Controller.Channels.prototype.isChannelView = false;

/**
 * init view and channelslist
 */
Gui.Epg.Controller.Channels.prototype.init = function () {

    this.view = this.module.getView('Channels');
    this.view.setParentView(this.data.parent.view);
    this.channelsList = [];
    this.dataModel = VDRest.app.getModule('VDRest.Epg').getModel('Channels');
};

/**
 * dispatch
 */
Gui.Epg.Controller.Channels.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();

    if (this.dataModel.getCollection().length) {
        this.iterateChannels({
            "iterate" : $.proxy(this.dataModel.collectionIterator, this.dataModel)
        });
    }

    this.broadcastsWrapper = this.module.getController('Broadcasts').view.wrapper.get(0);
};

/**
 * handle channelview event
 * @param {jQuery.Event} e
 */
Gui.Epg.Controller.Channels.prototype.handleChannelView = function (e) {

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        this.isChannelView = true;
        this.mute('all');
        this.unmute(e.payload);
        this.view.node.css({
            "top" : 0
        });

    } else {

        this.isChannelView = false;
        this.unmute('all');
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

    $(document).one('channelsloaded', $.proxy(this.iterateChannels, this));
    $(document).on('epg.scroll', $.proxy(this.handleScroll, this));
    $(document).on('epg.channelview', $.proxy(this.handleChannelView, this));
};

/**
 * remove event listners
 */
Gui.Epg.Controller.Channels.prototype.removeObserver = function () {

    $(document).off('epg.scroll', $.proxy(this.handleScroll, this));
    $(document).off('epg.channelview', $.proxy(this.handleChannelView, this));
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.Epg.Controller.Channels.prototype.iterateChannels = function (collection) {

    collection.iterate($.proxy(function (channelModel) {

        this.channelsList.push(this.module.getController('Channels.Channel', {
            "channel_id" : channelModel.data.channel_id,
            "parent" : this,
            "dataModel" : channelModel
        }));

    }, this));

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
 */
Gui.Epg.Controller.Channels.prototype.handleScroll = function () {

    var scroll = this.broadcastsWrapper.scrollTop * -1;

    if (!this.isChannelView) {

        this.offsetTop = this.offsetTop || parseInt(this.view.node.css('top'), 10);

        this.view.node.css({"top": scroll + this.offsetTop + 'px'});
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