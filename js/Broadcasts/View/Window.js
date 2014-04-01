Broadcasts.View.Window = function () {};

Broadcasts.View.Window.prototype = new Gui.Window.View();

Broadcasts.View.Window.constructor = Broadcasts.View.Window;

Broadcasts.View.Window.prototype.wrapperClassName = 'show-event';

Broadcasts.View.Window.prototype.locationHash = 'show-event';

/**
 * retrieve offsets of caller
 * @return {Object}
 */
Broadcasts.View.Window.prototype.getDefaultDimension = function () {

    var dom = this.window.getData('dom'),
        offset = dom.offset(), window = $(top);

    return {
        "top":offset.top+"px",
        "left":offset.left+"px",
        "right":window.width()-(offset.left+dom.width())+"px",
        "bottom":window.height()-(offset.top+dom.height())+"px"
    };
};

/**
 * render contents to window
 */
Broadcasts.View.Window.prototype.render = function () {

    this.addContents();
    this.decorate();
};

Broadcasts.View.Window.prototype.addContents = function () {

    this.addTitle().addImage().addDetails().addComponents().addTabs();
};

/**
 * add title
 * @return {*}
 */
Broadcasts.View.Window.prototype.addTitle = function () {

    this.getHeader().append('<h2>'+this.getTitle()+'</h2>');
    return this;
};

/**
 * add image if exists
 * @return {*}
 */
Broadcasts.View.Window.prototype.addImage = function () {

    var image, data = this.getData();
    if (data.images > 0) {

        image = $('<img>')
            .addClass('event-img right')
            .attr('src', 'http://'+this.host+':'+this.port+'/events/image/'+data.id+'/0')
            .appendTo(this.getHeader());


        image.on('click', $.proxy(function () {
            var maxWidth = image.width() > this.dom().width()/2 ? '50%' : '100%';
            image.animate({"max-width":maxWidth});
        }, this));
    }
    return this;
};

/**
 * add details
 * @return {*}
 */
Broadcasts.View.Window.prototype.addDetails = function () {

    var data = this.getData(),
        details = $('<ul class="details"><li class="italic">'+data.short_text+'</li></ul>'),
        start = helper.getTimeString(new Date(data.start_time*1000)),
        stop = helper.getTimeString(new Date(data.start_time*1000 + data.duration*1000));

    if (data.contents.length > 0) {

        details.append('<li>'+data.contents.join(' | ')+'</li>');
    }
    details.append('<li>'+data.channel_name+'</li><li>'+start+' - '+stop+'</li>')
        .appendTo(this.getHeader());

    return this;
};

/**
 * add components
 * @return {*}
 */
Broadcasts.View.Window.prototype.addComponents = function () {

    var data = this.getData(), i = 0, l = data.components.length, components;

    if (l > 0) {

        components = [];

        for (i;i<l;i++) {

            if (typeof this.componentsMap[data.components[i].description] != 'undefined') {

                components.push(this.componentsMap[data.components[i].description]);
            }
        }
        this.getHeader()
            .append('<ul class="components clearer"><li>'+components.unique().join('</li><li>')+'</li></ul>');
    }
    return this;
};


/**
 * add Tabs
 */
Broadcasts.View.Window.prototype.addTabs = function () {

    if (typeof this.tabs != 'undefined') {

        this.tabs.remove();

    }
    this.tabs = new Tabs(this);
    this.getBody()
        .append(this.tabs.tabs)
        .append(this.tabs.tabContents);
};

/**
 * add decorations according to data
 */
Broadcasts.View.Window.prototype.decorate = function () {

    if (this.getData('timer_exists') && this.getData('timer_active')) {

        this.getHeader().addClass('active-timer');

    } else {

        this.getHeader().removeClass('active-timer');
    }
};
