/**
 * @class
 * @constructor
 */
Gui.Database.Controller.Default = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.Database.Controller.Default.prototype = new VDRest.Abstract.Controller();

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.init = function () {

    this.view = this.module.getView('Default', this.data);

    this.tiles = [];

    this.view.setParentView(
        VDRest.app.getModule('Gui.Viewport').getView('Default')
    );
};

/**
 * initialize view
 */
Gui.Database.Controller.Default.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);
    this.initFanarts();
    this.addObserver();
    this.data.animateMax = window.innerWidth * (this.tiles.length - 1);
    this.data.animateMin = -window.innerWidth;
};

/**
 * add event listeners
 */
Gui.Database.Controller.Default.prototype.addObserver = function () {

    this.view.node.on('mousedown touchstart', this.handleDown.bind(this))
};

/**
 * remove event listeners
 */
Gui.Database.Controller.Default.prototype.removeObserver = function () {

    this.view.node.off('mousedown touchstart')
};

/**
 * add event listeners
 * @param {jQuery.Event} e
 */
Gui.Database.Controller.Default.prototype.handleDown = function (e) {

    var transform;

    e.preventDefault();

    if (window.innerHeight < window.innerWidth) {
        this.data.animateClient = document.querySelector('#media-browser');
        this.data.animateClient.style.transition = 'All 0s ease-out';
        transform = this.data.animateClient.style.transform;
        this.data.animateStartPosition = transform ? parseInt(transform.replace(/.*X\(([^)]*)px.*/, "$1"), 10) : 0;
        this.data.touchStart = e.originalEvent.touches[0].clientX * -1;
        this.data.animateMaxed = false;
        this.data.animateStartTime = new Date().getTime();
        this.view.node.on('mousemove touchmove', this.handleMove.bind(this));
        this.view.node.one('mouseup touchend', this.handleUp.bind(this));
    }
};

/**
 * add event listeners
 * @param {jQuery.Event} e
 */
Gui.Database.Controller.Default.prototype.handleMove = function (e) {

    var direction, newPos, maxDelta = 30, currentPos;

    e.preventDefault();

    if (window.innerHeight < window.innerWidth) {
        this.data.animateDelta =
            parseInt(this.data.touchStart, 10) +
            parseInt(e.originalEvent.changedTouches[0].clientX, 10);

        direction = this.data.animateDelta > 0 ? 'right' : 'left';
        newPos = parseInt(this.data.animateDelta, 10) + parseInt(this.data.animateStartPosition, 10);
        currentPos = parseInt(this.data.animateClient.style.transform.replace(/.*X\(([^)]*)px.*/, "$1"), 10);

        if (direction == 'left' && Math.abs(newPos) > this.data.animateMax) {
            if (Math.abs(newPos) - this.data.animateMax > maxDelta) {
                newPos = currentPos;
                this.data.animateMaxed = true;
            }
        } else if (direction == 'right' && newPos > 0) {
            if (newPos > maxDelta) {
                newPos = currentPos;
                this.data.animateMaxed = true;
            }
        } else {
            newPos = this.data.animateDelta + this.data.animateStartPosition;
        }

        this.data.animateClient.style.transform = 'translateX(' + newPos + 'px) translateZ(0)'
    }
};

/**
 * add event listeners
 * @param {jQuery.Event} e
 */
Gui.Database.Controller.Default.prototype.handleUp = function (e) {

    var direction, animateTime, endPos, currentPos, delta, deltaToEnd, speed, s;

    e.preventDefault();

    if (window.innerHeight < window.innerWidth) {
        animateTime = (new Date().getTime() - this.data.animateStartTime) / 1000;
        this.view.node.off('mousemove touchmove');
        currentPos = parseInt(this.data.animateClient.style.transform.replace(/.*X\(([^)]*)px.*/, "$1"), 10);
        delta = Math.abs(this.data.animateStartPosition - currentPos);
        if (delta == 0 || isNaN(delta)) return;
        direction = this.data.animateDelta > 0 ? 'right' : 'left';
        deltaToEnd = window.innerWidth - delta;
        speed = delta / animateTime;
        s = deltaToEnd / speed;
        s = s > 1 ? 1 : s;
        this.data.animateClient.style.transition = 'All ' + s + 's ease-out';

        if ((speed < 350 && 100 * Math.abs(this.data.animateDelta) / window.innerWidth < 25) || this.data.animateMaxed) {
            endPos = this.data.animateStartPosition;
            this.data.animateClient.style.transition = 'All .3s ease-out';
        } else {

            if (direction == 'left') {
                endPos = this.data.animateStartPosition - window.innerWidth;
                endPos = endPos <= this.data.animateMin ? this.data.animateMin : endPos;
            } else {
                endPos = this.data.animateStartPosition + window.innerWidth;
                endPos = endPos >= 0 ? 0 : endPos;
            }
        }
        this.data.animateClient.style.transform = 'translateX(' + endPos + 'px)';
    }
};

/**
 * initialize fanart
 */
Gui.Database.Controller.Default.prototype.initFanarts = function () {

    this.tiles.push(this.module.getController('Fanarts', {
        "id": "movies",
        "header": "Movies",
        "type": "movies",
        "parent": this
    }));
    this.tiles.push(this.module.getController('Fanarts', {
        "id": "shows",
        "header": "TV-Shows",
        "type": "shows",
        "parent": this
    }));
};
