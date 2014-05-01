/**
 * @param obj
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.Timer}
 * @constructor
 */
VDRest.Api.TimerAdapter = function (obj) {

    return this.getTypeInstance(obj);
};

/**
 * retrieve type instance
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast|Gui.Window.Controller.Timer} obj
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.Timer}
 */
VDRest.Api.TimerAdapter.prototype.getTypeInstance = function (obj) {

    var type;

    if (obj instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        type = new VDRest.Api.TimerAdapter.EpgBroadcast();

    } else if (obj instanceof Gui.Window.Controller.Timer) {

        type = new VDRest.Api.TimerAdapter.Timer();

    }

    return type.normalize(obj);
};
