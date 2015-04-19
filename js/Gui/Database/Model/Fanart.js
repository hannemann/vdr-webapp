/**
 * @class
 * @constructor
 */
Gui.Database.Model.Fanart = function () {
};

/**
 * initialize view
 * @param {String} type movies or shows
 * @param {VDRest.Database.Model.Images.Image} model image model
 * @param {Function} callback
 */
Gui.Database.Model.Fanart.prototype.createFanartCollage = function (type, model, callback) {

    var collection = this.module.backend.getModel(model.id.replace(/^([a-z]*)_.*/, "$1").ucfirst()),
        fanarts = [],
        getFanarts = function () {

            collection.each(function (media) {

                var f = media.getData('fanart');

                if (!f && media.hasData('fanarts')) {
                    f = media.getData('fanarts');
                    if (f instanceof Array && f.length > 0) {
                        f[0].path && fanarts.push(f[0].path);
                    }
                } else if (f && '' !== f) fanarts.push(f);

            }, function () {

                fanarts.shuffle();
                this.createCollage(fanarts.slice(0, 3), model, callback);

            }.bind(this));
        }.bind(this);

    if (collection.readystate < 4) {
        collection.onreadystatechange = function (state) {

            if (4 === state) getFanarts();
        };
    } else {

        getFanarts();
    }
};

/**
 * create collage from fanarts
 * @param {Array} fanarts
 * @param {VDRest.Database.Model.Images.Image} model
 * @param {Function} callback
 */
Gui.Database.Model.Fanart.prototype.createCollage = function (fanarts, model, callback) {

    var ca = document.createElement('canvas'),
        ctx = ca.getContext("2d"), i = 0, l = fanarts.length,
        tmp = [], offset, deg, imgurl, grwidth, c = 0;

    ca.width = 1280;
    ca.height = 720;

    deg = 0;
    grwidth = ca.width / l;
    offset = ca.width - ca.width / l - grwidth / 2;

    for (i; i < l; i++) {

        tmp[i] = new Image();
        tmp[i].crossOrigin = '';
        tmp[i].width = ca.width;
        tmp[i].style.position = 'absolute';
        tmp[i].style.left = '99999px';
        document.body.appendChild(tmp[i]);

        imgurl = VDRest.Api.Resource.prototype.getBaseUrl() + 'scraper/image/' + fanarts[i];
        VDRest.helper.log(imgurl, offset);
        grwidth = i < l - 1 ? grwidth : 0;
        VDRest.image.applyTransparencyGradient(tmp[i], imgurl, deg, offset, imgurl.toCacheKey(), grwidth, function () {

            c++;
            if (c == l) {

                for (c = l - 1; c >= 0; c--) {

                    ctx.drawImage(tmp[c], 0, 0, ca.width, ca.height);
                    tmp[c].parentNode.removeChild(tmp[c]);
                }

                model.setData('name', model.id)
                    .setData('data_url', ca.toDataURL())
                    .save();

                "function" === typeof callback && callback();
            }
        });

        offset -= ca.width / l;
    }


};