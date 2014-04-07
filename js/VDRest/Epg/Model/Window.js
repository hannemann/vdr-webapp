VDRest.Epg.Model.Window = function () {};

VDRest.Epg.Model.Window.prototype = new VDRest.Gui.Window();

VDRest.Epg.Model.Window.prototype.windowWrapper = 'Epg';

VDRest.Epg.Model.Window.prototype.host = VDRest.config.getItem('host');

VDRest.Epg.Model.Window.prototype.port = VDRest.config.getItem('port');

VDRest.Epg.Model.Window.prototype.componentsMap = {
    "16:9":'<img src="assets/16_9.png" alt="">',
    "stereo":'<img src="assets/2_0.png" alt="">'
};

/**
 * @type {Object}
 */
VDRest.Epg.Model.Window.prototype.tabConfig = {
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
VDRest.Epg.Model.Window.prototype.webConfig = {
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
VDRest.Epg.Model.Window.prototype.toolsConfig = {
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
VDRest.Epg.Model.Window.prototype.getDescription = function () {
    return this.getData('description');
};

/**
 * retrieve description
 * @return {*}
 */
VDRest.Epg.Model.Window.prototype.getTitle = function () {
    return this.getData('title');
};

/**
 * @return {*}
 */
VDRest.Epg.Model.Window.prototype.renderTools = function () {

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
VDRest.Epg.Model.Window.prototype.renderWeb = function () {

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
VDRest.Epg.Model.Window.prototype.getToolButton = function (options) {
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

VDRest.Epg.Model.Window.prototype.refresh = function () {

    var current = this.tabs.getCurrent();
    this.addTabs();
    this.tabs.setCurrent(current);
    this.decorate();
};
