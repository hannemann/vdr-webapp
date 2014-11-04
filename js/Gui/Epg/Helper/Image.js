/**
 * @class
 * @constructor
 */
Gui.Epg.Helper.Image = function () {};

/**
 * @type {VDRest.Abstract.Helper}
 */
Gui.Epg.Helper.Image.prototype = new VDRest.Abstract.Helper();

/**
 * apply opacity gradient to image
 * @param {HTMLImageElement} img
 * @param {String} src
 */
Gui.Epg.Helper.Image.prototype.getImageGradient = function (img, src) {

    img.classList.add('hidden-for-processing');

    img.onload = function () {

        var c = document.createElement("canvas"),
            ctx = c.getContext("2d");

        img.width = img.height * (img.naturalWidth / img.naturalHeight);

        c.width = img.width;
        c.height = img.height;
        // draw the image into the canvas
        ctx.drawImage(img, 0, 0, c.width, c.height);

        // get the image data object
        var image = ctx.getImageData(0, 0, c.width, c.height);
        // get the image data values
        var imageData = image.data;
        /**
         * iterate rows
         */
        var rows = c.height;
        var columns = c.width;
        for (var x = 0; x < rows; x++) {
            var transparency = 0;
            /**
            * iterate columns
            */
            var y = x * columns * 4+ 3,
                end = (x+1)*columns * 4;
            for (y ; y < end; y+=4) {
                imageData[y] = transparency;
                transparency += Math.floor(100 / c.width * 255 / 100);
            }
        }
        //after the manipulation, reset the data
        image.data = imageData;
        //and put the imagedata back to the canvas
        ctx.putImageData(image, 0, 0);

        img.src = c.toDataURL();
        img.onload = undefined;
        img.classList.remove('hidden-for-processing');
    };

    img.src = src;
};