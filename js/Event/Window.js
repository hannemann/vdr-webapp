Event.Window = function () {};

Event.Window.prototype = new Gui.Window();

Event.Window.prototype.windowWrapper = 'Event';

Event.Window.prototype.host = config.getItem('host');

Event.Window.prototype.port = config.getItem('port');

Event.Window.prototype.componentsMap = {
    "16:9":'<img src="assets/16_9.png" alt="">',
    "stereo":'<img src="assets/2_0.png" alt="">'
};

/**
 * render contents to window
 */
Event.Window.prototype.appendChildren = function () {

    this.addContents();
    this.decorate();
};

Event.Window.prototype.addContents = function () {

    this.addTitle().addImage().addDetails().addComponents().addTabs();
};

/**
 * add title
 * @return {*}
 */
Event.Window.prototype.addTitle = function () {

    this.getHeader().append('<h2>'+this.getTitle()+'</h2>');
    return this;
};

/**
 * add image if exists
 * @return {*}
 */
Event.Window.prototype.addImage = function () {

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
Event.Window.prototype.addDetails = function () {

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
Event.Window.prototype.addComponents = function () {

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
Event.Window.prototype.addTabs = function () {

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
Event.Window.prototype.decorate = function () {

    if (this.getData('timer_exists') && this.getData('timer_active')) {

        this.getHeader().addClass('active-timer');

    } else {

        this.getHeader().removeClass('active-timer');
    }
};

/**
 * @type {Object}
 */
Event.Window.prototype.tabConfig = {
    "details":{
        "label":"Details",
        "content":function (content) {

            $(content).append(this.getDescription());
        },
        "default":true
    },
    "tools":{
        "label":"Tools",
        "content":function (content) {

            $(content).append(this.renderTools());
        }
    },
    "web":{
        "label":"Web",
        "content":function (content) {

            $(content).append(this.renderWeb());
        }
    }
};

/**
 * @type {Object}
 */
Event.Window.prototype.webConfig = {
    "imdb":{
        "dom":function () {

            var dom = $('<dl class="web-button imdb"></dl>'),
                button = $('<dt><img src="assets/imdb-logo.png" alt="">'),
                text = $('<dd>');

            text.text('IMDB Suche');

            return dom.append(button).append(text);
        },
        "callback":function () {

            window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.getTitle()));
        }
    }
};

/**
 * @type {Object}
 */
Event.Window.prototype.toolsConfig = {
    "record":{
        "dom":function () {

            var dom = $('<dl class="record-button"></dl>'),
                button = $('<dt>'),
                text = $('<dd>');

            if (this.getData('timer_exists')) {

                text.text('Timer löschen');
                button.removeClass('activate-timer');

            } else {

                text.text('Timer erstellen');
                button.addClass('activate-timer');
            }

            return dom.append(button).append(text);
        },
        "callback":function () {

            if (this.getData('timer_exists')) {

                actions.deleteTimer(this, this.refresh);

            } else {

                actions.addTimer(this, this.refresh);

            }
        }
    }
};

/**
 * retrieve description
 * @return {*}
 */
Event.Window.prototype.getDescription = function () {
    return this.getData('description');
};

/**
 * retrieve description
 * @return {*}
 */
Event.Window.prototype.getTitle = function () {
    return this.getData('title');
};

/**
 * @return {*}
 */
Event.Window.prototype.renderTools = function () {

    var i, dom, button;

    dom = $('<ul>');

    for (i in this.toolsConfig) {

        if (this.toolsConfig.hasOwnProperty(i)) {

            button = this.getToolButton(this.toolsConfig[i]);
            dom.append(button);
        }
    }

    return dom;
};

/**
 * @return {*}
 */
Event.Window.prototype.renderWeb = function () {

    var i, dom, button;

    dom = $('<ul>');

    for (i in this.webConfig) {

        if (this.webConfig.hasOwnProperty(i)) {

            button = this.getToolButton(this.webConfig[i]);
            dom.append(button);
        }
    }

    return dom;
};

/**
 * @param options
 * @return {*}
 */
Event.Window.prototype.getToolButton = function (options) {
    var dom, me=this;

    dom = $('<li>');
    if (typeof options.image != 'undefined') {

        dom.append('<img src="'+options.image.src+'">');

    } else if (typeof options.dom != 'undefined') {

        if (typeof options.dom == 'function') {

            dom.append(options.dom.apply(me));

        } else {

            dom.append(options.dom);

        }
    }

    dom.on('click', function () {

        if (typeof options.url != 'undefined') {

            if (options.target == 'new') {

                window.open(options.url);

            } else {

                location.href = options.url;
            }

        } else if (typeof options.callback == 'function') {

            options.callback.apply(me);
        }
    });

    return dom;
};

Event.Window.prototype.refresh = function () {

    var current = this.tabs.getCurrent();
    this.addTabs();
    this.tabs.setCurrent(current);
    this.decorate();
};
