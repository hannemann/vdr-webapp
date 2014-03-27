GuiListItem = function () {};

GuiListItem.prototype.mainClassName = 'list-item';

GuiListItem.prototype = new GuiItem();

/**
 * match string against reg and return date
 * @param time
 * @param reg
 * @return {date|bool}
 */
GuiListItem.prototype.getDate = function (time, reg) {
    if (!reg instanceof RegExp) {
        throw 'Argument reg is not of type RegExp';
    }
    if (time.match(reg)) {
        return new Date(
            parseInt(RegExp.$1, 10),
            parseInt(RegExp.$2, 10)-1,
            parseInt(RegExp.$3, 10),
            parseInt(RegExp.$4 ? RegExp.$4 : 0, 10),
            parseInt(RegExp.$5 ? RegExp.$5 : 0, 10),
            parseInt(RegExp.$6 ? RegExp.$6 : 0, 10)
        );
    }
    return false;
};