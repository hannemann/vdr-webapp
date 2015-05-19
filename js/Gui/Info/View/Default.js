/**
 * @class
 * @constructor
 * @property {{dataModel:VDRest.Info.Model.Info}} data
 */
Gui.Info.View.Default = function () {};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Info.View.Default.prototype = new VDRest.Abstract.View();

/**
 * initialize nodes
 */
Gui.Info.View.Default.prototype.init = function () {

    this.node = $('<div id="info">').addClass('window collapsed viewport-fullsize');
    this.time = $('<div class="vdr-time info-item">');
    this.diskUsage = $('<div class="vdr-diskusage info-item">');
    this.plugins = $('<div class="vdr-plugins info-item">');
    this.devices = $('<div class="vdr-devices info-item">');
};

/**
 * render
 */
Gui.Info.View.Default.prototype.render = function () {

    this.time.appendTo(this.node);
    this.diskUsage.appendTo(this.node);
    this.devices.appendTo(this.node);
    this.plugins.appendTo(this.node);
    VDRest.Abstract.View.prototype.render.call(this);
    this.setItems();
    this.node.toggleClass('collapsed expand');
};

/**
 * set items
 */
Gui.Info.View.Default.prototype.setItems = function () {

    this.setVdrTime().setDiskUsage().setDevices().setPlugins();
};

/**
 * set Time
 * @returns {Gui.Info.View.Default}
 */
Gui.Info.View.Default.prototype.setVdrTime = function () {

    var d = new Date(this.data.dataModel.data.time * 1000);
    this.time.empty();
    $('<h3>').text(VDRest.app.translate('VDR Date:')).prependTo(this.time);
    $('<div>').appendTo(this.time).text(VDRest.helper.getDateTimeString(d, true));
    return this;
};

/**
 * set disk usage
 * @returns {Gui.Info.View.Default}
 */
Gui.Info.View.Default.prototype.setDiskUsage = function () {

    var d = this.data.dataModel.data.diskusage,
        wrapper, bg;

    this.diskUsage.empty();

    $('<h3>').text(VDRest.app.translate('Diskusage:')).prependTo(this.diskUsage);

    wrapper = $('<div class="diskusage-wrapper">').appendTo(this.diskUsage);
    bg = $('<div>').appendTo(wrapper);
    $('<div>')
        .css({"width" : d.used_percent + '%'})
        .appendTo(bg)
        .text(d.used_percent + '%');

    $('<div>').text(d.description_localized).appendTo(this.diskUsage);
    $('<div>').text(VDRest.app.translate('Free MB: %s', d.free_mb)).appendTo(this.diskUsage);

    return this;
};

/**
 * set devices
 * @returns {Gui.Info.View.Default}
 */
Gui.Info.View.Default.prototype.setDevices = function () {

    var devices = this.data.dataModel.data.vdr.devices,
        open = [0],
        node = this.devices[0];

    if (this.dAccordion) {
        open = this.dAccordion.open;
    }
    this.devices.empty();

    $('<h3>').text(VDRest.app.translate('Devices:')).appendTo(this.devices);

    devices.forEach(this.addDevice.bind(this));

    this.dAccordion = new Gui.Elements.Accordion({
        /** @type {HTMLElement} */
        "node": node,
        "open": open,
        "multiOpen": true
    });

    return this;
};

/**
 * add device to accordion
 * @param {infoDevice} device
 */
Gui.Info.View.Default.prototype.addDevice = function (device) {
    var d = $('<div class="vdr-device accordion-content">');

    $('<div class="accordion-header">').text(VDRest.app.translate('Device %d - %s', device.number, device.name)).appendTo(this.devices);

    $('<div>').text(
        VDRest.app.translate(
            'Is %sprimary device',
            device.primary ? '' : VDRest.app.translate('not') + ' ')
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Type: %s',
            device.type)
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Has CI: %s',
            device.has_ci ? VDRest.app.translate('Yes') : VDRest.app.translate('No'))
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Has decoder: %s',
            device.has_decoder ? VDRest.app.translate('Yes') : VDRest.app.translate('No'))
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Currently viewed: %s',
            device.live ? VDRest.app.translate('Yes') : VDRest.app.translate('No'))
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Signal strength: %d',
            device.signal_strength)
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Signal quality: %d',
            device.signal_quality)
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Channel: %d. %s - %s',
            device.channel_nr,
            device.channel_name,
            device.channel_id)
    ).appendTo(d);
    $('<div>').text(
        VDRest.app.translate(
            'Hardware: adapter: %s, frontend: %s',
            device.adapter,
            device.frontend
        )
    ).appendTo(d);

    d.appendTo(this.devices);
};

/**
 * set plugins
 * @returns {Gui.Info.View.Default}
 */
Gui.Info.View.Default.prototype.setPlugins = function () {

    var plugins = this.data.dataModel.data.vdr.plugins;

    this.plugins.empty();
    $('<h3>').text(VDRest.app.translate('Plugins:')).appendTo(this.plugins);
    plugins.forEach(function (plugin) {
        var p = $('<div class="vdr-plugin">');
        $('<div>').text(plugin.name + ' - ' + plugin.version).appendTo(p);
        p.appendTo(this.plugins);
    }.bind(this));
    return this;
};

/**
 * destruct view
 */
Gui.Info.View.Default.prototype.destruct = function () {

    if (this.dAccordion) {
        this.dAccordion.destruct();
        delete this.dAccordion;
    }

    VDRest.Abstract.View.prototype.destruct.call(this);
};
