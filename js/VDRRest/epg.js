VDRest.Epgold = function () {
    this.isDispatched = false;
    this.events = [];
    this.channels = null;
    this.endTimes = {};
    this.scrollTimer = null;
};

VDRest.Epgold.prototype = new VDRest.Api();

VDRest.Epgold.prototype.optionName = "EPG Old";

VDRest.Epgold.prototype.name = "epgold";

VDRest.Epgold.prototype.init = function () {
//    this.channelsList = $('#channels');
//    this.eventsList = $('#events');
//    this.timeline = $('#timeline');
//    this.body = $('body');
//    this.window = $(window);
//    this.verticalScroller = $('dl.epg dd');
//
//    this.scrollFinishCallback = $.proxy(function () {
//        this.scrollFinish();
//    }, this);
};

VDRest.Epgold.prototype.dispatch = function () {





    var epg = vdrest.getModule('Epg');

    epg.initChannels();

    $(document).one('channelsloaded', $.proxy(function (result) {

        result.iterate(function (channel) {

            $(document).one('eventsloaded-' + channel.getData('channel_id'), $.proxy(function (result) {
                console.log(result);
            }, this));

            channel.getBroadcasts(channel);

        });

        console.log(epg);
    }, this));


//    $('#timeSelector .' + config.getItem('lastEpg')).hide();
//    this.now = new Date();
//    this.prime = new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate(), 20, 15, 0);
//    if (this.now > this.prime) {
//        this.prime.setTime(this.prime.getTime() + 1000 * 24 * 60 * 60);
//    }
//    this.addDomEvents();
//    $('.epg-wrapper').show();
//    if (!this.isDispatched) {
//        this.loadChannels();
//        this.isDispatched = true;
//    } else {
//        this.scrollFinish();
//    }
};

/**
 * handle horizontal scroll events
 * load events in case of empty space in grid
 */
VDRest.Epgold.prototype.scrollFinish = function () {
    var me = this, l = me.channels.length, i = 0;
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(function () {
        for (i = 0; i < l; i++) {
            var channelId = me.channels[i].channel_id, row = $('#' + channelId), last = row.find('li:last');
            if (last.length > 0 && (me.isScrolledIntoView(last) || (me.isScrolledIntoViewY(row) && last.offset().left <= me.eventsList.offset().left))) {
                me.loadEvents(me.channels[i], me.endTimes[channelId]);
            }
        }
        if (me.isScrolledIntoView(me.timeline.find('div:last'), me.window)) {
            me.renderTimeLine();
        }
    }, 200);
};

VDRest.Epgold.prototype.addDomEvents = function () {

    var me = this, i = 0, l = 0;
    $('#refresh').show().on('click', function () {
        me.loadFrom(config.getItem('lastEpg'));
    });
    $('#timeSelector li').each(function () {
        $(this).on('click', function () {
            me.loadFrom(this.className);
        })
    });
    this.window.on('orientationchange', this.scrollFinishCallback);
    this.body.on('scroll', this.scrollFinishCallback);
    this.verticalScroller.on('scroll', $.proxy(this.moveTimeline, this));
};

VDRest.Epgold.prototype.removeDomEvents = function () {

    $('#refresh').show().off('click');
    $('#timeSelector li').off('click');
    this.window.off('orientationchange', this.scrollFinishCallback);
    this.body.off('scroll', this.scrollFinishCallback);
    this.verticalScroller.off('scroll');
};

/**
 * scroll timeline callback
 * attach to vertical scroll event
 */
VDRest.Epgold.prototype.moveTimeline = function () {

    var that = this.verticalScroller.get(0);
    var scroll = that.scrollLeft * -1, ddOffset = that.offsetLeft, date = '';
    this.timeline.css({"left":scroll + 'px'});

    this.timeline.find('*[data-date]').each(function (k, v) {
        var d = $(v);
        if (d.offset().left <= ddOffset) {
            date = d.attr('data-date');
        } else {
            return false;
        }
    });
    $('#menubar .epg-wrapper .date').text(date);

    this.scrollFinish();
};

VDRest.Epgold.prototype.addChannelEvents = function () {
    var me = this;
    for (var i in this.channels) {
        $('#channel-' + this.channels[i].channel_id).on('click', function () {
            vdrest.modules.channel.next = me.channels[$(this).attr('data-channelsid')];
            vdrest.dispatch('channel');
        });
    };
};

VDRest.Epgold.prototype.addEventsToList = function (events) {
    var me = this, i = 0, l = events.length,
        gui = vdrest.getModule('gui'),
        broadcasts = vdrest.getModule('Epg');

    for (i; i < l; i++) {
        this.events[events[i]].dom.on('click', function () {
            var broadcast = me.events[this.id];

            broadcasts.getModel('Broadcast', broadcast.id);

            broadcasts.dispatchView('Window', broadcast);
        });
    }
};

