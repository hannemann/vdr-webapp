/**
 * @class
 * @constructor
 * @method {boolean} hasImages
 * @method {Array} getImages
 */
Gui.Window.View.Broadcast = function () {};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Window.View.Broadcast.prototype = new Gui.Window.View.Abstract();

/**
 * cache key
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.hasHeader = true;

/**
 * @type {string}
 */
Gui.Window.View.Broadcast.prototype.hasCloseButton = true;

/**
 * add components, call render method
 */
Gui.Window.View.Broadcast.prototype.render = function () {

    this.addTitle();

    if (this.hasImages()) {

        this.addMainImage()
    }

    this.addDetails();

    if (this.hasComponents()) {

        this.addComponents()
    }

    Gui.Window.View.Abstract.prototype.render.call(this);
};

/**
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addTitle = function () {

    this.title = $('<h2 class="window-title left">')
        .text(this.getTitle())
        .appendTo(this.header);

    return this;
};

/**
 * add epg image to header
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addMainImage = function () {

    this.image = $('<img class="broadcast-header-image right" src="' + this.getImages()[0] + '">')
        .appendTo(this.header);

    return this;
};

/**
 * animate epg image on click
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.animateImage = function () {

    var targetWidth, targetStatus, me = this;

    me.node.toggleClass('image-expanded');

    if (this.imageIsExpanded) {

        targetWidth = '50%';
        targetStatus = false;
    } else {

        targetWidth = '100%';
        targetStatus = true;
    }
    this.image.animate({
        "max-width" : targetWidth
    }, function () {
        me.imageIsExpanded = targetStatus;
    });

    return this;
};

/**
 * add details list to header
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addDetails = function () {

    this.details = $('<ul class="broadcast-header-details">')
        .appendTo(this.header);

    if (this.hasShortText()) {

        $('<li class="italic">')
            .text(this.getShortText())
            .appendTo(this.details);
    }


    if (this.hasContents()) {

        this.details.append('<li>'+this.getContents().join(' | ')+'</li>');
    }

    this.details.append(
            '<li>'+this.getChannelName()+'&nbsp;&shy;'
            +this.getStartTime()
            +'&nbsp;-&nbsp'
            +this.getEndTime()+'</li>'
        )
        .appendTo(this.header);

    return this;
};

/**
 * add components
 * @returns {Gui.Window.View.Broadcast}
 */
Gui.Window.View.Broadcast.prototype.addComponents = function () {

    this.header
        .append(
            '<ul class="broadcast-header-components clearer right"><li class="left">'
            +this.getComponents().join('</li><li class="left">')
            +'</li></ul>'
        );

    return this;
};
