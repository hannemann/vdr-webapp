/**
 * @constructor
 * @property {Element|HTMLDivElement} fileUploadWrapper
 * @property {Element|HTMLInputElement} fileUpload
 * @property {jQuery.fn.init} node
 */
Gui.Config.View.Settings = function () {};

/**
 * @type {Gui.Form.View.Abstract}
 */
Gui.Config.View.Settings.prototype = new Gui.Form.View.Abstract();

/**
 * initialize
 */
Gui.Config.View.Settings.prototype.init = function () {

    this.node = $('<form id="settings">');

    this.categories = {};
};

/**
 * render items
 */
Gui.Config.View.Settings.prototype.render = function () {

    this.prepareFields();

    this.renderCategories();

    this.addImportFileInput();

    this.node.addClass('window collapsed viewport-fullsize');

    VDRest.Abstract.View.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

/**
 * add import file input field
 */
Gui.Config.View.Settings.prototype.addImportFileInput = function () {

    this.fileUpload = document.createElement('input');
    this.fileUpload.type = 'file';
    this.fileUploadWrapper = document.createElement('div');
    this.fileUploadWrapper.appendChild(this.fileUpload);
    this.fileUploadWrapper.style.position = 'absolute';
    this.fileUploadWrapper.style.left = '-9999px';
    this.fileUpload.id = 'import-settings-file';
    document.body.appendChild(this.fileUploadWrapper);
};

/**
 * remove import file input
 * @return {Gui.Config.View.Settings}
 */
Gui.Config.View.Settings.prototype.removeImportFileInput = function () {

    document.body.removeChild(this.fileUploadWrapper);
    return this;
};

/**
 * destruct
 */
Gui.Config.View.Settings.prototype.destruct = function () {

    document.body.removeChild(this.fileUploadWrapper);
    Gui.Form.View.Abstract.prototype.destruct.call(this);
};
