/**
 * @name Gui.Epg.View.Channels.Channel#getImage
 * @function
 * @returns {string}
 */
/**
 * @name Gui.Epg.View.Channels.Channel#getChannelId
 * @function
 * @returns {string}
 */
/**
 * @name Gui.Epg.View.Channels.Channel#getGroup
 * @function
 * @returns {string}
 */
/**
 * @name Gui.Epg.View.Channels.Channel#getName
 * @function
 * @returns {string}
 */

/**
 * @class
 * @constructor
 * @property {jQuery} node
 * @property {jQuery} mute
 */
Gui.Epg.View.Channels.Channel = function () {};

/**
 * @type {View|VDRest.Lib.Cache.store.View|{Window}}
 */
Gui.Epg.View.Channels.Channel.prototype = new VDRest.Abstract.View();

/**
 * @type {string}
 */
Gui.Epg.View.Channels.Channel.prototype.cacheKey = 'channel_id';

/**
 * initialize
 */
Gui.Epg.View.Channels.Channel.prototype.init = function () {

    this.node = $('<div class="channel">');
    this.mute = $('<div class="mute">').appendTo(this.node);
};

/**
 * render
 */
Gui.Epg.View.Channels.Channel.prototype.render = function () {

    this.setAttributes()
        .addLogo();

    VDRest.Abstract.View.prototype.render.call(this);
};

/**
 * apply attributes
 * @return {Gui.Epg.View.Channels.Channel}
 */
Gui.Epg.View.Channels.Channel.prototype.setAttributes = function () {

    this.node.attr("data-channel-id", this.getChannelId());
    this.node.attr("data-channel-group", this.getGroup());

    return this;
};

/**
 * add logo
 * @return {Gui.Epg.View.Channels.Channel}
 */
Gui.Epg.View.Channels.Channel.prototype.addLogo = function () {

    var image = this.getImage(), name = this.getName();

    if (image) {

        this.node.css({
            "background-image" : "url(" + image + ")"
        });

        if (VDRest.config.getItem('indicateChannelHD') && name.match(/HD$/)) {
            this.node[0].dataset['hd'] = "true";
        }

    } else {
        this.node.text(name);
    }

    return this;
};

/**
 * channel as active
 */
Gui.Epg.View.Channels.Channel.prototype.setIsActive = function () {

    this.node.addClass('active');
};

/**
 * set channel inactive
 */
Gui.Epg.View.Channels.Channel.prototype.unsetIsActive = function () {

    this.node.removeClass('active');
};

/**
 * scroll channel into view
 */
Gui.Epg.View.Channels.Channel.prototype.scrollIntoView = function () {

    var p = this.node.parent(), o, scroll;

    o = this.node.offset().left - document.body.getBoundingClientRect().left + p.get(0).scrollLeft;

    scroll = o - parseInt(p.width() / 2, 10) + parseInt(this.node.width() / 2, 10);
    p.animate({
        "scrollLeft": scroll
    });
};
