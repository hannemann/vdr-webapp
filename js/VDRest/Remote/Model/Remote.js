/**
 * Remote Model
 * @constructor
 */
VDRest.Remote.Model.Remote = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Remote.Model.Remote.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Remote.Model.Remote.prototype._class = 'VDRest.Remote.Model.Remote';

/**
 * available keys
 * @type {string[]}
 */
VDRest.Remote.Model.Remote.prototype.keys = [
    'Up', 'Down', 'Menu', 'Ok', 'Back', 'Left', 'Right', 'Red', 'Green', 'Yellow', 'Blue',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Info', 'Play', 'Pause', 'Stop', 'Record',
    'FastFwd', 'FastRew', 'Next', 'Prev', 'Power', 'ChanUp', 'ChanDn', 'ChanPrev', 'VolUp', 'VolDn', 'Mute', 'Audio',
    'Subtitles', 'Schedule', 'Channels', 'Timers', 'Recordings', 'Setup', 'Commands',
    'User0', 'User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7', 'User8', 'User9', 'None', 'Kbd'
];

/**
 * send key press
 * @param {String} key
 */
VDRest.Remote.Model.Remote.prototype.send = function (key) {

    this.module.getResource('Remote').send(key);
};

/**
 * retrieve available keys
 */
VDRest.Remote.Model.Remote.prototype.getKeys = function () {

    return this.keys;
};
