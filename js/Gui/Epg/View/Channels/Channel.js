
Gui.Epg.View.Channels.Channel = function () {};

Gui.Epg.View.Channels.Channel.prototype = new VDRest.Abstract.View();

Gui.Epg.View.Channels.Channel.prototype.cacheKey = 'channel_id';

Gui.Epg.View.Channels.Channel.prototype.init = function () {

    this.channel = $('<div class="channel">');
};

Gui.Epg.View.Channels.Channel.prototype.render = function (parent) {

    this.setAttributes()
        .addLogo()

    this.channel.appendTo(parent);
};

Gui.Epg.View.Channels.Channel.prototype.setAttributes = function (parent) {

    this.channel.attr("data-channel-id", this.data.channel_id);

    return this;
};

Gui.Epg.View.Channels.Channel.prototype.addLogo = function (parent) {

    if (this.data.image) {

        this.channel.css({
            "background-image" : "url(" + this.data.image + ")"
        })
    }
    return this;
};