Event = function (event) {
	var start = helper.getTimeString(new Date(event.start_time*1000)),
	    stop = helper.getTimeString(new Date(event.start_time*1000 + event.duration*1000)),
        details, components = [];
	this.event = event;
	this.dom = $(this.template);
	this.header = this.dom.find('.header');
	this.body = this.dom.find('.body');
	this.header.append('<h2>'+event.title+'</h2>');
	if (event.images > 0) {
		this.header.append('<img class="event-img right" src="http://'+this.host+':'+this.port+'/events/image/'+event.id+'/0">');
	}
    details = $('<ul class="details"><li class="italic">'+event.short_text+'</li></ul>');
    if (event.contents.length > 0) {
        details.append('<li>'+event.contents.join(' | ')+'</li>');
    }
    this.header.append(details.append('<li>'+event.channel_name+'</li><li>'+start+' - '+stop+'</li>'));

    if (event.components.length > 0) {
        for (var i=0;i<event.components.length;i++) {
            if (typeof this.componentsMap[event.components[i].description] != 'undefined') {
                components.push(this.componentsMap[event.components[i].description]);
            }
        }
        this.header.append('<ul class="components clearer"><li>'+components.unique().join('</li><li>')+'</li></ul>');
    }

    this.addTabs();
    if (event.timer_exists && event.timer_active) {
        actions.loadTimer(this);
    }
	return this;
};

Event.prototype.componentsMap = {
    "16:9":'<img src="assets/16_9.png" alt="">',
    "stereo":'<img src="assets/2_0.png" alt="">'
};

Event.prototype.addTabs = function () {

    if (typeof this.tabs != 'undefined') {
        this.tabs.remove();
    }
    this.tabs = new Tabs(this);
    this.body.append(this.tabs.tabs).append(this.tabs.tabContents);
};

Event.prototype.decorate = function () {
    if (this.event.timer_exists && this.event.timer_active) {
        this.header.addClass('active-timer');
    } else {
        this.header.removeClass('active-timer');
    }
};

Event.prototype.host = config.getItem('host');
Event.prototype.port = config.getItem('port');

Event.prototype.tabConfig = {
    "details":{
        "label":"Details",
        "content":function (content) {
            $(content).append(this.event.description);
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

Event.prototype.webConfig = {
    "imdb":{
        "dom":function () {
            var dom = $('<dl class="web-button imdb"></dl>'),
                button = $('<dt><img src="assets/imdb-logo.png" alt="">'),
                text = $('<dd>');

            text.text('IMDB Suche');

            return dom.append(button).append(text);
        },
        "callback":function () {
            console.log(this.event);
            window.open("http://www.imdb.com/find?s=tt&q="+encodeURIComponent(this.event.title));
        }
    }
};

Event.prototype.toolsConfig = {
    "record":{
        "dom":function () {
            var dom = $('<dl class="record-button"></dl>'),
                button = $('<dt>'),
                text = $('<dd>');

            if (this.event.timer_exists) {
                text.text('Timer löschen');
                button.removeClass('activate-timer');
            } else {
                text.text('Timer erstellen');
                button.addClass('activate-timer');
            }

            return dom.append(button).append(text);
        },
        "callback":function () {
            if (this.event.timer_exists) {
                actions.deleteTimer(this, this.refresh);
            } else {
                actions.addTimer(this, this.refresh);
            }
        }
    }
};

Event.prototype.renderTools = function () {

    var i, dom, button;

    dom = $('<ul></ul>');

    for (i in this.toolsConfig) {
        if (this.toolsConfig.hasOwnProperty(i)) {
            button = this.getToolButton(this.toolsConfig[i]);
            dom.append(button);
        }
    }

    return dom;
};

Event.prototype.renderWeb = function () {

    var i, dom, button;

    dom = $('<ul></ul>');

    for (i in this.webConfig) {
        if (this.webConfig.hasOwnProperty(i)) {
            button = this.getToolButton(this.webConfig[i]);
            dom.append(button);
        }
    }

    return dom;
};

Event.prototype.getToolButton = function (options) {
    var dom, me=this;

    dom = $('<li></li>');
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

Event.prototype.addDomEvents = function () {
	var me = this;
	this.dom.find('.close').on('click', $.proxy(function () {
		this.dom.animate(this.getOptionsDom(), 'fast', function () {
			me.dom.remove();
            window.history.back();
		});
	}, this));
	this.dom.find('img').on('click', function () {
		var goal = $(this).width() > me.dom.width()/2 ? '50%' : '100%';
		$(this).animate({"max-width":goal});
	});
};

Event.prototype.render = function () {
    var me = this;
	this.dom.css(this.getOptionsDom());
	$('body').append(this.dom);
	this.addDomEvents();
    this.addTabs();
    this.decorate();
	this.dom.animate({"top":"20px","left":"20px","bottom":"20px","right":"20px"}, 'fast', 'linear', function () {
        main.destroy = function () {
            me.dom.animate(me.getOptionsDom(), 'fast', function () {
                me.dom.remove();
            });
        };
        window.location.hash = '#show-event-'+me.event.dom.attr('id');
    });
};

Event.prototype.refresh = function () {
    var current = this.tabs.getCurrent();
    this.addTabs();
    this.tabs.setCurrent(current);
    this.decorate();
};

Event.prototype.getOptionsDom = function () {
	var offset = this.event.dom.offset(), window = $(top);
	return {
		"top":offset.top+"px",
		"left":offset.left+"px",
		"right":window.width()-(offset.left+this.event.dom.width())+"px",
		"bottom":window.height()-(offset.top+this.event.dom.height())+"px"
	};
};

Event.prototype.template = '<div class="window show-event"><div class="close">&#10006;</div><div class="header clearfix"></div><div class="body"></div></div>';
