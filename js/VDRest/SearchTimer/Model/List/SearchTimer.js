/**
 * Channels resource
 * @constructor
 * @property {{}} data
 */
VDRest.SearchTimer.Model.List.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.Model}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype = new VDRest.Abstract.Model();

/**
 * class name
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype._class = 'VDRest.SearchTimer.Model.List.SearchTimer';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.resultJSON = 'searchtimers';

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.cacheKey = 'id';

/**
 * initialize
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.init = function () {

    if (this.data.id < 0) {
        this.data = this.getInitData();
    }
};

/**
 * load data from template
 * @param {string} template
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.loadTemplate = function (template) {

    var ts = this.module.getModel('Templates');

    if (ts.hasData(template)) {
        this.data = ts.getTemplate(template);
    }
};



/**
 * save searchTimer
 * @param {{}} fields
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.save = function (fields) {

    this.newData = this.copyFromForm(fields);

    // fail
    //this.newData.use_channel = 1;
    //this.newData.channel_min = '';
    //this.newData.channel_max = '';

    $window.one('vdrest-api-actions.SearchTimer-created', this.handleCreate.bind(this));
    $window.one('vdrest-api-actions.SearchTimer-updated', this.handleUpdate.bind(this));

    this.module.getResource('List.SearchTimer').addOrUpdateSearchTimer(this.newData);
};

/**
 * delete searchTimer
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.deleteSearchTimer = function () {

    $window.one('vdrest-api-actions.SearchTimer-deleted', this.handleDelete.bind(this));

    this.module.getResource('List.SearchTimer').deleteSearchTimer(this.data);
};

/**
 * perform search
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.performSearch = function () {

    $window.one('vdrest-api-actions.SearchTimer-test', this.handleSearchResult.bind(this));

    this.module.getResource('List.SearchTimer').performSearch(this);
};

/**
 * toggle active state
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.toggleActive = function () {

    this.newData = this.data;
    this.newData.use_as_searchtimer = this.data.use_as_searchtimer == 0 ? 1 : 0;

    $window.one('vdrest-api-actions.SearchTimer-updated', this.handleUpdate.bind(this));

    this.module.getResource('List.SearchTimer').addOrUpdateSearchTimer(this.newData);
};

/**
 * handle create new searchTimer
 * @param {{payload:{}}} e
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.handleCreate = function (e) {

    delete this.module.cache.store.Model['List.SearchTimer'][this.data.id];
    this.data = this.newData;
    delete this.newData;
    this.data.id = e.payload.id;
    this.keyInCache = this.data.id;
    this.module.cache.store.Model['List.SearchTimer'][this.keyInCache] = this;
    this.module.getModel('List').collection.push(this);

    $.event.trigger({
        "type": "gui-searchtimer.created",
        "payload": this
    });

    $window.off('vdrest-api-actions.SearchTimer-updated');
};

/**
 * handle update of searchTimer
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.handleUpdate = function () {

    this.data = this.newData;
    delete this.newData;

    $.event.trigger({
        "type": "gui-searchtimer.updated." + this.keyInCache,
        "payload": this
    });

    $window.off('vdrest-api-actions.SearchTimer-created');
};

/**
 * handle delete of searchTimer
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.handleDelete = function () {

    var collection = this.module.getModel('List').collection;
    delete this.module.cache.store.Model['List.SearchTimer'][this.data.id];
    collection.splice(collection.indexOf(this), 1);

    $.event.trigger({
        "type": "gui-searchtimer.deleted",
        "payload": this.keyInCache
    });

    delete this;
};

/**
 * handle searchResult
 * @param {{payload:{}}} e
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.handleSearchResult = function (e) {

    var model = VDRest.app.getModule('VDRest.Epg').getModel('Search');

    model.setIsSearchTimer().flushCollection();
    model.processCollection(e.payload);
    model.unsetIsSearchTimer()
};

/**
 * copy data from form into structure
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.copyFromForm = function (fields) {

    var i, v, n = {
        "ext_epg_info": [],
        "compare_categories": 0,
        "id": this.data.id
    };

    for (i in this.data) {

        if (this.data.hasOwnProperty(i)) {
            if (!n.hasOwnProperty(i)) {
                n[i] = this.data[i];
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
                            n[i] = VDRest.app.translate('all');
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

                    case 'dateLimit':
                        n[i] = v.plusDays;
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

    return n
};

/**
 * fetch channels from form
 * @param {{}} v
 * @param {{}} fields
 * @return {string|boolean}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.getChannels = function (v, fields) {

    var ret = '', usage = fields.use_channel.getValue().value;

    if (usage == 0 || usage == 3) {
        return VDRest.app.translate('all');
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

/**
 * compute day of week value
 * @param {{}} v
 * @return {number}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.getDayOfWeek = function (v) {

    var n = 0, i;

    for (i in v) {
        if (v.hasOwnProperty(i)) {
            n = n | v[i].value;
        }
    }
    return n * -1;
};

/**
 * copy multiselects into array
 * @param v
 * @return {Array}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.getMultiselectAsArray = function (v) {

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

/**
 * get search in
 * @param {{values:Object}} field
 * @param {{}} n
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.getSearchIn = function (field, n) {

    var i;

    for (i in field.values) {
        if (field.values.hasOwnProperty(i)) {
            n[field.values[i].descriptor] = field.values[i].selected;
        }
    }
};


/**
 * @typedef {{}} searchTimerData
 * @property {number} id
 * @property {string} search
 * @property {number} mode
 * @property {number} tolerance
 * @property {boolean} match_case
 * @property {boolean} use_title
 * @property {boolean} use_subtitle
 * @property {boolean} use_description
 * @property {string} content_descriptors
 * @property {boolean} use_ext_epg_info
 * @property {Array.<string>} ext_epg_info
 * @property {boolean} use_in_favorites
 * @property {boolean} use_time
 * @property {number} start_time
 * @property {number} stop_time
 * @property {number} use_channel
 * @property {string} channel_min
 * @property {string} channel_max
 * @property {string} channels
 * @property {boolean} use_duration
 * @property {number} duration_min
 * @property {number} duration_max
 * @property {boolean} use_dayofweek
 * @property {number} dayofweek
 * @property {number} use_as_searchtimer
 * @property {number} use_as_searchtimer_from
 * @property {number} use_as_searchtimer_til
 * @property {number} searchtimer_action
 * @property {boolean} use_series_recording
 * @property {string} directory
 * @property {number} del_recs_after_days
 * @property {number} keep_recs
 * @property {number} pause_on_recs
 * @property {number} blacklist_mode
 * @property {Array.<number>} blacklist_ids
 * @property {number} switch_min_before
 * @property {boolean} avoid_repeats
 * @property {number} allowed_repeats
 * @property {number} repeats_within_days
 * @property {boolean} compare_title
 * @property {number} compare_subtitle
 * @property {boolean} compare_summary
 * @property {number} compare_categories
 * @property {number} priority
 * @property {number} lifetime
 * @property {number} margin_start
 * @property {number} margin_stop
 * @property {boolean} use_vps
 * @property {number} del_mode
 * @property {number} del_after_count_recs
 * @property {number} del_after_days_of_first_rec
 * @property {boolean} ignore_missing_epg_cats
 * @property {boolean} unmute_sound_on_switch
 * @property {number} summary_match
 * @property {number} compare_time
 */