VDRest.Epgold.prototype.loadChannels = function () {
//    $.ajax({
//        "url":"http://" + this.host + ":" + this.port + "/channels/.json",
//        "success":$.proxy(function (result) {
//            this.channels = result.channels;
//            this.channelCount = result.total;
//            this.renderSkeleton();
//            this.addChannelEvents();
//            this.loadFrom(config.getItem('lastEpg'));
//        }, this)
//    });

};

VDRest.Epgold.prototype.loadEvents = function (channel, from) {
    var channelId = channel.channel_id;
    from = from || this.from;


//    if (channelId === "C-61441-10003-53401") {
//        var stored = '';
//        if (typeof this.endTimes[channelId] != 'undefined') {
//            stored = this.endTimes[channelId].getTime()/1000;
//        }
//        helper.log('Starttime:', from.getTime()/1000, stored);
//    }
    if (typeof channel.loadedTimestamps[from.getTime()/1000] != 'undefined') {
//        helper.log('Loading '+from.getTime()/1000+' canceled', channel.loadedTimestamps[from.getTime()/1000]);
        return;
    }

    vdrest.getModule('gui').showThrobber();
    channel.loadedTimestamps[from.getTime()/1000] = 'Loading';

    $.ajax({
        "async":this.async,
        "url":"http://" + this.host + ":" + this.port + "/events/" + channelId + ".json?from=" + parseInt(from.getTime() / 1000) + "&start=0&timespan=" + 60 * 60,
        "success":$.proxy(function (result) {
            var events = result.events, i = 0, l = events.length, evWidth, ev = [],
                channelList = $('#' + channelId), width = channelList.width(), last, startTime, duration,
                dom, newEvents = [], classNames;
            if (result.count === 0) {
                return;
            }
            channel.loadedTimestamps[from.getTime()/1000] = 'Rendering';
            this.endTimes[channelId] = new Date((events[events.length - 1].start_time + events[events.length - 1].duration) * 1000);

//            if (channelId === "C-61441-10003-53401") helper.log('New Endtime: ', this.endTimes[channelId].getTime()/1000);

            for (i; i < l; i++) {
                if (i === 0 && channelList.find('li').length == 0) {
                    endTime = new Date((events[i].start_time + events[i].duration) * 1000);
                    duration = Math.round((endTime.getTime() / 1000 - from.getTime() / 1000));
                } else {
                    duration = events[i].duration;
                }
                evWidth = Math.round(duration / 30);
                classNames = events[i].timer_exists ? (events[i].timer_active ? ' active-timer' : ' timer') : '';
                dom = $('<li data-eventid="' + events[i].id + '" class="event' + classNames + '" id="' + this.events.length + '" style="width: ' + evWidth + 'px"><div>' + events[i].title + '</div></li>');
                ev.push(dom);
                width += evWidth;
                events[i].dom = dom;
                newEvents.push(this.events.length);
                this.events.push(events[i]);
            }
            channelList.width(width).append(ev);
            this.addEventsToList(newEvents);
            channelList.parent('li').width(width + this.window.width());
            last = channelList.find('li:last');
            if (this.isScrolledIntoView(last) || last.offset().left < this.eventsList.offset().left) {
//                if (channelId === "C-61441-10003-53401") console.log('Loading from Fillup:', this.endTimes[channelId]);
                this.loadEvents(channel, this.endTimes[channelId]);
            }
        }, this),
        "complete":function () {
            channel.loading = false;
            vdrest.getModule('gui').hideThrobber();
            channel.loadedTimestamps[from.getTime()/1000] = 'Complete';
        }
    });
};

VDRest.Epgold.prototype.renderSkeleton = function () {
    var channelId, markup;
    for (var i in this.channels) {
        channelId = this.channels[i].channel_id;
        markup = '<li class="channel clearfix" data-channelsid="' + i + '" id="channel-' + channelId + '">';
        if (this.channels[i].image) {
            markup += '<img src="http://' + this.host + ':' + this.port + '/channels/image/' + channelId + '" alt="' + this.channels[i].name + '">'
        } else {
            markup += '<div>' + this.channels[i].name + '</div>'
        }
        markup += '</li>';
        this.channelsList.append(markup);
        this.eventsList.append('<li class="events clearfix"><ul class="events clearfix" id="' + channelId + '"></ul></li>')
    }
    ;
    var width = this.eventsList.width();
    this.eventsList.width(10000);
    this.verticalScroller.scrollLeft(0);
    this.eventsList.width(width);
};

VDRest.Epgold.prototype.renderEvents = function () {
    for (var i in this.channels) {
        var channelId = this.channels[i].channel_id, elem = $('#' + channelId + ' li:last');
        if (typeof this.channels[i].loadedTimestamps === 'undefined') {
            this.channels[i].loadedTimestamps = {};
        }

        if (elem.length == 0 || me.isScrolledIntoView(elem)) {
            this.loadEvents(this.channels[i]);
        }
    }
};

