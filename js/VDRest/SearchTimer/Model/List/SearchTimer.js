/**
 * Channels resource
 * @constructor
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
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.useChannel = {
    "NoChannel": 0,
    "Interval": 1,
    "Group": 2,
    "FTAOnly": 3
};

/**
 * @type {Object.<String>}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.searchModes = {
    "Phrase": 0,
    "all Words": 1,
    "one Word": 2,
    "Exact": 3,
    "Regular Expression": 4,
    "Fuzzy": 5
};

/**
 * flags
 * @type {{}}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.flags = {

    "inactive"      :   0x0000,
    "is_active"     :   0x0001,
    "is_instant"    :   0x0002,
    "uses_vps"      :   0x0004

};

/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.cacheKey = 'id';


/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.init = function () {

    if (this.data.id < 0) {
        this.date = {
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
            "channels": "",
            "use_duration": false,
            "duration_min": 0,
            "duration_max": 0,
            "use_dayofweek": false,
            "dayofweek": 0,
            "use_as_searchtimer": 2,
            "use_as_searchtimer_from": 0,
            "use_as_searchtimer_til": 0,
            "search_timer_action": 0,
            "use_series_recording": false,
            "directory": "",
            "del_recs_after_days": 0,
            "keep_recs": 0,
            "pause_on_recs": 0,
            "blacklist_mode": 3,
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
            "summary_match": 94,
            "compare_time": 0
        }
    }
};



/**
 * @type {string}
 */
VDRest.SearchTimer.Model.List.SearchTimer.prototype.save = function () {

    this.module.getResource('List.SearchTimer').addOrUpdateSearchTimer(this.data);
};
