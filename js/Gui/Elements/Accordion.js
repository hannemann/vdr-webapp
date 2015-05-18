/**
 * @typedef {{}} accordionOptions
 * @property {HTMLElement} node     node containing accordion elements
 * @property {boolean} multiOpen  can open multiple elements
 * @property {number[]} open        initially opened elements
 */

/**
 * @param {accordionOptions} options
 * @returns {Gui.Elements.Accordion}
 * @constructor
 */
Gui.Elements.Accordion = function (options) {

    this.node = options.node;
    this.multiOpen = !!options.multiOpen;
    this.open = options.open || [];

    if (this.node instanceof jQuery) {
        this.node = this.node.get(0);
    }

    this.node.classList.add('accordion');
    this.contentSelector = '.accordion-content';
    this.headerSelector = '.accordion-header';

    this.contents = this.node.parentNode
        .querySelectorAll('.accordion > ' + this.contentSelector);
    this.headers = this.node.parentNode.
        querySelectorAll('.accordion > ' + this.headerSelector);
    this.contents = Array.prototype.slice.apply(this.contents);

    this.contents.forEach(function (content, index) {
        this.headers[index].addEventListener('click', this.toggleState.bind(this, index));
        content.style.maxHeight = content.offsetHeight + 'px';
        content.classList.add('closed');
    }.bind(this));

    this.open.forEach(function (index) {
        this.contents[index].classList.remove('closed');
        this.contents[index].classList.add('open');
        this.headers[index].classList.add('initially-open');
        this.contents[index].classList.add('initially-open');
    }.bind(this));

    return this;
};

/**
 * toggle state of clicked item
 * @param index
 */
Gui.Elements.Accordion.prototype.toggleState = function (index) {

    VDRest.Abstract.Controller.prototype.vibrate();

    this.current = index;
    if (this.multiOpen) {

        if (this.isOpen(index)) {
            this.closeContent(index);
        } else {
            this.openContent(index);
        }
    } else {
        this.contents.forEach(function (content, i) {

            this.closeContent(i);

            if (i === index) {
                this.openContent(i);
            }

        }.bind(this));
    }
};

/**
 * determine if content with index is opened
 * @param {number} index
 * @returns {boolean}
 */
Gui.Elements.Accordion.prototype.isOpen = function (index) {

    return this.contents[index].classList.contains('open');
};

/**
 * open content with index
 * @param {number} index
 */
Gui.Elements.Accordion.prototype.openContent = function (index) {

    this.contents[index].classList.remove('closed');
    this.contents[index].classList.add('open');
    this.headers[index].classList.add('active');
    this.open.push(index);
};

/**
 * close content with index
 * @param {number} index
 */
Gui.Elements.Accordion.prototype.closeContent = function (index) {

    this.headers[index].classList.remove('initially-open');
    this.contents[index].classList.remove('initially-open');
    this.contents[index].classList.remove('open');
    this.contents[index].classList.add('closed');
    this.headers[index].classList.remove('active');
    this.open.splice(this.open.indexOf(index), 1);
};

/**
 * remove event listeners
 */
Gui.Elements.Accordion.prototype.destruct = function () {

    this.contents.forEach(function (content, index) {
        this.headers[index].removeEventListener('click', this.toggleState.bind(this, index));
    }.bind(this));
};