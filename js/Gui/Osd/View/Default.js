/**
 * @class
 * @constructor
 */
Gui.Osd.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Osd.View.Default.prototype = new VDRest.Abstract.View();

/**
 * init nodes
 */
Gui.Osd.View.Default.prototype.init = function () {

    this.node = $('<div id="osd">').addClass('window collapsed viewport-fullsize');
    this.osdWrapper = $('<div id="osd-items-wrapper">').appendTo(this.node);
    this.osd = $('<table id="osd-items">');
    this.colorButtons = $('<div id="osd-buttons">');
    this.header = VDRest.app.getModule('Gui.Menubar').getView('Default').getHeader();
    this.messageBox = $('<div class="osd-message" data-animate="opacity">').appendTo(this.node);
    this.items = [];
    this.selectedItem = null;
    this.prevSelectedItem = null;
    this.addThrobber();
};

/**
 * initial render
 */
Gui.Osd.View.Default.prototype.render = function () {

    var poster;

    $('body').addClass('osd-view');

    this.osd.appendTo(this.osdWrapper);
    VDRest.Abstract.View.prototype.render.call(this);

    poster = VDRest.app.getModule('Gui.Video').getHelper('Player').defaultPoster(this.node.get(0));

    this.node.css({
        "background-image": 'url(' + poster + ')'
    });

    this.node.toggleClass('collapsed expand');
};

/**
 * add overlay to screen to prevent clicks
 */
Gui.Osd.View.Default.prototype.muteScreen = function () {
    if (!this.modal) {
        this.modal = $('<div class="modal-overlay transparent">').appendTo('body');
    }
};

/**
 * remove overlay
 */
Gui.Osd.View.Default.prototype.unmuteScreen = function () {
    if (this.modal) {
        this.modal.remove();
        this.modal = undefined;
    }
};

/**
 * add color buttons
 */
Gui.Osd.View.Default.prototype.addButtons = function () {

    this.red = this.green = this.yellow = this.blue = undefined;

    if (this.data && this.data.TextOsd) {

        this.red = $('<div class="color-button red">');
        this.green = $('<div class="color-button green">');
        this.yellow = $('<div class="color-button yellow">');
        this.blue = $('<div class="color-button blue">');

        this.red.text(this.data.TextOsd.red).appendTo(this.colorButtons);
        this.green.text(this.data.TextOsd.green).appendTo(this.colorButtons);
        this.yellow.text(this.data.TextOsd.yellow).appendTo(this.colorButtons);
        this.blue.text(this.data.TextOsd.blue).appendTo(this.colorButtons);

        this.data.TextOsd.red.length    > 9 ? this.red.addClass('long-text')    : this.red.removeClass('long-text');
        this.data.TextOsd.green.length  > 9 ? this.green.addClass('long-text')  : this.green.removeClass('long-text');
        this.data.TextOsd.yellow.length > 9 ? this.yellow.addClass('long-text') : this.yellow.removeClass('long-text');
        this.data.TextOsd.blue.length   > 9 ? this.blue.addClass('long-text')   : this.blue.removeClass('long-text');

        this.colorButtons.appendTo(this.node);

    }

    return this;
};

/**
 * add throbber
 */
Gui.Osd.View.Default.prototype.addThrobber = function () {

    this.throbber = $(
        '<div style="background-image: url('
        + VDRest.image.getThrobber()
        + ')" class="throbber">'
    );
    this.throbber.appendTo(this.node);

    return this;
};

/**
 * toggle throbber
 */
Gui.Osd.View.Default.prototype.toggleThrobber = function () {

    this.throbber.toggleClass('show');
};

/**
 * render text osd
 */
Gui.Osd.View.Default.prototype.renderText = function () {

    var i= 0, items = this.data.TextOsd.items, l = items.length;

    for (i; i<l; i++) {

        this.addItem(items[i]);
    }
};

/**
 * add item
 */
Gui.Osd.View.Default.prototype.addItem = function (item) {

    var node, text = item.content.split('\t'), i = 0, l = text.length, td, lKey, lText, colspan = 2;

    if (text) {
        node = $('<tr class="osd-item clearer">');

        if (1 === l) {
            text[i] = text[i].match(/(\s*([0-9]+)\s+)?(.*)/);
            lKey = RegExp.$2;
            lText = RegExp.$3;
            if (lKey) {
                colspan--;
                node.append($('<td class="list-key">' + lKey + '</td>'))
            }
            node.append($('<td class="list-text" colspan="' + colspan + '">' + lText + '</td>'))
        } else {
            for (i;i<l;i++) {
                td = $('<td>').html(text[i]);
                td.appendTo(node);
            }
        }
        if (item.is_selected) {
            node.addClass('selected');
            this.prevSelectedItem = this.selectedItem;
            this.selectedItem = node;
        }
        this.items.push(node);
        node.appendTo(this.osd);
    }
};

/**
 * render programme osd
 */
Gui.Osd.View.Default.prototype.renderProgramme = function () {

    var osd = this.data.ProgrammeOsd,
        presentTime = new Date(osd.present_time * 1000),
        followingTime = new Date(osd.following_time * 1000),
        helper = this.helper();

    this.addItem({
        "content": VDRest.app.translate('Now') + ':'
    });
    this.addItem({
        "content": helper.getTimeString(presentTime, false) + " - " + osd.present_title
    });

    if (osd.present_subtitle) {
        this.addItem({
            "content" : osd.present_subtitle
        });
    }

    this.addItem({"content":" "});

    this.addItem({
        "content": VDRest.app.translate('Next') + ':'
    });

    this.addItem({
        "content": helper.getTimeString(followingTime, false) + " - " + osd.following_title
    });

    if (osd.following_subtitle) {
        this.addItem({
            "content" : osd.following_subtitle
        });
    }
};

/**
 * set message text
 * @param {String} text
 */
Gui.Osd.View.Default.prototype.setMessage = function (text) {

    this.messageBox.text(text);
};

/**
 * repaint osd
 */
Gui.Osd.View.Default.prototype.rePaint = function () {

    var title = undefined, message = undefined;

    this.colorButtons.empty();
    this.osd.empty();
    this.selectedItem = null;
    this.items.length = 0;
    this.addButtons();

    if (this.data) {
        if (this.data.Error) {
            this.addItem(this.data.Error);
        } else if (this.data.ChannelOsd) {
            this.addItem({ "content" : this.data.ChannelOsd });
        } else if (this.data.TextOsd) {
            title = this.data.TextOsd.title;
            message = this.data.TextOsd.message;
            this.renderText();
        } else if (this.data.ProgrammeOsd) {
            this.renderProgramme()
        }

        if (title) {
            this.header.text(title);
        }
        if (message && message !== this.messageBox.text()) {
            this.messageBox.text(message);
        }
    }
};

Gui.Osd.View.Default.prototype.scrollIntoView = function () {

    var sTop, wHeight, wTop;

    if (this.selectedItem) {

        sTop = this.selectedItem.offset().top;
        wTop = this.osdWrapper.offset().top;
        wHeight = this.osdWrapper.height();

        if (( sTop > wHeight + wTop ) || ( sTop < wTop )) {
            this.selectedItem.get(0).scrollIntoView();
        }
    }
};