Tabs = function (parent) {
    this.parent = parent;
    this.tabConfig = parent.tabConfig;
    this.tabs = $('<ul class="tabs clearfix"></ul>');
    this.tabContents = $('<ul class="tab-contents"></ul>');
    this.addTabs();
    this.addDomEvents();
};

Tabs.prototype.addTabs = function () {
    var i, tab, content, n=0;
    for (i in this.tabConfig) {
        tab = $('<li data-index="'+n+'">'+this.tabConfig[i].label+'</li>');
        content = $('<li class="tab-content '+i+'"></li>');

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
};

Tabs.prototype.addDomEvents = function () {
    var me = this;
    this.tabs.find('li').each(function (k, v) {
        $(this).on('click', function () {
            var that = $(this);
            if (that.hasClass('current')) {
                return;
            }
            me.tabs.find('li').removeClass('current');
            me.tabContents.find('li.tab-content').removeClass('current');
            that.addClass('current');
            me.tabContents.find('li.tab-content:nth('+k+')').addClass('current');
        });
    });
};

Tabs.prototype.getCurrent = function () {
    return this.tabs.find('.current').attr('data-index');
};

Tabs.prototype.setCurrent = function (n) {
    this.tabs.find('li').removeClass('current');
    this.tabContents.find('li.tab-content').removeClass('current');
    this.tabs.find('li:nth('+n+')').addClass('current');
    this.tabContents.find('li.tab-content:nth('+n+')').addClass('current');
};

Tabs.prototype.remove = function () {
    this.tabs.remove();
    this.tabContents.remove();
};