/**
 * @class
 * @constructor
 * @property {{}} data
 */
Gui.Tabs.View.Abstract = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Tabs.View.Abstract.prototype = new VDRest.Abstract.View();

/**
 * init dom
 */
Gui.Tabs.View.Abstract.prototype.init = function () {

    this.node = $('<div>');

    this.tabs = $('<ul>')
        .addClass('tabs clearer')
        .appendTo(this.node);

    this.tabContents = $('<ul>')
        .addClass('tab-contents')
        .appendTo(this.node);

    this.contents = [];
};

/**
 * render dom
 */
Gui.Tabs.View.Abstract.prototype.render = function () {

    this.addTabs();

    this.node.appendTo(this.data.parentView);
};

/**
 * add Tabs to List
 */
Gui.Tabs.View.Abstract.prototype.addTabs = function () {

    var i, tab, content, n = 0;

    for (i in this.data.tabs) {

        if (this.data.tabs.hasOwnProperty(i)) {

            tab = $('<li>')
                .attr('data-index', n)
                .text(this.data.tabs[i].label);

            content = $('<li>').addClass('tab-content '+i);

            if (typeof this.data.tabs[i].default != 'undefined') {

                tab.addClass('current');
                content.addClass('current');
            }

            if (typeof this.data.tabs[i].content == 'function') {

                this.data.tabs[i].content(content);

            } else {

                content.append(this.data.tabs[i].content);

            }

            this.tabs.append(tab);
            this.tabContents.append(content);
            this.contents.push(content);
            n++;
        }
    }
    this.setContentHeight();
};

/**
 * measure contents and apply largest height
 */
Gui.Tabs.View.Abstract.prototype.setContentHeight = function () {

    var contentHeight = 0, tabHeight;

    this.contents.forEach(function(content) {
        tabHeight = this.getTabHeight(content);
        contentHeight = tabHeight > contentHeight ? tabHeight : contentHeight;
    }.bind(this));
    this.tabContents.height(contentHeight);
};

/**
 * get height of content
 * @param {jQuery} content
 * @return {number}
 */
Gui.Tabs.View.Abstract.prototype.getTabHeight = function (content) {

    var clone = content.clone(), tabHeight;
    clone.css({
        "display": "block",
        "white-space": "pre-wrap",
        "position": "absolute",
        "width": document.body.offsetWidth - 40 + "px",
        "left": "-99999px"
    }).appendTo(document.body);
    tabHeight = clone[0].offsetHeight;
    clone.remove().css({
        "display": "",
        "white-space": "",
        "position": "",
        "width": "",
        "left": ""
    });

    return tabHeight;
};

/**
 * retrieve current active tab name
 * @return {String}
 */
Gui.Tabs.View.Abstract.prototype.getCurrent = function () {

    return this.tabs.find('.current').attr('data-index');
};

/**
 * set current active tab
 * @param n
 */
Gui.Tabs.View.Abstract.prototype.setCurrent = function (n) {

    this.tabs.find('li').removeClass('current');
    this.tabContents.find('li.tab-content').removeClass('current');
    this.tabs.find('li:nth('+n+')').addClass('current');
    this.tabContents.find('li.tab-content:nth('+n+')').addClass('current');
};

/**
 * empty tabs, remove node
 */
Gui.Tabs.View.Abstract.prototype.destruct = function () {

    this.tabs.empty();
    this.tabContents.empty();
    this.node.remove();
};