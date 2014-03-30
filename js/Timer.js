Timer = function (options) {

    Event.apply(this, arguments);
    this.element = $('<li>');
};

Timer.prototype = new Event();

Timer.prototype.className = 'timer-list-item collapsible collapsed';

/**
 * retrieve paths as array
 * @return {Array}
 */
Timer.prototype.paths = function () {
    return this.getData('filename').split('~').slice(0, -1);
};

/**
 * retrieve filename
 * @return {string}
 */
Timer.prototype.name = function () {
    return this.getData('filename').split('~').slice(-1)[0];
};

Timer.prototype.renderIn = function (dom) {
    if (!dom instanceof jQuery) {
        throw 'Argument dom is not of type jQuery in Timer.prototype.renderIn';
    }
    dom.append(this.dom().addClass(this.className).append('<div>'+this.name()+'</div>'));
};