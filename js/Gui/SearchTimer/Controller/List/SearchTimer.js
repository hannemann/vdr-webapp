/**
 * @class
 * @constructor
 */
Gui.SearchTimer.Controller.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.Controller}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype = new VDRest.Abstract.Controller();

/**
 * @type {string}
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.init = function () {

    this.eventNameSpace = this.module.namespace + this.module.name;

    this.view = this.module.getView('List.SearchTimer', {
        "id" : this.data.id
    });

    this.view.setParentView(
        this.data.parent.view
    );

    this.dataModel = VDRest.app.getModule('VDRest.SearchTimer').getModel('List.SearchTimer', {
        "id" : this.data.id
    });

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });
};

/**
 * dispatch view, init event handling
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.dispatchView = function () {

    VDRest.Abstract.Controller.prototype.dispatchView.call(this);

    this.addObserver();
};

/**
 * add event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.addObserver = function () {

    this.view.node.on('click', this.requestWindowAction.bind(this));

    if (VDRest.helper.isTouchDevice) {
        this.view.node
            .on('touchend', this.handleUp.bind(this))
            .on('touchmove', this.handleMove.bind(this))
            .on('touchstart', this.handleDown.bind(this))
        ;
    } else {
        this.view.node
            .on('mouseup', this.handleUp.bind(this))
            .on('mousedown', this.handleDown.bind(this))
        ;
    }

    $(document).on('gui-searchtimer.updated.' + this.keyInCache + '.' + this.eventNameSpace, this.update.bind(this));
};

/**
 * remove event listeners
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.removeObserver = function () {

    this.view.node.off('click touchend touchstart touchmove mouseup mousedown');

    $(document).off('gui-searchtimer.' + this.keyInCache + '.' + this.eventNameSpace);
};


/**
 * handle mouseup
 * @param {jQuery.Event} e
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleUp = function (e) {

    e.preventDefault();

    if (!this.isMuted) {

        if ("undefined" === typeof this.preventClick) {

            this.vibrate();

            if ("undefined" !== typeof this.clickTimeout) {
                window.clearTimeout(this.clickTimeout);
            }
            this.requestWindowAction(e)
        }
    }
    document.onselectstart = function () {
        return true
    };
};

/**
 * prevent click on move
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleMove = function () {

    this.preventClick = true;

    //if ("undefined" !== typeof this.clickTimeout) {
    //    window.clearTimeout(this.clickTimeout);
    //}
};

/**
 * handle mousedown
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.handleDown = function () {

    document.onselectstart = function () {
        return false
    };

    this.preventClick = undefined;

    //this.clickTimeout = window.setTimeout(function () {
    //
    //    this.vibrate(100);
    //
    //    this.preventClick = true;
    //
    //}.bind(this), 500);
};

/**
 * update data, cache, view
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.update = function (e) {

    var timer = e.payload, cache = this.module.cache.store;

    this.data.id = timer.keyInCache;
    this.view.data.id = timer.keyInCache;

    delete cache.Controller['List.SearchTimer'][this.keyInCache];
    delete cache.View['List.SearchTimer'][this.keyInCache];
    delete cache.ViewModel['List.SearchTimer'][this.keyInCache];

    this.keyInCache = timer.keyInCache;
    cache.Controller['List.SearchTimer'][this.keyInCache] = this;

    this.view.keyInCache = timer.keyInCache;
    cache.View['List.SearchTimer'][this.keyInCache] = this.view;

    this.module.getViewModel('List.SearchTimer', {
        "id" : this.data.id,
        "view" : this.view,
        "resource" : this.dataModel.data
    });

    this.removeObserver();
    this.addObserver();

    this.view.update();
};

/**
 * request edit window
 */
