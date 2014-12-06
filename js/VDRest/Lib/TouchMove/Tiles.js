/**
 * @param {TouchMove.Slider} slider
 * @constructor
 */
TouchMove.Tiles = function (slider) {
    this.tiles = slider.elem.querySelectorAll('div');
    this.length = this.tiles.length;
};

/**
 * retrieve sum of tiles width and margins
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTilesWidth = function () {
    var width = 0;
    Array.prototype.forEach.call(this.tiles, function (tile) {
        var s = getComputedStyle(tile),
            m = parseInt(s.getPropertyValue('margin-left'), 10) + parseInt(s.getPropertyValue('margin-right'), 10);

        width += m + tile.offsetWidth;
    });

    return width;
};

/**
 * retrieve sum of tiles height and margins
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTilesHeight = function () {
    var height = 0;
    Array.prototype.forEach.call(this.tiles, function (tile) {
        var s = getComputedStyle(tile),
            m = parseInt(s.getPropertyValue('margin-top'), 10) + parseInt(s.getPropertyValue('margin-bottom'), 10);

        height += m + tile.offsetHeight;
    });

    return height;
};