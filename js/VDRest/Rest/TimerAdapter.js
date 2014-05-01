/**
 * @param obj
 * @returns {VDRest.Rest.TimerAdapter.EpgBroadcast|VDRest.Rest.TimerAdapter.TimerEdit}
 * @constructor
 */
VDRest.Rest.TimerAdapter = function (obj) {

    return this.getTypeInstance(obj);
};

/**
 * retrieve type instance
 * @param {VDRest.Epg.Model.Channels.Channel.Broadcast|Gui.Window.Controller.TimerEdit} obj
 * @returns {VDRest.Rest.TimerAdapter.EpgBroadcast|VDRest.Rest.TimerAdapter.TimerEdit}
 */
VDRest.Rest.TimerAdapter.prototype.getTypeInstance = function (obj) {

    var type;

    if (obj instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        type = new VDRest.Rest.TimerAdapter.EpgBroadcast();

    } else if (obj instanceof Gui.Window.Controller.TimerEdit) {

        type = new VDRest.Rest.TimerAdapter.TimerEdit();

    }

    return type.normalize(obj);
};