Gui.SearchTimer.Controller.List.SearchTimer.prototype.requestWindowAction = function (e) {

    e.preventDefault();

    this.vibrate();

    $.event.trigger({
        "type" : "window.request",
        "payload" : {
            "type" : "SearchTimer",
            "data" : {
                "id" : this.dataModel.data.id,
                "resource": this.dataModel,
                "onsubmit": this.saveAction.bind(this)
            }
        }
    })
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.saveAction = function (fields) {

    var i, v, n = {
        "ext_epg_info": [],
        "compare_categories": 0,
        "id": this.dataModel.data.id
    };

    for (i in this.dataModel.data) {

        if (this.dataModel.data.hasOwnProperty(i)) {
            if (!n.hasOwnProperty(i)) {
                n[i] = this.dataModel.data[i];
            }
        }
    }

    for (i in fields) {
        if (fields.hasOwnProperty(i)) {

            if (i.indexOf('ext_epg_info') == 0) {
                n.ext_epg_info.push(
                    i.replace(/[^0-9]/g, '') + '#' + fields[i].getValue()
                );
            } else if (i.indexOf('compare_categories') == 0) {
                if (fields[i].getValue()) {
                    n.compare_categories = n.compare_categories | fields[i].value;
                }
            } else if (i === 'use_search_in') {
                this.getSearchIn(fields[i], n);
            } else {
                v = fields[i].getValue();

                switch (i) {
                    case "use_content_descriptors":
                        break;

                    case 'use_channel':             //enum
                    case 'mode':                    //enum
                    case 'blacklist_mode':          //enum
                    case 'use_as_searchtimer':      //enum
                    case 'search_timer_action':     //enum
                    case 'compare_subtitle':        //enum
                    case 'compare_time':            //enum
                    case 'del_mode':                //enum
                        n[i] = v.value;
                        break;

                    case 'content_descriptors':
                        if (fields.use_content_descriptors.getValue()) {
                            n[i] = this.getMultiselectAsArray(v).join('');
                        } else {
                            n[i] = "";
                        }
                        break;

                    case 'channel_min':
                    case 'channel_max':
                        if (1 === fields.use_channel.getValue().value) {
                            n[i] = v.value;
                        }
                        break;

                    case 'channels':
                        if (this.getChannels(v, fields) === false) {
                            n['use_channel'] = 0;
                            n[i] = 0;
                        } else {
                            n[i] = this.getChannels(v, fields);
                        }
                        break;

                    case 'start_time':
                    case 'stop_time':
                    case 'duration_min':
                    case 'duration_max':
                        n[i] = parseFloat(v.replace(/[^0-9]/g, '').replace(/^0*/g, ''));
                        if (isNaN(n[i])) n[i] = 0;
                        break;

                    case 'dayofweek':
                        n[i] = this.getDayOfWeek(v);
                        break;

                    case 'blacklist_ids':
                        n[i] = this.getMultiselectAsArray(v);
                        break;

                    case 'use_as_searchtimer_from':
                    case 'use_as_searchtimer_til':
                        v = v.split('.');
                        n[i] = new Date(v[2], parseInt(v[1]) - 1, v[0]).getTime() / 1000;
                        break;

                    default:
                        if ("number" === fields[i].type) {
                            v = isNaN(v) ? 0 : v;
                        }
                        n[i] = v;
                        break;
                }
            }
        }
    }

    this.dataModel.data = n;
    this.dataModel.save();
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.getChannels = function (v, fields) {

    var ret = '', usage = fields.use_channel.getValue().value;

    if (usage == 0 || usage == 3) {
        return 0;
    }

    if (1 === usage) {

        if (!fields.channel_min.values[fields.channel_min.selected]) {
            return false;
        }

        ret += fields.channel_min.values[fields.channel_min.selected].label +
        ' - ' +
        fields.channel_max.values[fields.channel_max.selected].label
    }

    if (2 === usage) {

        v = fields.channels.getValue();
        if (!v.value) {
            return false;
        }
        ret = v.value;
    }

    return ret;
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.getDayOfWeek = function (v) {

    var n = 0, i;

    for (i in v) {
        if (v.hasOwnProperty(i)) {
            n = n | v[i].value;
        }
    }
    return n * -1;
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.getMultiselectAsArray = function (v) {

    var n = [], i;

    if (v instanceof Array) {
        for (i in v) {
            if (v.hasOwnProperty(i)) {
                n.push(v[i].value);
            }
        }
    }
    return n;
};

Gui.SearchTimer.Controller.List.SearchTimer.prototype.getSearchIn = function (field, n) {

    var i;

    for (i in field.values) {
        if (field.values.hasOwnProperty(i)) {
            n[field.values[i].descriptor] = field.values[i].selected;
        }
    }
};