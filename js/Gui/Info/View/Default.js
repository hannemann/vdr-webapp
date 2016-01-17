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
    this.speedSelect = $('<div class="vdr-plugins info-item speed-select">');
    this.devices = $('<div class="vdr-devices info-item">');

    this.formKey = Date.now();
};

/**
 * render
 */
Gui.Info.View.Default.prototype.render = function () {

    this.time.appendTo(this.node);
    this.diskUsage.appendTo(this.node);
    this.speedSelect.appendTo(this.node);
    this.devices.appendTo(this.node);
    this.plugins.appendTo(this.node);
    VDRest.Abstract.View.prototype.render.call(this);
    this.addSpeedSelect();
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

Gui.Info.View.Default.prototype.addSpeedSelect = function () {

    $.event.trigger({
        "type" : "form.request",
        "config" : {
            "parentView" : {
                "node" : this.speedSelect
            },
            "cacheKey" : 'timestamp',
            "keyInCache" : this.formKey,
            "timestamp": this.formKey,
            "catConfig" : {
                "speed" : {
                    "label" : VDRest.app.translate("Signal monitor update speed")
                }
            },
            "fields" : {
                "speed" : {
                    "type" : "enum",
                    "dataType" : 'number',
                    "label" : VDRest.app.translate("Setting"),
                    "category" : "speed",
                    "values" : {
                        "veryFast" : {
                            "label" : VDRest.app.translate('Very fast: 0.5s'),
                            "value" : 500
                        },
                        "fast" : {
                            "label" : VDRest.app.translate('Fast: 2s'),
                            "value" : 2000
                        },
                        "medium" : {
                            "label" : VDRest.app.translate('Medium: 10s'),
                            "value" : 10000
                        },
                        "slow" : {
                            "label" : VDRest.app.translate('Slow: 30s'),
                            "value" : 30000
                        },
                        "normal" : {
                            "label" : VDRest.app.translate('Normal: 60s'),
                            "value" : 60000,
                            "selected" : true
                        }
                    }
                }
            },
            "changed": function (result) {

                this.data.dataModel.module.interval = result.speed.selected;
                this.data.dataModel.module.toggleInfoUpdate();

            }.bind(this)
        }
    });

    return this;
};

/**
 * add device to accordion
 * @param {infoDevice} device
 */
Gui.Info.View.Default.prototype.addDevice = function (device) {

    var d = $('<div class="vdr-device accordion-content clearer">');

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
            'Hardware: adapter: %s, frontend: %s',
            device.adapter,
            device.frontend
        )
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Channel: %d. %s',
            device.channel_nr,
            device.channel_name,
            device.channel_id)
    ).appendTo(d);

    $('<div>').text(
        VDRest.app.translate(
            'Channel-ID: %s', device.channel_id)
    ).appendTo(d);

    $('<pre class="signal-indicator">').text(
        VDRest.app.translate(
            "Signal strength:%3d",
            device.signal_strength
        )
    ).append(
        $('<pre>').addClass('indicator').css({
            'width' : device.signal_strength + '%',
            'background-size' : (100 * (100 / device.signal_strength)).toString() + '%'
        }).text(
            VDRest.app.translate(
                "Signal strength:%3d",
                device.signal_strength
            )
        )
    ).appendTo(d);

    $('<pre class="signal-indicator">').text(
        VDRest.app.translate(
            "Signal quality:\t%3d",
            device.signal_quality
        )
    ).append(
        $('<pre>').addClass('indicator').css({
            'width' : device.signal_quality + '%',
            'background-size' : (100 * (100 / device.signal_quality)).toString() + '%'
        }).text(
            VDRest.app.translate(
                "Signal quality:\t%3d",
                device.signal_quality
            )
        )
    ).appendTo(d);

    $('<pre class="femon-data">').text(
        VDRest.app.translate(
            'STR: #%04x (%6.2f%%)',
            device.str,
            100 * device.str / 65535
        )
    ).appendTo(d);

    $('<pre class="femon-data">').text(
        VDRest.app.translate(
            'BER: %08d',
            device.ber
        )
    ).appendTo(d);

    $('<pre class="femon-data">').text(
        VDRest.app.translate(
            'SNR: #%04x (%6.2f%%)',
            device.snr,
            100 * device.snr / 65535
        )
    ).appendTo(d);

    $('<pre class="femon-data">').text(
        VDRest.app.translate(
            'UNC: %08d',
            device.unc
        )
    ).appendTo(d);

    var status = '';

    device.status.split(':').forEach(function (s, i) {
        status += '<span class="' + ('-' === s ? 'false' : 'true') + '">';
        switch (i) {
            case 0:
                status += 'LOCKED';
                break;
            case 1:
                status += 'SIGNAL';
                break;
            case 2:
                status += 'CARRIER';
                break;
            case 3:
                status += 'VITERBI';
                break;
            case 4:
                status += 'SYNC';
                break;
            default:
                break;
        }
        status += '</span>';
    });

    $('<div class="femon-data status">').append(status).appendTo(d);

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

    $.event.trigger("destruct.form-" + this.formKey);

    VDRest.Abstract.View.prototype.destruct.call(this);
};
