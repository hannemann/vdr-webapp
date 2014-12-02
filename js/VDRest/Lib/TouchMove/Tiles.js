/**
 * @param {TouchMove.Slider} slider
 * @constructor
 */
TouchMove.Tiles = function (slider) {
    this.tiles = slider.elem.querySelectorAll('div');
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