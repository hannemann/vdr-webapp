/**
 * create style sheet object and append it to head
 *
 * @param media
 * @constructor
 */
VDRest.Lib.StyleSheet = function (media) {

    var style = document.createElement("style");

    if (media) {
        style.setAttribute("media", media)
    }

    // WebKit hack :(
    style.appendChild(document.createTextNode(""));
    document.head.appendChild(style);
    this.sheet = style.sheet;
};

/**
 * add css rule to style sheet
 *
 * @param {string} selector
 * @param {string} rules
 * @param {number} [index]
 */
VDRest.Lib.StyleSheet.prototype.addRule = function (selector, rules, index) {

    index = index || 0;

    if("insertRule" in this.sheet) {
        this.sheet.insertRule(selector + "{" + rules + "}", index);
    }
    else if("addRule" in this.sheet) {
        this.sheet.addRule(selector, rules, index);
    }
};

VDRest.Lib.StyleSheet.prototype.removeRule = function () {};