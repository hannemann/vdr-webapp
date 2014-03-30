Recording.Window = function () {

    Event.Window.apply(this, arguments);
};

Recording.Window.prototype = new Event.Window();

Recording.Window.prototype.addContents = function () {

    this.addTitle().addDetails().addTabs();
};

/**
 * add title
 * @return {*}
 */
Recording.Window.prototype.addTitle = function () {

    this.getHeader().append('<h2>'+this.getTitle()+'</h2>');
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
 * retrieve title
 * @return {*}
 */
Recording.Window.prototype.getTitle = function () {
    return this.getData('event_title');
};

/**
 * add decorations according to data
 */
Recording.Window.prototype.decorate = function () {};

/**
 * @type {Object}
 */
Recording.Window.prototype.toolsConfig = {
    "record":{
        "dom":function () {

            var dom = $('<dl>').addClass('delete-button'),
                button = $('<dt>').html(this.view.closeSymbol),
                text = $('<dd>');

            text.text('Aufnahme löschen');

            return dom.append(button).append(text);
        },
        "callback":function () {

            actions.deleteRecording(this, this.refresh);
        }
    }
};
