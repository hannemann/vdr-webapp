/**
 * @param obj
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.TimerEdit}
 * @constructor
 */
VDRest.Api.TimerAdapter = function (obj) {

    return this.getTypeInstance(obj);
};

/**
 * retrieve type instance
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast|Gui.Window.Controller.TimerEdit} obj
 * @returns {VDRest.Api.TimerAdapter.EpgBroadcast|VDRest.Api.TimerAdapter.TimerEdit}
 */
VDRest.Api.TimerAdapter.prototype.getTypeInstance = function (obj) {

    var type;

    if (obj instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        type = new VDRest.Api.TimerAdapter.EpgBroadcast();

    } else if (obj instanceof Gui.Window.Controller.TimerEdit) {

        type = new VDRest.Api.TimerAdapter.TimerEdit();

    }

    return type.normalize(obj);
};
