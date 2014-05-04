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

    } else if (this.client instanceof Gui.Window.Controller.Timer) {

        type = new VDRest.Api.TimerAdapter.Timer();

    }

    return type.setData(this.client).normalize(this.client);
};