/**
 * @returns searchTimerData
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.getInitData = function () {

    return {
        "id": -1,
        "search": "",
        "mode": 0,
        "tolerance": 1,
        "match_case": false,
        "use_title": true,
        "use_subtitle": true,
        "use_description": true,
        "content_descriptors": "",
        "use_ext_epg_info": false,
        "ext_epg_info": [],
        "use_in_favorites": false,
        "use_time": false,
        "start_time": 0,
        "stop_time": 0,
        "use_channel": 0,
        "channel_min": "-0-0-0",
        "channel_max": "-0-0-0",
        "channels": VDRest.app.translate('all'),
        "use_duration": false,
        "duration_min": 0,
        "duration_max": 0,
        "use_dayofweek": false,
        "dayofweek": 0,
        "use_as_searchtimer": 0,
        "use_as_searchtimer_from": 0,
        "use_as_searchtimer_til": 0,
        "search_timer_action": 0,
        "use_series_recording": false,
        "directory": "",
        "del_recs_after_days": 0,
        "keep_recs": 0,
        "pause_on_recs": 0,
        "blacklist_mode": 0,
        "blacklist_ids": [],
        "switch_min_before": 0,
        "avoid_repeats": false,
        "allowed_repeats": 0,
        "repeats_within_days": 0,
        "compare_title": true,
        "compare_subtitle": 1,
        "compare_summary": true,
        "compare_categories": 0,
        "priority": 50,
        "lifetime": 99,
        "margin_start": 2,
        "margin_stop": 10,
        "use_vps": false,
        "del_mode": 0,
        "del_after_count_recs": 0,
        "del_after_days_of_first_rec": 0,
        "ignore_missing_epg_cats": false,
        "unmute_sound_on_switch": false,
        "summary_match": 90,
        "compare_time": 0
    };
};
