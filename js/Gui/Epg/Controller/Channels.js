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
 * @param {object} e
 * @property {Gui.Epg.Controller.Channels.Channel|boolean} payload
 */
Gui.Epg.Controller.Channels.prototype.handleChannelView = function (e) {

    var i = 0, l = this.channelsList.length;

    if (e.payload instanceof Gui.Epg.Controller.Channels.Channel) {

        if (this.channelView) {

            this.channelView.unsetIsActive();
            this.module.getController('Broadcasts.List', this.channelView.keyInCache).detachChannelView();
        }

        this.channelView = e.payload.view;
        this.module.getController('Broadcasts.List', this.channelView.keyInCache).attachChannelView();

        for (i; i < l; i++) {

            this.module.getController('Broadcasts.List', this.channelsList[i].keyInCache).isChannelView = true;
        }

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
 * save current scroll position
 */
Gui.Epg.Controller.Channels.prototype.saveState = function () {

    this.setData('top', this.view.node.position().top);
};

/**
 * recover scroll position
 */
Gui.Epg.Controller.Channels.prototype.recoverState = function () {

    this.view.node.css({"top" : this.getData('top') + "px"});
};

/**
 * add event listeners
 */
Gui.Epg.Controller.Channels.prototype.addObserver = function () {

    $(document).one('channelsloaded', $.proxy(this.iterateChannels, this));
    $(document).on('epg.channelview', $.proxy(this.handleChannelView, this));
};

/**
 * remove event listners
 */
Gui.Epg.Controller.Channels.prototype.removeObserver = function () {

    $(document).off('epg.channelview');
};

/**
 * iterate data model collection
 * @param {object} collection
 */
Gui.Epg.Controller.Channels.prototype.iterateChannels = function (collection) {

    collection.iterate($.proxy(function (channelModel) {

        if (!VDRest.config.getItem('showRadio') && channelModel.data.is_radio && channelModel.data.is_radio === true) {

            return true;
        }

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

    if (!this.channelView) {
        this.node.style.transform = "translateY(" + scroll + "px)";
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