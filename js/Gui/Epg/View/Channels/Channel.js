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

    var image = this.getImage(), preload;

    if (image) {

        preload = $('<img src="' + image + '">');

        this.node.css({
            "background-image" : "url(" + image + ")"
        });

    } else {
        this.node.text(this.getName());
    }

    preload = undefined;

    return this;
};