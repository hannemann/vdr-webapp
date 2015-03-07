/**
 * @class
 * @constructor
 */
Gui.Database.View.Sync = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.Sync.prototype = new VDRest.Abstract.View();

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.View.Sync.prototype.bypassCache = true;

/**
 * init nodes
 */
Gui.Database.View.Sync.prototype.init = function () {

    this.node = $('<div id="sync-info" class="window viewport-fullsize">');
    this.body = $('<div class="window-body">').appendTo(this.node);

    this.node.addClass('collapsed');
};

/**
 * render
 */
Gui.Database.View.Sync.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');

    this.addHeader();
};

/**
 * add Header
 */
Gui.Database.View.Sync.prototype.addHeader = function () {

    $('<div class="header">').text(VDRest.app.translate('Database sync')).appendTo(this.body);
};

Gui.Database.View.Sync.prototype.addStep = function (data) {

    var step = {};
    step.node = $('<div class="sync-step">');
    step.header = $('<div class="sync-step-header">').html(data.header).appendTo(step.node);
    step.message = $('<div class="sync-step-message">').appendTo(step.node);
    if (data.message) {
        step.message.html(data.message);
    }
    if (data.addProgress) {
        step.progressWrapper = $('<div>').addClass('progress-bar').appendTo(step.node);
        step.progressBar = $('<div>').css({"width": "0"}).appendTo(step.progressWrapper);
    }

    step.node.appendTo(this.body);

    return step;
};