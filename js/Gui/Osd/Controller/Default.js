/**
 * @class
 * @constructor
 */
Gui.Osd.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Osd.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.parentView = VDRest.app.getModule('Gui.Viewport').getView('Default');

    this.view.setParentView(this.parentView);

    this.dataModel = VDRest.app.getModule('VDRest.Osd').getModel('Osd');
    this.remote = VDRest.app.getModule('Gui.Remote');
    this.errors = 0;
};

/**
 * initialize view
 */
Gui.Osd.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.addObserver();
    this.dataModel.loadOsd();
    this.remote.dispatch(this.parentView);
    this.scrollAfterLoad = true;
    this.startRefreshInterval();
};

/**
 * add event listeners
 */
Gui.Osd.Controller.Default.prototype.addObserver = function () {

    var me = this;

    $(document).on('osdloaded', this.refreshView.bind(this));

    $(document).on('remotekeypress', this.handleRemotePress.bind(this));

    this.view.red && this.view.red.on('click', this.sendKey.bind(this, 'Red'));
    this.view.green && this.view.green.on('click', this.sendKey.bind(this, 'Green'));
    this.view.yellow && this.view.yellow.on('click', this.sendKey.bind(this, 'Yellow'));
    this.view.blue && this.view.blue.on('click', this.sendKey.bind(this, 'Blue'));

    if (this.getData('TextOsd')) {
        this.view.items.forEach(function (item) {

            item.on('click', me.addItemEvent.bind(me, item));
        });
    }

    return this;
};

/**
 * remove event listeners
 */
Gui.Osd.Controller.Default.prototype.removeObserver = function () {

    $(document).off('osdloaded');

    $(document).off('remotekeypress');

    this.view.red    && this.view.red.off('click');
    this.view.green  && this.view.green.off('click');
    this.view.yellow && this.view.yellow.off('click');
    this.view.blue   && this.view.blue.off('click');

    if (this.getData('TextOsd')) {
        this.view.items.forEach(function (item) {

            item.off('click');
        });
    }

    return this;
};

/**
 * add event to item
 * @param {jQuery} item
 * @param {jQuery.Event} e
 */
Gui.Osd.Controller.Default.prototype.addItemEvent = function (item, e) {

    var rows = $(this.view.osd).find('tr'),
        cells = item.find('td'),
        selectedIndex, touchedIndex, delta, dir, seq = [], i= 0, key = null;

    selectedIndex = rows.index(this.view.selectedItem);
    touchedIndex = rows.index($(item));
    delta = touchedIndex-selectedIndex;
    dir = delta > 0 ? 'Down' : 'Up';

    if (1 === cells.length) {
        for (i;i< Math.abs(delta);i++) {
            seq.push(dir);
        }
        seq.push('Ok');
    } else if (2 === cells.length) {

        if (cells[0].classList.contains('list-key') && e.target == cells[1]){
            if (item == this.view.selectedItem) {

                    key = 'Ok';
            } else {
                for (i;i< Math.abs(delta);i++) {
                    seq.push(dir);
                }
                seq.push('Ok');
            }
        } else {
            for (i;i< Math.abs(delta);i++) {
                seq.push(dir);
            }
            if (e.target == cells[0]) {
                seq.push('Left');
            }
            if (e.target == cells[1]) {
                seq.push('Right');
            }
        }
    } else {
        for (i;i< Math.abs(delta);i++) {
            seq.push(dir);
        }
    }

    if (key) {
        this.sendKey(key);
    } else if (seq.length > 0) {
        this.sendSeq(seq);
    }
};

/**
 * start refresh interval
 */
Gui.Osd.Controller.Default.prototype.startRefreshInterval = function () {

    this.refreshInterval = setInterval(
        this.dataModel.loadOsd.bind(this.dataModel),
        VDRest.config.getItem('osdLoadInterval')
    );
};

/**
 * stop refresh interval
 */
Gui.Osd.Controller.Default.prototype.stopRefreshInterval = function () {

    clearInterval(this.refreshInterval);
};

/**
 * load osd
 */
Gui.Osd.Controller.Default.prototype.loadOsd = function () {

    this.stopRefreshInterval();

    this.dataModel.loadOsd();

    this.startRefreshInterval();
};

/**
 * show message
 * @param {Boolean} state
 */
Gui.Osd.Controller.Default.prototype.showMessage = function (state) {

    this.view.messageBox.toggleClass('show', state);
};

/**
 * refresh osd
 * @param {jQuery.Event} e
 */
Gui.Osd.Controller.Default.prototype.refreshView = function (e) {

    this.data = this.view.data = e.payload.data;

    this.removeObserver();

    if (this.data.Error) {
        this.errors++ > 10 && history.back();
    } else {
        this.errors = 0;
    }

    this.view.rePaint();
    if (this.scrollAfterLoad) {
        this.scrollAfterLoad = undefined;
        this.view.scrollIntoView();
    }

    if (this.data.TextOsd && this.data.TextOsd.message && this.data.TextOsd.message !== '') {
        this.view.setMessage(this.data.TextOsd.message);
        if (!this.view.messageBox.hasClass('show')) {
            this.showMessage(true);
        }
    } else {
        this.view.setMessage('');
        if (this.view.messageBox.hasClass('show')) {
            this.showMessage(false);
        }
    }

    this.addObserver();
};

/**
 * handle remote press
 */
Gui.Osd.Controller.Default.prototype.handleRemotePress = function () {

    this.scrollAfterLoad = true;
    this.dataModel.loadOsd.call(this.dataModel);
};

/**
 * send key
 */
Gui.Osd.Controller.Default.prototype.sendKey = function (key) {

    this.vibrate();
    //this.view.toggleThrobber();
    this.scrollAfterLoad = true;
    this.module.backend.send(key);
};

/**
 * send key
 * @param {Array} seq
 */
Gui.Osd.Controller.Default.prototype.sendSeq = function (seq) {

    if (!seq instanceof Array) return;

    this.vibrate();
    //this.view.toggleThrobber();
    this.scrollAfterLoad = true;
    this.module.backend.sendSeq(seq);
};

/**
 * destroy
 */
Gui.Osd.Controller.Default.prototype.destructView = function () {

    this.stopRefreshInterval();

    VDRest.app.getModule('Gui.Remote').destruct();

    VDRest.Abstract.Controller.prototype.destructView.call(this);
};
