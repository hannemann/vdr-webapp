/**
 * @constructor
 * @property {threadRequest} dispatcher
 */
var Thread = function () {
};

/**
 * @typedef {{}} threadRequest
 * @property {Worker} worker
 * @property {Function} cb
 * @property {{}} postData
 */

/**
 *
 * @type {threadRequest[]}
 */
Thread.prototype.heap = [];

Thread.prototype.max = 5;

/**
 * @param {Worker} worker
 * @param {Function} cb
 * @param {{}} postData
 * @returns threadRequest
 */
Thread.prototype.register = function (worker, cb, postData) {

    var request = {
        "worker": worker,
        "cb": cb,
        "postData": postData
    };

    request.worker.addEventListener('message', cb);

    this.heap.push(request);

    return request;
};

/**
 * @param {Worker} worker
 */
Thread.prototype.free = function (worker) {

    this.heap.forEach(function (w, i) {
        if (w.worker === worker) {
            this.heap.splice(i, 1);
            w.worker.removeEventListener('message');
        }
    }.bind(this));
};

/**
 * @param {threadRequest} request
 */
Thread.prototype.startWait = function (request) {

    if (this.heap.length >= this.max) {
        this.dispatcher.worker.addEventListener('message', this.start.bind(this, request));
    } else {
        this.start(request);
    }
};

/**
 * @param {threadRequest} request
 */
Thread.prototype.start = function (request) {

    request.worker.addEventListener('message', this.free.bind(this, request.worker));
    request.worker.postMessage(request.postData);
};

/**
 *
 * @param {String} code
 * @param {Function} cb
 * @param {{}} postData
 * @returns {Thread}
 */
Thread.prototype.add = function (code, cb, postData) {

    var blob, url, worker, request;

    //debugger;

    blob = new Blob(
        [code],
        {"type": "application/javascript"}
    );
    url = URL.createObjectURL(blob);

    worker = new Worker(url);

    request = this.register(worker, cb, postData);

    this.startWait(request);
    this.dispatcher = request;
};

VDRest.thread = new Thread();
