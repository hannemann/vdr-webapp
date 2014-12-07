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
 * @param {NodeList} [tiles]
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTilesWidth = function (tiles) {
    var width = 0;
    tiles = tiles || this.tiles;

    Array.prototype.forEach.call(tiles, function (tile) {
        var s = getComputedStyle(tile),
            m = parseInt(s.getPropertyValue('margin-left'), 10) + parseInt(s.getPropertyValue('margin-right'), 10);

        width += m + tile.offsetWidth;
    });

    return width;
};

/**
 * retrieve sum of tiles height and margins
 * @param {NodeList} [tiles]
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTilesHeight = function (tiles) {
    var height = 0;
    tiles = tiles || this.tiles;

    Array.prototype.forEach.call(tiles, function (tile) {
        var s = getComputedStyle(tile),
            m = parseInt(s.getPropertyValue('margin-top'), 10) + parseInt(s.getPropertyValue('margin-bottom'), 10);

        height += m + tile.offsetHeight;
    });

    return height;
};