VDRest.Recording.Window = function () {};

//VDRest.Recording.Window.prototype = new Broadcasts.Window();

/**
 * set custom eventPrefix
 * @return {*}
 */
VDRest.Recording.Window.prototype.setEventPrefix = function () {

    this.eventPrefix = 'VDRest.Recording.Window';
    return this;
};

/**
 * add contents to wrapper
 */
VDRest.Recording.Window.prototype.addContents = function () {

    this.addTitle().addDetails().addTabs();
};

/**
 * add title
 * @return {*}
 */
VDRest.Recording.Window.prototype.addTitle = function () {

    this.getHeader().append('<h2>'+this.getTitle()+'</h2>');
    return this;
};

/**
 * add details
 * @return {*}
 */
VDRest.Recording.Window.prototype.addDetails = function () {

    var data = this.getData(),
        details = $('<ul class="details"><li class="italic">'+data.event_short_text+'</li></ul>'),
        duration = helper.getDurationAsString(data.duration);

    details
        .append('<li>'+helper.getDateTimeString(new Date(data.event_start_time * 1000), true)+'</li>')
        .append('<li>Länge: '+duration+'</li>')
        .appendTo(this.getHeader());

    return this;
};

/**
 * retrieve description
 * @return {*}
 */
VDRest.Recording.Window.prototype.getDescription = function () {
    return this.getData('event_description');
};

/**
 * retrieve title
 * @return {*}
 */
VDRest.Recording.Window.prototype.getTitle = function () {
    return this.getData('event_title');
};

/**
 * add decorations according to data
 */
VDRest.Recording.Window.prototype.decorate = function () {};

/**
 * @type {Object}
 */
VDRest.Recording.Window.prototype.toolsConfig = {
    "record":{
        "dom":function () {

            var dom = $('<dl>').addClass('delete-button'),
                button = $('<dt>').html(this.view.closeSymbol),
                text = $('<dd>');

            text.text('Aufnahme löschen');

            return dom.append(button).append(text);
        },
        "callback":function () {

            actions.deleteRecording(this, $.proxy(this.removeDeleted, this));
        }
    }
};

/**
 * remove self
 */
VDRest.Recording.Window.prototype.removeDeleted = function () {

    var dom = this.getData('dom');

    $.event.trigger(this.eventPrefix + '.close');

    dom.fadeOut(function () {
            dom.remove();
        }
    );
};
