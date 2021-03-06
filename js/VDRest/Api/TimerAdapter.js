/**
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast|Gui.Timer.Controller.Window.Timer|Gui.Timer.Controller.List.Timer} client
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

        if (this.client.data.timer instanceof VDRest.Timer.Model.List.Timer) {

            type = new VDRest.Api.TimerAdapter.Model();

        } else {

            type = new VDRest.Api.TimerAdapter.EpgBroadcast();
        }

    } else if (this.client instanceof Gui.Timer.Controller.Window.Timer) {

        type = new VDRest.Api.TimerAdapter.Timer();

    } else if (this.client instanceof Gui.Timer.Controller.List.Timer) {

        type = new VDRest.Api.TimerAdapter.List();

    } else if (this.client instanceof VDRest.Timer.Model.List.Timer) {

        type = new VDRest.Api.TimerAdapter.Model();

    } else if ("undefined" !== typeof this.client.type && this.client.type === 'generic') {

        type = new VDRest.Api.TimerAdapter.Generic();
    }

    return type.setData(this.client).normalize(this.client);
};
