/**
 * initialize dom
 * @param parent
 * @constructor
 */
Tabs = function (parent) {

    this.parent = parent;
    this.tabConfig = parent.tabConfig;

    this.tabs = $('<ul>')
        .addClass('tabs clearfix');
    this.tabContents = $('<ul>')
        .addClass('tab-contents');

    this.addTabs();
    this.addDomEvents();
};

/**
 * add Tabs to List
 */
Tabs.prototype.addTabs = function () {

    var i, tab, content, n=0;

    for (i in this.tabConfig) {

        if (this.tabConfig.hasOwnProperty(i)) {

            tab = $('<li>')
                .attr('data-index', n)
                .text(this.tabConfig[i].label);

            content = $('<li>').addClass('tab-content '+i);

            if (typeof this.tabConfig[i].default != 'undefined') {

                tab.addClass('current');
                content.addClass('current');
            }

            if (typeof this.tabConfig[i].content == 'function') {

                this.tabConfig[i].content.apply(this.parent, content);

            } else {

                content.append(this.tabConfig[i].content);

            }

            this.tabs.append(tab);
            this.tabContents.append(content);
            n++;
        }
    }
};

/**
 * add events
 */
Tabs.prototype.addDomEvents = function () {

    this.tabs.find('li').each($.proxy(function (k, v) {

        var that = $(v);

        that.on('click', $.proxy(function () {

            if (that.hasClass('current')) {

                return;
            }

            this.tabs.find('li').removeClass('current');
            this.tabContents.find('li.tab-content').removeClass('current');
            that.addClass('current');
            this.tabContents.find('li.tab-content:nth('+k+')').addClass('current');

        }, this));

    }, this));
};

/**
 * retrieve current active tab name
 * @return {String}
 */
Tabs.prototype.getCurrent = function () {

    return this.tabs.find('.current').attr('data-index');
};

/**
 * set current active tab
 * @param n
 */
Tabs.prototype.setCurrent = function (n) {

    this.tabs.find('li').removeClass('current');
    this.tabContents.find('li.tab-content').removeClass('current');
    this.tabs.find('li:nth('+n+')').addClass('current');
    this.tabContents.find('li.tab-content:nth('+n+')').addClass('current');
};

/**
 * remove tabs
 */
Tabs.prototype.remove = function () {

    this.tabs.remove();
    this.tabContents.remove();
};
