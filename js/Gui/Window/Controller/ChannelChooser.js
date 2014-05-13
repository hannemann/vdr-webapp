/**
 * @class
 * @constructor
 */
Gui.Window.Controller.ChannelChooser = function () {};

/**
 * @type {Gui.Window.Controller.Select}
 */
Gui.Window.Controller.ChannelChooser.prototype = new Gui.Window.Controller.Select();

/**
 * retrieve channels, initialize view
 */
Gui.Window.Controller.ChannelChooser.prototype.init = function () {

    this.eventPrefix = 'window.channelChooser';

    this.getChannels();

    this.view = this.module.getView('ChannelChooser', this.data);

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * fetch channels and add them to data object
 */
Gui.Window.Controller.ChannelChooser.prototype.getChannels = function () {

    var collection = VDRest.app.getModule('VDRest.Epg').getModel('Channels').getCollection(),
        i = 0, l = collection.length;

    this.data.values = {};

    for (i;i<l;i++) {

        this.data.values[i] = {};

        this.data.values[i].label = collection[i].getData('name');

        if (collection[i].hasData('image')) {

            this.data.values[i].image = collection[i].getData('image');
        }

        this.data.values[i].value = collection[i].getData('channel_id');
    }

};