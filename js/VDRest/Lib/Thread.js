/**
 * @constructor
 */
var Thread = function () {
};

/**
 * @typedef {{}} threadRequest
 * @property {String} id
 */

/**
 * @type {Object.<Worker>}
 */
Thread.prototype.workers = {};

/**
 * @type {Object.<Function>}
 */
Thread.prototype.callbacks = {};

/**
 * callback wrapper
 * @param e
 */
Thread.prototype.callback = function (e) {

    this.callbacks[e.data.id](e.data.payload);

    delete this.callbacks[e.data.id];
};

/**
 *
 * @param {String} code
 * @param {threadRequest} postData
 * @param {Function} callback
 * @returns {Thread}
 */
Thread.prototype.add = function (code, postData, callback) {

    var worker;

    worker = this.getWorker(code);

    this.callbacks[postData.id] = callback;

    worker.postMessage(postData);
};

/**
 * @param {String} code
 * @return {Worker}
 */
Thread.prototype.getWorker = function (code) {

    var blobUrl;

    if (!this.workers[code]) {
        blobUrl = this.getBlobUrl(code);
        this.workers[code] = new Worker(blobUrl);

        this.workers[code].addEventListener('message', this.callback.bind(this));
    }

    return this.workers[code];
};

/**
 * @param {String} code
 * @return {String}
 */
Thread.prototype.getBlobUrl = function (code) {

    var blob, url;

    blob = new Blob(
        [code],
        {"type": "application/javascript"}
    );
    url = URL.createObjectURL(blob);

    return url;

};

VDRest.thread = new Thread();
