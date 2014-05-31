/**
 * Channels resource
 * @constructor
 */
VDRest.Recordings.Model.List.Recording = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.Recordings.Model.List.Recording.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 * @private
 */
VDRest.Recordings.Model.List.Recording.prototype._class = 'VDRest.Recordings.Model.List.Recording';

/**
 * @type {string}
 */
VDRest.Recordings.Model.List.Recording.prototype.cacheKey = 'number';

/**
 * initialize update event
 */
VDRest.Recordings.Model.List.Recording.prototype.init = function () {

    $(document).on('vdrest-api-actions.recording-updated.' + this.data.number, $.proxy(this.update, this));
};

/**
 * process update event
 */
VDRest.Recordings.Model.List.Recording.prototype.update = function () {

    var recFile = this.data.relative_file_name.split('/').pop(),
        newRelFileName;

    this.data.name = (
        (this.data.newPath ? this.data.newPath + '~' : '')
        + this.data.newFileName
    );

    newRelFileName = this.data.name.replace(/\s/g, '_').split('~');
    newRelFileName.push(recFile);
    newRelFileName = '/' + newRelFileName.join('/');

    this.data.file_name = this.data.file_name.replace(
        this.data.relative_file_name,
        newRelFileName
    );

    this.data.relative_file_name = newRelFileName;

    this.data.newPath = undefined;
    this.data.newFileName = undefined;
};
