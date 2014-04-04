VDRest.Channel = function () {
    this.itemList = null;
    this.isDispatched = false;
    this.current = null;
    this.next = null;
};

VDRest.Channel.prototype = new VDRest.Rest.Api();

VDRest.Channel.prototype.name = 'channel';

VDRest.Channel.prototype.cache = {};

VDRest.Channel.prototype.urls = {
    "load":null
};

VDRest.Channel.prototype.init = function () {
	this.host = config.getItem('host');
	this.port = config.getItem('port');
    this.body = $('body');
    this.wrapper = $('.item-list-wrapper');
    this.itemList = $('.item-list-wrapper').find('ul');
};

VDRest.Channel.prototype.dispatch = function () {
    this.wrapper.addClass('channel-wrapper');
    this.current = this.next;
    this.events = {};
    this.decorateHeader();
    this.loadEvents();
    this.addDomEvents();
    $('.channel-wrapper').show(); // zeige alle channel-wrapper (menu)
};

VDRest.Channel.prototype.decorateHeader = function () {
    var now = new Date(), menubar = $('#menubar .channel-wrapper'), logo = menubar.find('.logo').empty();
    menubar.find('.number').text(this.current.number+'.');
    menubar.find('.channel').text(this.current.name);
    if (this.current.image) {
        logo.append('<img src="http://'+this.host+':'+this.port+'/channels/image/'+this.current.channel_id+'" alt="">');
    }
    menubar.find('.date').text(helper.getWeekDay(now)+', '+helper.getDateString(now));
};

VDRest.Channel.prototype.loadEvents = function () {

    if ("undefined" === typeof this.cache[this.current.channel_id]) {

        this.urls.load = "events/"+this.current.channel_id+".json?start=0";
        this.load();

    } else {

        this.renderEvents(this.cache[this.current.channel_id]);
    }

};

VDRest.Channel.prototype.onSuccess = function (result) {

    this.cache[this.current.channel_id] = result;
    this.renderEvents(result);
};

VDRest.Channel.prototype.renderEvents = function (result) {

    var i=0, l=result.events.length, now = new Date(), event, start, stop, startTime, endTime, classNames, duration, dom, me=this, dateIndicator;
    for (i;i<l;i++) {
        event = result.events[i];
        start = new Date(event.start_time*1000);
        stop = new Date(event.start_time*1000 + event.duration*1000);
        duration = helper.getDurationAsString(event.duration);
        startTime = helper.getTimeString(start);
        endTime = helper.getTimeString(stop);
        if (now.getDate() != start.getDate()) {
            dateIndicator = helper.getWeekDay(start)+', '+helper.getDateString(start);
            this.itemList.append($('<li>').attr('data-date', dateIndicator).addClass('date').text(dateIndicator));
            now = start;
        }
        classNames = event.timer_exists ? (event.timer_active ? ' active-timer' : ' timer') : '';
        dom = $('<li class="clearfix"'+(i==0?' data-date="'+helper.getWeekDay(now)+', '+helper.getDateString(now)+'"':'')+' id="'+event.id+'"><div class="event clearfix'+classNames+'"><h2><div class="start">'+startTime+'</div>'+event.title+'</h2><div class="short-text italic">'+event.short_text+'</div><div class="duration">'+duration+'</div></div></li>');
        event.dom = dom;
        dom.on('click', function () {
            var event = me.events[this.id], win;

            win = new Event(event);
            win.dispatchWindow();
        });
        this.events[event.id] = event;
        this.itemList.append(dom);
    }
};


VDRest.Channel.prototype.scrollFinish = function (ev) {
	var me = this, bodyOffset = $('body').offset();
	clearTimeout(this.scrollTimer);
	this.scrollTimer = setTimeout(function () {
		var collection = me.itemList.find('li[data-date]'),
		    date = collection.first().attr('data-date');
        collection.each($.proxy(function (k, v) {
			var d = $(v);
			if (d.offset().top + d.height() < bodyOffset.top) {
				date = d.attr('data-date');
			} else {
				return false;
			}
		}, this));
		$('#menubar .channel-wrapper .date').text(date);
	}, 20, ev);
};

VDRest.Channel.prototype.addDomEvents = function () {
	$(window).on('orientationchange', $.proxy(this.scrollFinish, this));
	this.body.scroll($.proxy(function () {
		this.scrollFinish();
	}, this));
};

VDRest.Channel.prototype.destruct = function () {
    this.itemList.empty();
    this.wrapper.removeClass('channel-wrapper');
};

VDRest.app.registerModule('Channel');
