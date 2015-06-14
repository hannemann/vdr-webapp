Gui.Video.View.Player.Controls.Osd = function () {};

Gui.Video.View.Player.Controls.Osd.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Video.View.Player.Controls.Osd.prototype.bypassCache = true;

Gui.Video.View.Player.Controls.Osd.prototype.init = function () {

    this.player = this.data.player;

    this.node = $('<div class="video-osd">');
};

Gui.Video.View.Player.Controls.Osd.prototype.render = function () {

    VDRest.Abstract.View.prototype.render.call(this);
    this.update();
};

Gui.Video.View.Player.Controls.Osd.prototype.update = function () {

    this.clearTimeouts()
        .addTitle()
        .scrollTitle();
};

/**
 * add title and subtitle to player
 */
Gui.Video.View.Player.Controls.Osd.prototype.addTitle = function () {

    var logo, end,
        sourceModel = this.player.data.sourceModel,
        broadcast;

    if (this.infoArea) {
        this.infoArea.remove();
    }

    this.infoArea = $('<div class="info-area info">');
    this.title = $('<div class="title info">').appendTo(this.infoArea);

    if (this.player.data.isVideo) {
        this.title.text(sourceModel.getData('event_title'));
        if ('' !== sourceModel.getData('event_short_text')) {
            this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
            this.subTitle.text(sourceModel.getData('event_short_text'));
        }
    } else {

        if ("undefined" != typeof this.changeTitleTimeout) {
            clearTimeout(this.changeTitleTimeout);
        }

        broadcast = this.player.data.current_broadcast;

        this.title.text(broadcast.getData('title'));
        if ('' !== broadcast.getData('short_text')) {
            this.subTitle = $('<div class="short-text info">').appendTo(this.infoArea);
            this.subTitle.text(broadcast.getData('short_text'));
        }

        end = (broadcast.getData('end_time') - parseInt(Date.now() / 1000, 10)) * 1000;

        this.changeTitleTimeout = setTimeout(function () {
            this.addTitle();
        }.bind(this), end);

        logo = sourceModel.getData('image');
        if (logo) {
            this.infoArea.addClass('has-logo');
            this.infoArea.css({
                "background-image": "url(" + logo + ")"
            });
        }
    }

    this.node.prepend(this.infoArea);

    $('title').text(this.title.text() + (this.subTitle ? ' - ' + this.subTitle.text() : ''));

    return this;
};

/**
 * update info area
 */
Gui.Video.View.Player.Controls.Osd.prototype.updateInfo = function () {

    var broadcast, start, end, helper = this.helper();

    if (this.player.data.isTv) {
        broadcast = this.player.getData('current_broadcast');
        this.title.text(broadcast.getData('title'));
        if ('' !== broadcast.getData('short_text')) {
            this.subTitle.text(broadcast.getData('short_text'));
        }

        start = helper.getTimeString(broadcast.getData('start_date'));
        end = helper.getTimeString(broadcast.getData('end_date'));
        this.start.text(start);
        this.end.text(end);
        $('title').text(this.title.text() + (this.subTitle ? ' - ' + this.subTitle.text() : ''));
    }
};

/**
 * scroll title
 */
Gui.Video.View.Player.Controls.Osd.prototype.scrollTitle = function () {

    if ("undefined" !== typeof this.infoAreaScrollInterval) {
        clearInterval(this.infoAreaScrollInterval);
        this.infoAreaScrollInterval = undefined;
    }
    if ("undefined" !== typeof this.infoAreaScrollTimeout) {
        clearTimeout(this.infoAreaScrollTimeout);
        this.infoAreaScrollTimeout = undefined;
    }

    //if (this.controls.hasClass('show')) {
    this.animateInfoArea();
    //}

};

/**
 * animate info area
 */
Gui.Video.View.Player.Controls.Osd.prototype.animateInfoArea = function () {

    var me = this,
        indent = 0,
        elem = this.infoArea,
        infoWidth = this.infoArea.width(),
        titleWidth,
        subTitleWidth = 0,
        delta;

    elem.css({
        "text-indent": indent
    });

    titleWidth = this.title.width();
    if (this.subTitle) {
        subTitleWidth = this.subTitle.width();
    }

    delta = Math.max(titleWidth, subTitleWidth) - infoWidth;

    if (delta < 1) return;

    // TODO: use css
    this.infoAreaScrollTimeout = setTimeout(function () {

        me.infoAreaScrollInterval = setInterval(function () {
            indent -= 1;

            if (Math.abs(indent) > delta) {
                clearInterval(me.infoAreaScrollInterval);
                me.infoAreaScrollInterval = undefined;
                me.infoAreaScrollTimeout = setTimeout(function () {
                    var skip = 0;
                    elem.find('.info').animate({
                        'opacity' : 0
                    }, {
                        "duration" : "fast",
                        "complete" : function () {
                            elem.css({
                                "text-indent" : 0
                            });
                            elem.find('.info').animate({
                                'opacity' : 1
                            }, {
                                "duration" : "fast",
                                "complete" : function () {
                                    if (skip < 3) {
                                        skip += 1;
                                        return;
                                    }
                                    me.animateInfoArea.call(me);
                                }
                            })
                        }
                    });
                }, 2000);
            } else if (!me.player.controls.view.node.hasClass('show')) {
                clearInterval(me.infoAreaScrollInterval);
                me.infoAreaScrollInterval = undefined;
                elem.css({
                    "text-indent": 0
                });
            } else {
                elem.css({
                    "text-indent": indent + 'px'
                });
            }
        }, 40);
    }, 2000);
};

Gui.Video.View.Player.Controls.Osd.prototype.clearTimeouts = function () {

    if ("undefined" != typeof this.changeTitleTimeout) {
        clearTimeout(this.changeTitleTimeout);
        this.changeTitleTimeout = undefined;
    }

    if ("undefined" !== typeof this.infoAreaScrollInterval) {
        clearInterval(this.infoAreaScrollInterval);
        this.infoAreaScrollInterval = undefined;
    }
    if ("undefined" !== typeof this.infoAreaScrollTimeout) {
        clearTimeout(this.infoAreaScrollTimeout);
        this.infoAreaScrollTimeout = undefined;
    }

    return this;
};

/**
 * destroy osd
 */
Gui.Video.View.Player.Controls.Osd.prototype.destruct = function () {

    this.clearTimeouts();
    this.title.remove();
    delete this.title;
    if (this.subTitle && this.subTitle[0].parentNode) {
        this.subTitle.remove();
        delete this.subTitle;
    }
    this.infoArea.remove();
    delete this.infoArea;
    Gui.Window.View.Abstract.prototype.destruct.call(this);
};
