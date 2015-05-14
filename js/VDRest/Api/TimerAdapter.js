/**
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast|Gui.Window.Controller.Timer} client
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.Timer}
 * @constructor
 */
VDRest.Api.TimerAdapter = function (client) {

    this.client = client;

    return this.getTypeInstance();
};

/**
 * retrieve type instance
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.Timer}
 */
VDRest.Api.TimerAdapter.prototype.getTypeInstance = function () {

    var type;

    if (this.client instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        type = new VDRest.Api.TimerAdapter.EpgBroadcast();

    } else if (this.client instanceof Gui.Timer.Controller.Window.Timer) {

        type = new VDRest.Api.TimerAdapter.Timer();

    } else if ("undefined" !== typeof this.client.type && this.client.type === 'generic') {

        type = new VDRest.Api.TimerAdapter.Generic();
    }

    return type.setData(this.client).normalize(this.client);
};
