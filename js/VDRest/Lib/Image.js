/**
 * Provides graphucs and manipulation methods
 * @class
 * @constructor
 */
VDRest.Lib.Image = function () {};

/**
 * retrieve imdb logo
 * @returns {string}
 */
VDRest.Lib.Image.prototype.getImdbLogo = function () {

    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAaCAYAAAAT6cSuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA/9pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjVGMzAxQkUyOTk2RkUxMTFBQjZFRkZFRUMwREQwQzZGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkUxQjgxQTdBMUIwRDExRTI4MjU5RjFBMDA4ODk2NEExIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkUxQjgxQTc5MUIwRDExRTI4MjU5RjFBMDA4ODk2NEExIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIElsbHVzdHJhdG9yIENTNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ1dWlkOjgzYTE5ZmI3LWYxOWYtNDhlNS05MWZiLTIxYjc1Mzg1YTE3ZiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEMEU2QkQ3REMxNkZF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";
};

/**
 * retrieve app icon
 * @returns {string}
 */
VDRest.Lib.Image.prototype.getIcon = function () {

    return 'data:image/png;base64,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';
};

/**
 * retrieve throbber frames
 * @returns {string}
 */
VDRest.Lib.Image.prototype.getThrobber = function () {

    return 'data:image/png;base64,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';
};

/**
 * retrieve component icon according to type
 * @param type
 * @returns {string}
 */
VDRest.Lib.Image.prototype.getComponent = function (type) {

    if ('16:9' === type) {

        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAYAAAB50g0VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQCEiIMCs/EoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJaSURBVEjH1Vc9iBNBGH3fZEMkm2IhFgfaSkAUC89CGwsrC8XKSTaFYooVz4DdgYIJGkErORIPIgQLQ/bmRJurba62OLQwcIL9YWDRxEh+9rOZyBLzYyBw64OF+d198973zc4QACilrgMoATiB8EBKKbdJk1MIJ6ShlRvhLoAtKWXrsBgppdYAVHS1REopHpGTUr4Ig2xBkiLQvhUia/9wEYGIbIUoO1p/EQwrjBlxwGOrovEx9Xr9gmEYz4holZkPADxKp9O1WR8sFovRVCq1LoS4yczHieiL7/uFTCbzdtJ4MUNmmkRqhEajcToajb4nIh4MBid7vd4qgHPzFEmlUgUhxGMArzqdzlEALhG9cV33/EIKzoMQ4gGAI4PB4F42m/2qm29PciG4UCK6AQCe55Udx2lXq9WyZVklIroP4MrSCAK4CACGYWwqpU4x8w8A7zqdznoul2tPm0RE5pSuMwtZPA9ElNTFnXa7vUJEFSK6Y5rmxpww2QEAy7LytVotYVlWXrevLJWgTgp4nlfO5XJtz/PKuuvarHme5+V9338JIG+a5gEzX9Xv+7bUGCSijwCOTej6OWue4zjfATj6geu6Z4noA4DdpRIcDodPI5HIZW3VRiKRGFn1elaSaFKb3W73oWEYCSHEcwC/fN9/spDFSikO7oXjddu2d33ftwFkTdNsMfMtZi42m83CP+wAe/F4fC8Wi31mZur3+5ds2/400alpqwzBgYH/i1+dCDBOhki95KQYTIdIuHSQ4L4uV5RSa4et5NiJej/0dxIhpdwGIANKhupW9xs0GPih7u1gBgAAAABJRU5ErkJggg==';
    }

    if ('stereo' === type) {

        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAYAAAB50g0VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMYFjQgrgLeogAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJDSURBVEjHzZdBaBNBFIa/NykxObSUFsQWtEXwrF5EVJDeFCleirMJaqBgc6hQiuLNg9CbQpFWFEFoVTY7hd48FkXw5sWCqFAQqR7KQqUkp5Qkz4MbWWpoc0jpvsvuvnnDfPvPm3kzAuCcuwbMACdIjllr7ZJEcI5kmu2KlGvabSCw1m4eFJFzbhKYjz5nxDmnTThr7ZMkyBaHNDF/kKCp/cdiYhm5maDVsfkfYFKtq52gUql0SkTGgUvAEFABvovIy62trWfFYrG2R//rxpj7qjosIj9U9YHneX47Y7eloIg8F5GvwJUwDLu3t7dPA1+Aud7e3qe7JlMQXDTGvFLVt9VqdUBV3wGvfd8/3zEFPc87s8P1c2FhYSqbzRZUNQ/c2uXn7gLUarXZQqHw2/f92VQqVTTG3AOudkTBVpZOp89FAL/2CD0JEIbhOkClUlmP+/cFMAiC46lUag5o1Ov1O7vFquphgHK5XAVYWVmpRk1H9gXQOTcBrKrqkKqO5/P5N3vkbwjQ09NzCGB0dDQTNW10LAejlThgjHkBXAY+qupELpf71EbXVeDo4ODgMPAtnU4fi/k7o2AQBFZEPqvqBVWdWl5ePtsKzjmnsdLZnOJH0XN6cXGxT1Wn9a897OQ2E4hIn4h0i8jjsbGxehNmJ1CLHeC9qt4UkZFMJrMhIiONRuNGLpf70NbYzQGstZKkCtLkSnypMzHi/gSp198qB70ECefFAdei93nn3ORBK7njRL2W+DuJsdYuATamZKJudX8AyEXyf8hB+OQAAAAASUVORK5CYII=';
    }

};

