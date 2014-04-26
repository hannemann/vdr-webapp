/**
 * @class
 * @constructor
 */
Gui.Window.Controller.TimerEdit = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.Controller.TimerEdit.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {string}
 */
Gui.Window.Controller.TimerEdit.prototype.cacheKey = 'id';

/**
 * init view and viewmodel
 */
Gui.Window.Controller.TimerEdit.prototype.init = function () {

    this.broadcast = new VDRest.Lib.Object();

    this.eventPrefix = 'window.timeredit-' + this.data.id;

    this.view = this.module.getView('TimerEdit', this.data);

    if (this.data.resource.event_id > 0) {

        this.broadcast = VDRest.app.getModule('VDRest.Epg')
            .loadModel(
            'Channels.Channel.Broadcast',
            this.data.resource.channel + '/' + this.data.resource.event_id
        );

        this.view.setHasBroadcast();
    }

    VDRest.helper.log(this.data.resource, this.broadcast);

    this.module.getViewModel('TimerEdit', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.data.resource,
        "broadcast" : this.broadcast
    });

    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch view
 */
Gui.Window.Controller.TimerEdit.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.Window.Controller.TimerEdit.prototype.addObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.on('click', $.proxy(this.animateImageAction, this));
    }

    this.view.deleteButton.on('click', $.proxy(this.deleteTimer, this));

    $(document).one('timer-changed.' + this.keyInCache, $.proxy(this.destroyTimer, this));

    Gui.Window.Controller.Abstract.prototype.addObserver.call(this);
};

/**
 * remove event listeners
 */
Gui.Window.Controller.TimerEdit.prototype.removeObserver = function () {

    if (this.view.hasBroadcast && this.view.hasBroadcastImages()) {

        this.view.image.off('click');
    }

    this.view.deleteButton.off('click', $.proxy(this.deleteTimer, this));

    $(document).off('timer-changed.' + this.keyInCache, $.proxy(this.destroyTimer, this));
};

/**
 * trigger timer delete
 */
Gui.Window.Controller.TimerEdit.prototype.deleteTimer = function () {


    VDRest.Rest.actions.deleteTimer(this);
};

/**
 * trigger timer delete
 */
Gui.Window.Controller.TimerEdit.prototype.destroyTimer = function () {

    if (this.broadcast instanceof VDRest.Epg.Model.Channels.Channel.Broadcast) {

        // tell epg to delete indicators
        $.event.trigger('timer-changed.' + this.broadcast.keyInCache);
    }

    // delete list entry
    VDRest.app.getModule('Gui.Timer').getController('List.Timer', this.keyInCache).destructView();

    // destroy myself
    history.back();
};

/**
 * trigger image animation
 */
Gui.Window.Controller.TimerEdit.prototype.animateImageAction = function () {

    this.view.animateImage();
};

/**
 * Destroy
 */
Gui.Window.Controller.TimerEdit.prototype.destructView = function () {

    var me = this;
    // apply animation
    this.view.node.toggleClass('collapse expand');
    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        Gui.Window.Controller.Abstract.prototype.destructView.call(me);
    });
};