Recording.Window = function () {

    Event.Window.apply(this, arguments);
};

Recording.Window.prototype = new Event.Window();

Recording.Window.prototype.addContents = function () {

    console.log(this);

    this.addTitle().addDetails().addTabs();
};

/**
 * add title
 * @return {*}
 */
Recording.Window.prototype.addTitle = function () {

    this.getHeader().append('<h2>'+this.getData('event_title')+'</h2>');
    return this;
};

/**
 * add details
 * @return {*}
 */
Recording.Window.prototype.addDetails = function () {

    var data = this.getData(),
        details = $('<ul class="details"><li class="italic">'+data.event_short_text+'</li></ul>'),
        duration = helper.getDurationAsString(data.duration);

    details.append('<li>'+duration+'</li>')
        .appendTo(this.getHeader());

    return this;
};

/**
 * retrieve description
 * @return {*}
 */
Recording.Window.prototype.getDescription = function () {
    return this.getData('event_description');
};

/**
 * add decorations according to data
 */
Recording.Window.prototype.decorate = function () {};