VDRest.Lib.Image.prototype.math =
    'degToRad = function (deg) {' +
    '   return deg * Math.PI / 180;' +
    '};' +
    'getLengthByAngleAndDiameter = function (angle, circumcircleDiameter) {' +
    '   return circumcircleDiameter * Math.sin(degToRad(angle));' +
    '};' +
    'getAngle = function (alpha, beta) {' +
    '   return 180 - alpha - beta;' +
    '};' +
    'getCircumcircleDiameter = function (angle, length) {' +
    '   return length / Math.sin(degToRad(angle));' +
    '};';

VDRest.Lib.Image.prototype.transparencyGradientWorkerCode = 'onmessage = function (e) {'
+ 'var x, y, start, end;'
+ 'for (x = 0; x < e.data.rows; x++) {'
+ '     transparency = Math.round(0 - getLengthByAngleAndDiameter(e.data.alpha, getCircumcircleDiameter(e.data.beta, e.data.rows - x)));'
+ '     start = x * e.data.columns * 4 + 3;'
+ '     end = (x+1) * e.data.columns * 4;'
+ '     for (y = start ; y < end; y+=4) {'
+ '         if (y < start + e.data.offset * 4) {'
+ '             e.data.image.data[y] = 0;'
+ '         } else {'
+ '             e.data.image.data[y] = transparency >= 0 ? transparency <= 255 ? transparency : 255 : 0;'
+ '             transparency += 100 / e.data.width * 255 / 100;'
+ '         }'
+ '     }'
+ '}'
+ 'postMessage({"id" : e.data.id, "payload" : e.data.image});'
+ '};';

/**
 * apply transparency to image
 * @param {HTMLImageElement} img
 * @param {String} src
 * @param {Number} alpha integer, angle of gradient
 * @param {Number} offset integer, offset of gradient
 * @param {Number} width integer, width of gradient
 * @param {function} complete callback
 * @param {String} id
 */
VDRest.Lib.Image.prototype.applyTransparencyGradient = function (img, src, alpha, offset, id, width, complete) {

    img.classList.add('hidden-for-processing');

    alpha = alpha || 0;
    offset = offset || 0;

    img.onload = function () {

        var ca = document.createElement("canvas"),
            ctx = ca.getContext("2d"),
            image,
            rows,
            columns,
            transparency,
            x, y, start, end, post, callback,
            gamma = 90, beta = Math.Triangle.getAngle(alpha, gamma);

        this.width = Math.round(this.height * (this.naturalWidth / this.naturalHeight));
        ca.width = columns = this.width;
        ca.height = rows = this.height;

        if (ca.width <= 0) {

            this.onload = null;
            this.src = ca.toDataURL();
            this.classList.remove('hidden-for-processing');

            return;
        }

        if (width !== 0) {
            width = width || ca.width-offset;
        }
        // draw the image into the canvas
        ctx.drawImage(this, 0, 0, ca.width, ca.height);
        // get the image data object
        image = ctx.getImageData(0, 0, ca.width, ca.height);

        var useMainThread = false;

        if (useMainThread) {

            // compute in main thread
            /**
             * iterate rows
             */
            for (x = 0; x < rows; x++) {
                transparency = Math.round(0 - Math.Triangle.getLengthByAngleAndDiameter(
                    alpha, Math.Triangle.getCircumcircleDiameter(beta, rows - x)
                ));
                /**
                 * iterate columns
                 */
                start = x * columns * 4 + 3;
                end = (x + 1) * columns * 4;
                for (y = start; y < end; y += 4) {
                    if (y < start + offset * 4) {
                        image.data[y] = 0;
                    } else {
                        image.data[y] = transparency >= 0 ? transparency <= 255 ? transparency : 255 : 0;
                        transparency += 100 / width * 255 / 100;
                    }
                }
            }
            //and put the image data back to the canvas
            ctx.putImageData(image, 0, 0);

            this.onload = null;
            this.src = ca.toDataURL();
            this.classList.remove('hidden-for-processing');
            if ("function" === typeof complete) {
                complete(img);
            }

        } else {

            // compute in worker

            post = {
                "columns": columns,
                "rows": rows,
                "alpha": alpha,
                "beta": beta,
                "offset": offset,
                "width": width,
                "image": image,
                "id": id
            };

            callback = function (imageData) {
                ctx.putImageData(imageData, 0, 0);
                this.onload = null;
                this.src = ca.toDataURL();
                this.classList.remove('hidden-for-processing');
                if ("function" === typeof complete) {
                    complete(img);
                }
            }.bind(this);

            VDRest.thread.add(
                VDRest.image.math + VDRest.image.transparencyGradientWorkerCode,
                post,
                callback
            );
        }
    };

    img.src = src;
};

VDRest.image = new VDRest.Lib.Image();