VDRest.Epgold.prototype.loadFrom = function (from) {
    $('#timeSelector li').hide();
    if ('prime' === from) {
        from = this.prime;
        $('li .epg-wrapper .now').show();
        config.setItem('lastEpg', 'prime');
    } else {
        this.now = new Date();
        from = this.now;
        $('li .epg-wrapper .prime').show();
        config.setItem('lastEpg', 'now');
    }
    for (var i=0;i<this.channels.length;i++) {
        this.channels[i].loadedTimestamps = {};
    }
    $('ul.events').empty();
    $('#timeline').empty();
    this.from = from;
    this.quarterEnd = undefined;
    this.body.scrollTop(0);
    this.verticalScroller.scrollLeft(0);
    this.renderEvents();
    this.renderTimeLine();
};

VDRest.Epgold.prototype.isScrolledIntoView = function (elem, parent) {
    parent = parent || this.body;
    var top = false, right = false, bottom = false, left = false, eOffset = elem.offset(), pOffset = parent.offset(),
        eventsTop = typeof pOffset != 'undefined' ? pOffset.top : 0,
        eventsRight = this.window.width(),
        eventsBottom = this.window.height(),
        eventsLeft = this.eventsList.offset().left,

        elemTop = eOffset.top,
        elemRight = elemLeft + elem.width(),
        elemBottom = elemTop + elem.height(),
        elemLeft = eOffset.left;

    top = (elemTop <= eventsBottom && elemTop >= eventsTop);
    right = (elemRight <= eventsRight && elemRight >= eventsLeft);
    bottom = (elemBottom <= eventsBottom && elemBottom >= eventsTop);
    left = (elemLeft <= eventsRight && elemLeft >= eventsLeft);

    return (top || bottom) && (right || left);
};

VDRest.Epgold.prototype.isScrolledIntoViewY = function (elem) {
    var docViewTop = this.body.offset().top;
    var docViewBottom = docViewTop + this.body.height();

    var elemTop = elem.offset().top;
    var elemBottom = elemTop + elem.height();

    return ((elemTop <= docViewBottom) && (elemTop >= docViewTop)) || ((elemBottom <= docViewBottom) && (elemBottom >= docViewTop));
};

VDRest.Epgold.prototype.renderTimeLine = function () {
    var width = $('#timeline').width(),
        quarter,
        minute, hour, nextHour,
        quarterEnd, duration, quarterWidth, q, qr, ql, h, markup = '', className = 'even',
        endTime = this.from.getTime() + 1000 * 60 * 60 * 24,
        newDate = null, firstDate = null;

    if (typeof this.quarterEnd !== 'undefined') {
        quarterEnd = this.quarterEnd;
        endTime = this.quarterEnd.getTime() + 1000 * 60 * 60 * 24;
    } else {
        minute = this.from.getMinutes();
        hour = this.from.getHours();
        quarter = (((minute + 15) / 15 | 0) * 15) % 60;
        nextHour = (((minute / 60 + .25) | 0) + hour) % 24;

        quarterEnd = new Date(this.from.getFullYear(), this.from.getMonth(), this.from.getDate(), nextHour, quarter, 0);
        duration = Math.round((quarterEnd.getTime() - this.from.getTime()) / 1000);
        quarterWidth = Math.round(duration / 30);
        firstDate = helper.getWeekDay(quarterEnd, true) + ', ' + helper.getDateString(quarterEnd);
        $('#menubar .epg-wrapper .date').text(firstDate);
    }

    do {
        q = quarterEnd.getMinutes();
        if (q > 0) {
            ql = q.toString()[0];
            qr = q.toString()[1];
            className = className.replace(' hour', '')
            newDate = null;
        } else {
            ql = quarterEnd.getHours().toString();
            qr = '00';
            className = className + " hour";
            if (quarterEnd.getHours() === 0) {
                newDate = helper.getWeekDay(quarterEnd, true) + ', ' + helper.getDateString(quarterEnd);
            }
        }
        if (quarterWidth) {
            markup += '<div data-date="' + firstDate + '" class="ql ' + className + '" style="width: ' + quarterWidth + 'px">' + ql + '</div>';
            width += quarterWidth;
            quarterWidth = undefined;
        } else {
            markup += '<div' + (newDate ? ' data-date="' + newDate + '"' : '') + ' class="ql ' + className + '">' + ql + '</div>';
            width += 60;
        }
        if (q === 0) {
            if (className.indexOf('even') > -1) {
                className = className.replace('even', 'odd');
            } else {
                className = className.replace('odd', 'even');
            }
        }
        markup += '<div class="qr ' + className + '">' + qr + '</div>';
        quarterEnd = new Date(quarterEnd.getTime() + 1000 * 15 * 60);
    } while (quarterEnd.getTime() < endTime)
    this.quarterEnd = quarterEnd;
    $('#timeline').width(width).append(markup);
};

VDRest.Epgold.prototype.destruct = function () {
    $('#refresh').off('click').hide();
    this.removeDomEvents();
};

vdrest.registerModule('Epgold');
