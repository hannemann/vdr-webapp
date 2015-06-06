/**
 * @class
 * @constructor
 * @var {jQuery} node
 * @method getImage
 */
Gui.Epg.View.Channels.Channel = function () {};

Gui.Epg.View.Channels.Channel.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Channels.Channel.prototype.cacheKey = 'channel_id';

Gui.Epg.View.Channels.Channel.prototype.init = function () {

    this.node = $('<div class="channel">');
    this.mute = $('<div class="mute">').appendTo(this.node);
};

Gui.Epg.View.Channels.Channel.prototype.render = function () {

    this.setAttributes()
        .addLogo();

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Epg.View.Channels.Channel.prototype.setAttributes = function () {

    this.node.attr("data-channel-id", this.getChannelId());

    return this;
};

Gui.Epg.View.Channels.Channel.prototype.addLogo = function () {

    var image = this.getImage(), name = this.getName();

    if (image) {

        image.preload = $('<img src="' + image + '">');

        this.node.css({
            "background-image" : "url(" + image + ")"
        });

        if (VDRest.config.getItem('indicateChannelHD') && name.match(/HD$/)) {
            this.node[0].dataset['hd'] = "true";
        }

    } else {
        this.node.text(name);
    }

    image.preload = undefined;

    return this;
};

Gui.Epg.View.Channels.Channel.prototype.setIsActive = function () {

    this.node.addClass('active');
};

Gui.Epg.View.Channels.Channel.prototype.unsetIsActive = function () {

    this.node.removeClass('active');
};

Gui.Epg.View.Channels.Channel.prototype.scrollIntoView = function () {

    var p = this.node.parent(), o, scroll;

    o = this.node.offset().left + p.get(0).scrollLeft;

    scroll = o - parseInt(p.width() / 2, 10) + parseInt(this.node.width() / 2, 10);
    p.animate({
        "scrollLeft": scroll
    });
};
