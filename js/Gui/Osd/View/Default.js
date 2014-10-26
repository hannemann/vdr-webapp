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

    this.node = $('<div id="osd">');
    this.osdWrapper = $('<div id="osd-items-wrapper">').appendTo(this.node);
    this.osd = $('<table id="osd-items">');
    this.colorButtons = $('<div id="osd-buttons">');
};

/**
 * initiall render
 */
Gui.Osd.View.Default.prototype.render = function () {

    var poster;

    this.osd.appendTo(this.osdWrapper);
    VDRest.Abstract.View.prototype.render.call(this);

    poster = VDRest.app.getModule('Gui.Window').getHelper('VideoPlayer').defaultPoster(this.node.get(0));

    this.node.css({
        "background-image": 'url(' + poster + ')'
    });
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
 * render text osd
 */
Gui.Osd.View.Default.prototype.renderText = function () {

    var i= 0, items = this.data.TextOsd.items, l = items.length;

    for (i; i<l; i++) {

        this.addItem(items[i]);
    }
};

/**
 * add items
 */
Gui.Osd.View.Default.prototype.addItem = function (item) {

    var node, text = item.content.split('\t'), i= 0, l=text.length, td;

    if (text) {
        node = $('<tr class="osd-item clearer">');

        //node.html(text);

        for (i;i<l;i++) {
            text[i] = text[i].replace(/^\s*([0-9]{1,3})\s+/, '<span class="list-key">$1</span>&nbsp;');
            td = $('<td>').html(text[i]);
            td.appendTo(node);
        }

        if (item.is_selected) {
            node.addClass('selected');
            this.selectedItem = node;
        }

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
 * repaint osd
 */
Gui.Osd.View.Default.prototype.rePaint = function () {

    this.colorButtons.empty();
    this.osd.empty();
    this.selectedItem = null;
    this.addButtons();

    if (this.data) {
        if (this.data.Error) {
            this.addItem(this.data.Error);
        } else if (this.data.ChannelOsd) {
            this.addItem({ "content" : this.data.ChannelOsd });
        } else if (this.data.TextOsd) {
            this.renderText();
        } else if (this.data.ProgrammeOsd) {
            this.renderProgramme()
        }
    }

    if (this.selectedItem) {
        this.selectedItem.get(0).scrollIntoView();
    }
};
