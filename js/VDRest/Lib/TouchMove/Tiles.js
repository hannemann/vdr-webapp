/**
 * @param {NodeList} tiles
 * @constructor
 */
TouchMove.Tiles = function (tiles) {
    this.tiles = tiles;
    this.length = this.tiles.length;
};

/**
 * retrieve sum of tile width and margins
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTileWidth = function () {
    var width = 0,
        s = getComputedStyle(this.tiles[0]),
        m = parseInt(s.getPropertyValue('margin-left'), 10) + parseInt(s.getPropertyValue('margin-right'), 10);

    width += m + this.tiles[0].offsetWidth;

    return width;
};

/**
 * retrieve sum of tile height and margins
 * @returns {number}
 */
TouchMove.Tiles.prototype.getTileHeight = function () {
    var height = 0,
        s = getComputedStyle(this.tiles[0]),
        m = parseInt(s.getPropertyValue('margin-top'), 10) + parseInt(s.getPropertyValue('margin-bottom'), 10);

    height += m + this.tiles[0].offsetHeight;

    return height;
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