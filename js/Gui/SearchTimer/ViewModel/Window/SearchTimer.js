/**
 * @class
 * @constructor
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype = new Gui.SearchTimer.ViewModel.List.SearchTimer();

/**
 * @type {string}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {string}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.weekDays = {

    "sunday": 0x0001,
    "monday": 0x0002,
    "tuesday": 0x0004,
    "wednesday": 0x0008,
    "thursday": 0x0010,
    "friday": 0x0020,
    "saturday": 0x0040
};

/**
 * add magic methods
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.initViewMethods = function () {

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getSearchFormData = this.getSearchFormData.bind(this);
};

/**
 * retrieve search form configuration
 * @typedef {{}} searchTimerFormConfig
 * @property {searchTimerFormCategories} categories
 * @property {searchTimerFormFields} fields
 * @return {searchTimerFormConfig}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchFormData = function () {

    return {
        "categories": this.getSearchFormCategories(),
        "fields": this.getSearchFormFields()
    };
};

/**
 * retrieve search form categories
 * @typedef {{}} searchTimerFormCategories
 * @property {{search: String}} search
 * @property {{timer: String}} timer
 * @return {searchTimerFormCategories}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchFormCategories = function () {

    return {
        "search": {"label": 'Search'},
        "parameter": {"label": 'Parameter'},
        "searchtimer": {"label": 'Searchtimer'},
        "repeats": {"label": 'Repeats'},
        "timer": {"label": 'Timer'}
    };
};

/**
 * @typedef {{}} searchTimerFormFields
 * @property {searchTimerCommonField} search
 * @property {searchTimerCommonField} mode
 * @property {searchTimerCommonField} tolerance
 * @property {searchTimerCommonField} match_case
 * @property {searchTimerCommonField} use_search_in
 * @property {searchTimerCommonField} use_ext_epg_info
 * @property {searchTimerCommonField} use_channel
 * @property {searchTimerCommonField} channel_min
 * @property {searchTimerCommonField} channel_max
 * @property {searchTimerCommonField} channels
 * @property {searchTimerCommonField} use_time
 * @property {searchTimerCommonField} start_time
 * @property {searchTimerCommonField} stop_time
 * @property {searchTimerCommonField} use_duration
 * @property {searchTimerCommonField} duration_min
 * @property {searchTimerCommonField} duration_max
 * @property {searchTimerCommonField} use_dayofweek
 * @property {searchTimerCommonField} dayofweek
 * @property {searchTimerCommonField} blacklist_mode
 * @property {searchTimerCommonField} blacklist_ids
 * @property {searchTimerCommonField} use_in_favorites
 * @property {searchTimerCommonField} use_as_searchtimer
 * @property {searchTimerCommonField} use_as_searchtimer_from
 * @property {searchTimerCommonField} use_as_searchtimer_til
 * @property {searchTimerCommonField} searchtimer_action
 * @property {searchTimerCommonField} switch_min_before
 * @property {searchTimerCommonField} unmute_sound_on_switch
 * @property {searchTimerCommonField} use_series_recording
 * @property {searchTimerCommonField} directory
 * @property {searchTimerCommonField} del_recs_after_days
 * @property {searchTimerCommonField} keep_recs
 * @property {searchTimerCommonField} pause_on_recs
 * @property {searchTimerCommonField} avoid_repeats
 * @property {searchTimerCommonField} allowed_repeats
 * @property {searchTimerCommonField} repeats_within_days
 * @property {searchTimerCommonField} compare_title
 * @property {searchTimerCommonField} compare_subtitle
 * @property {searchTimerCommonField} compare_summary
 * @property {searchTimerCommonField} summary_match
 * @property {searchTimerCommonField} compare_time
 * @property {searchTimerCommonField} compare_categories
 * @property {searchTimerCommonField} priority
 * @property {searchTimerCommonField} lifetime
 * @property {searchTimerCommonField} margin_start
 * @property {searchTimerCommonField} margin_stop
 * @property {searchTimerCommonField} use_vps
 * @property {searchTimerCommonField} del_mode
 * @property {searchTimerCommonField} del_after_count_recs
 * @property {searchTimerCommonField} del_after_days_of_first_rec
 * @return {searchTimerFormFields}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchFormFields = function () {

    this.searchFormFields = {};


    this.searchFormFields.search = this.getStringField(
        "search", "Query", this.data.resource.data.search
    );
    this.searchFormFields.mode = this.getEnumField(
        "search", 'Mode', this.getSearchModeValues()
    );
    this.searchFormFields.tolerance = this.getNumberField(
        "search", 'Tolerance', this.data.resource.data.tolerance, {"mode": 5}
    );
    this.searchFormFields.match_case = this.getBooleanField(
        "parameter", 'Match case', this.data.resource.data.match_case
    );
    this.searchFormFields.use_search_in = this.getEnumField(
        "parameter", 'Search in', this.getSearchInValues(), undefined, true
    );

    // cannot delete hence disabled
    //this.searchFormFields.use_content_descriptors = this.getBooleanField(
    //    "parameter", 'Use content descriptors', (this.data.resource.data.content_descriptors !== '')
    //);
    //this.searchFormFields.content_descriptors = this.getEnumField(
    //    "parameter", 'Content descriptors', this.getContentDescriptorValues(), "use_content_descriptors", true
    //);

    this.searchFormFields.use_ext_epg_info = this.getBooleanField(
        "parameter", 'Use Extended EPG Info', this.data.resource.data.use_ext_epg_info
    );
    this.getExtEpgInfoFields();
    this.searchFormFields.ignore_missing_epg_cats = this.getBooleanField(
        "parameter", 'Ignore missing categories', this.data.resource.data.ignore_missing_epg_cats, 'use_ext_epg_info'
    );
    this.searchFormFields.use_channel = this.getEnumField(
        "parameter", 'Use Channel', this.getUseChannelValues()
    );
    this.searchFormFields.channel_min = this.getChannelMinField();
    this.searchFormFields.channel_max = this.getChannelMaxField();
    this.searchFormFields.channels = this.getEnumField(
        "parameter", 'Channel Group', this.getChannelGroupFieldValues(), {"use_channel": 2}
    );
    this.searchFormFields.use_time = this.getBooleanField(
        "parameter", 'Use Time', this.data.resource.data.use_time
    );
    this.searchFormFields.start_time = this.getStartTimeField();
    this.searchFormFields.stop_time = this.getStopTimeField();
    this.searchFormFields.use_duration = this.getBooleanField(
        "parameter", 'Use duration', this.data.resource.data.use_duration
    );

    this.searchFormFields.duration_min = this.getMinDurationField();
    this.searchFormFields.duration_max = this.getMaxDurationField();

    this.searchFormFields.use_dayofweek = this.getBooleanField(
        "parameter", 'Use day of week', this.data.resource.data.use_dayofweek
    );
    this.searchFormFields.dayofweek = this.getDayOfWeekField();
    this.searchFormFields.blacklist_mode = this.getBlacklistModeField();
    this.searchFormFields.blacklist_ids = this.getBlacklistSelectorField();
    // not available in OSD Edit Menu
    //this.searchFormFields.use_in_favorites = this.getUseInFavoritesField();

    /**
     * searchtimer
     */
    this.searchFormFields.use_as_searchtimer = this.getUseAsSearchTimerField();
    this.searchFormFields.use_as_searchtimer_from = this.getSearchTimerFromField();
    this.searchFormFields.use_as_searchtimer_til = this.getSearchTimerTilField();
    this.searchFormFields.search_timer_action = this.getSearchTimerActionField();
    this.searchFormFields.switch_min_before = this.getSwitchMinBeforeField();


    this.searchFormFields.unmute_sound_on_switch = this.getBooleanField(
        "searchtimer", "Unmute Sound", this.data.resource.data.unmute_sound_on_switch, {
            "use_as_searchtimer": [1, 2], "search_timer_action": [2, 3]
        }
    );

    this.searchFormFields.use_series_recording = this.getUseSeriesRecordingField();
    this.searchFormFields.directory = this.getDirectoryField();
    this.searchFormFields.del_recs_after_days = this.getDelRecsAfterDaysField();
    this.searchFormFields.keep_recs = this.getKeepRecsField();
    this.searchFormFields.pause_on_recs = this.getPauseOnRecsField();

    /**
     * repeats
     */
    this.searchFormFields.avoid_repeats = this.getBooleanField(
        "repeats", "Avoid repeats", this.data.resource.data.avoid_repeats, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.allowed_repeats = this.getNumberField(
        "repeats", "Allowed repeats", this.data.resource.data.allowed_repeats, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0,
            "avoid_repeats": true
        }
    );
    this.searchFormFields.repeats_within_days = this.getNumberField(
        "repeats", "Repeats withing &hellip; days only", this.data.resource.data.repeats_within_days, {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.compare_title = this.getBooleanField(
        "repeats", "Compare title", this.data.resource.data.compare_title, {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.compare_subtitle = this.getEnumField(
        "repeats", "Compare subtitle", this.getCompareSubtitleValues(), {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.compare_summary = this.getBooleanField(
        "repeats", "Compare summary", this.data.resource.data.compare_summary, {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.summary_match = this.getNumberField(
        "repeats", "Min. summary match in %%", this.data.resource.data.summary_match, {
            "avoid_repeats": true,
            "compare_summary": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.compare_time = this.getEnumField(
        "repeats", "Compare time", this.getCompareTimeValues(), {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.getCompareCategoriesField();


    /**
     * Timer
     */
    this.searchFormFields.priority = this.getNumberField(
        "timer", "Priority", this.data.resource.data.priority, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.lifetime = this.getNumberField(
        "timer", "Lifetime", this.data.resource.data.lifetime, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.margin_start = this.getNumberField(
        "timer", "Margin start", this.data.resource.data.margin_start, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.margin_stop = this.getNumberField(
        "timer", "Margin stop", this.data.resource.data.margin_stop, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.use_vps = this.getBooleanField(
        "timer", "Use VPS", this.data.resource.data.use_vps, {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.del_mode = this.getEnumField(
        "timer", "Auto delete searchtimer", this.getDelModeValues(), {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.del_after_count_recs = this.getNumberField(
        "timer", "after &hellip; recordings", this.data.resource.data.del_after_count_recs, {
            "del_mode": 1,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );
    this.searchFormFields.del_after_days_of_first_rec = this.getNumberField(
        "timer", "after &hellip; days after first recording",
        this.data.resource.data.del_after_days_of_first_rec, {
            "del_mode": 2,
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        }
    );



    return this.searchFormFields;
};

/**
 * @typedef {{}} searchTimerCommonField
 * @property {String} category
 * @property {String} type
 * @property {String} label
 * @property {String|undefined} info
 * @property {String|undefined} depends
 */

/**
 * @param {String} category
 * @param {String} label
 * @param {Boolean} checked
 * @param {*} [depends]
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getBooleanField = function (category, label, checked, depends) {

    var field = {
        "category": category,
        "type": "boolean",
        "label": label,
        "checked": checked
    };

    if ("undefined" !== typeof depends) {
        field.depends = depends;
    }

    return field;
};

/**
 * @param {String} category
 * @param {String} label
 * @param {String} value
 * @param {*} [depends]
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getStringField = function (category, label, value, depends) {

    var field = {
        "category": category,
        "type": "string",
        "label": label,
        "value": value
    };

    if ("undefined" !== typeof depends) {
        field.depends = depends;
    }

    return field;
};

/**
 * @param {String} category
 * @param {String} label
 * @param {Number} value
 * @param {*} [depends]
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getNumberField = function (category, label, value, depends) {

    var field = {
        "category": category,
        "type": "number",
        "label": label,
        "value": isNaN(value) ? 0 : value
    };

    if ("undefined" !== typeof depends) {
        field.depends = depends;
    }

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getEnumField = function (category, label, values, depends, multiselect) {

    var field = {
        "category": category,
        "type": "enum",
        "label": label,
        "values": values
    };

    if ("undefined" !== typeof depends) {
        field.depends = depends;
    }

    if ("undefined" !== typeof multiselect) {
        field.multiselect = true;
    }

    return field;
};

/**
 * retrieve search mode configuration
 *
 * @typedef {{}} searchTimerSearchMode
 * @property {string} label
 * @property {number} value
 *
 * @return {Object.<searchTimerSearchMode>}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchModeValues = function () {

    return {
        "phrase": {
            "label": 'Phrase',
            "value": 0,
            "selected": this.data.resource.data.mode === 0
        },
        "and": {
            "label": 'AND',
            "value": 1,
            "selected": this.data.resource.data.mode === 1
        },
        "or": {
            "label": 'OR',
            "value": 2,
            "selected": this.data.resource.data.mode === 2
        },
        "exact": {
            "label": 'Exact',
            "value": 3,
            "selected": this.data.resource.data.mode === 3
        },
        "regex": {
            "label": 'RegEx',
            "value": 4,
            "selected": this.data.resource.data.mode === 4
        },
        "fuzzy": {
            "label": 'Fuzzy',
            "value": 5,
            "selected": this.data.resource.data.mode === 5
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchInValues = function () {

    return {
        "use_title": {
            "label": 'Title',
            "value": true,
            "selected": this.data.resource.data.use_title,
            "descriptor": 'use_title'
        },
        "use_subtitle": {
            "label": 'Subtitle',
            "value": true,
            "selected": this.data.resource.data.use_subtitle,
            "descriptor": 'use_subtitle'
        },
        "use_description": {
            "label": 'Description',
            "value": true,
            "selected": this.data.resource.data.use_description,
            "descriptor": 'use_description'
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getExtEpgInfoFields = function () {

    var e = this.data.resource.data.ext_epg_info,
        collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('ExtEPGInfoList').getCollection(),
        selected = {};


    e.forEach(function (sel) {

        sel = sel.split('#');
        selected[sel[0]] = sel[1];
    }.bind(this));

    collection.forEach(function (def) {

        if (0 === def.data.values.length) {
            this.searchFormFields['ext_epg_info_' + def.data.id] = this.getStringField(
                'parameter', def.data.name, selected[def.data.id], "use_ext_epg_info"
            );
        } else {
            this.searchFormFields['ext_epg_info_' + def.data.id] = this.getExtEpgInfoComboField(
                def,
                selected[def.data.id] || '',
                def.data.values
            );
        }


    }.bind(this));


};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getExtEpgInfoComboField = function (def, value, values) {

    var field = {
        "category": "parameter",
        "type": "combobox",
        "label": def.data.name,
        "depends": "use_ext_epg_info",
        "multiselect": true,
        "text_input_seperator": ', ',
        "text_value": value
    }, selected = value.split(', ');

    field.values = {};

    values.forEach(function (value) {

        field.values[value] = {
            "label": value,
            "value": value,
            "selected": selected.indexOf(value) > -1,
            "translate": false
        }

    }.bind(this));

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getStartTimeField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": "Broadcast start after",
        "format": "%H:%i",
        "depends": "use_time",
        "value": VDRest.helper.pad(this.data.resource.data.start_time, 4),
        "form_order": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getStopTimeField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": "Broadcast start before",
        "format": "%H:%i",
        "depends": "use_time",
        "value": VDRest.helper.pad(this.data.resource.data.stop_time, 4),
        "form_order": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getMinDurationField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": "Min duration",
        "format": "%H:%i",
        "depends": "use_duration",
        "value": VDRest.helper.pad(this.data.resource.data.duration_min, 4),
        "form_order": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getMaxDurationField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": "Max duration",
        "format": "%H:%i",
        "depends": "use_duration",
        "value": VDRest.helper.pad(this.data.resource.data.duration_max, 4),
        "form_order": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getUseChannelValues = function () {

    return {
        "no": {
            "label": 'No',
            "value": 0,
            "selected": this.data.resource.data.use_channel === 0
        },
        "range": {
            "label": 'Range',
            "value": 1,
            "selected": this.data.resource.data.use_channel === 1
        },
        "channelgroup": {
            "label": 'Channel Group',
            "value": 2,
            "selected": this.data.resource.data.use_channel === 2
        },
        "ftaonly": {
            "label": 'Free to air only',
            "value": 3,
            "selected": this.data.resource.data.use_channel === 3
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getChannelMinField = function () {

    return {
        "category": "parameter",
        "type": "channel",
        "label": 'From Channel',
        "depends": {"use_channel": 1},
        "selected": this.data.resource.data.channel_min,
        "onchange": function () {
            this.searchFormFields.channel_max.getValuesAfter();
        }.bind(this)
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getChannelMaxField = function () {

    return {
        "category": "parameter",
        "type": "channel",
        "label": 'To Channel',
        "depends": {"use_channel": 1},
        "selected": this.data.resource.data.channel_max,
        "className": "searchtimer",
        "getValuesAfter": function () {
            var i,
                maxValues = this.searchFormFields.channel_max.values,
                minSelected = this.searchFormFields.channel_min.selected,
                maxSelected = this.searchFormFields.channel_max.selected,
                hasMinSelected = false,
                hasMaxSelected = false;

            for (i in maxValues) {

                if (maxValues.hasOwnProperty(i)) {

                    maxValues[i].disabled = false;
                    if (maxSelected === i) {
                        hasMaxSelected = true;
                    }
                    if (minSelected === i) {
                        hasMinSelected = true;
                    }
                }
            }

            if (hasMaxSelected && maxValues[minSelected].index > maxValues[maxSelected].index) {
                hasMaxSelected = false;
                maxValues[maxSelected].selected = false;
            }

            for (i in maxValues) {

                if (maxValues.hasOwnProperty(i)) {
                    if (i === minSelected) {
                        break;
                    } else {
                        maxValues[i].disabled = true;
                    }
                }
            }
            if (!hasMaxSelected && hasMinSelected) {
                this.searchFormFields.channel_max.selected = minSelected;
                this.searchFormFields.channel_max.values[minSelected].selected = true;
            }

            if (this.searchFormFields.channel_max.gui) {
                this.searchFormFields.channel_max.gui.val(this.searchFormFields.channel_max.getValue().label);
            }

        }.bind(this)
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getDayOfWeekField = function () {

    return {
        "category": "parameter",
        "type": "enum",
        "multiselect": true,
        "bitmask": true,
        "label": 'Day of week',
        "values": {
            "monday": {
                "label": 'Monday',
                "value": this.weekDays.monday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.monday
            },
            "tuesday": {
                "label": 'Tuesday',
                "value": this.weekDays.tuesday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.tuesday
            },
            "wednesday": {
                "label": 'Wednesday',
                "value": this.weekDays.wednesday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.wednesday
            },
            "thursday": {
                "label": 'Thursday',
                "value": this.weekDays.thursday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.thursday
            },
            "friday": {
                "label": 'Friday',
                "value": this.weekDays.friday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.friday
            },
            "saturday": {
                "label": 'Saturday',
                "value": this.weekDays.saturday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.saturday
            },
            "sunday": {
                "label": 'Sunday',
                "value": this.weekDays.sunday,
                "selected": Math.abs(this.data.resource.data.dayofweek) & this.weekDays.sunday
            }
        },
        "depends": "use_dayofweek"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getBlacklistModeField = function () {

    return {
        "category": "parameter",
        "type": "enum",
        "label": 'Use blacklists',
        "values": {
            "global_only": {
                "label": 'Global only',
                "value": 0,
                "selected": this.data.resource.data.blacklist_mode === 0
            },
            "selection": {
                "label": 'Selection',
                "value": 1,
                "selected": this.data.resource.data.blacklist_mode === 1
            },
            "all": {
                "label": 'All',
                "value": 2,
                "selected": this.data.resource.data.blacklist_mode === 2
            },
            "none": {
                "label": 'None',
                "value": 3,
                "selected": this.data.resource.data.blacklist_mode === 3
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getBlacklistSelectorField = function () {

    var collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('Blacklists').getCollection(),
        blacklists = {};

    collection.forEach(function (b) {
        var search = b.getData('search'),
            id = b.getData('id');
        blacklists[search] = {
            "label": search,
            "value": id,
            "selected": this.data.resource.data.blacklist_ids.indexOf(id) > -1,
            "translate": false
        }
    }.bind(this));

    return {
        "category": "parameter",
        "type": "enum",
        "multiselect": true,
        "label": 'Blacklists',
        "depends": {"blacklist_mode": 1},
        "values": blacklists
    }
};
/**
 * not available in osd edit menu
 * @return {searchTimerCommonField}
 */
//Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getUseInFavoritesField = function () {
//
//    return {
//        "category": "parameter",
//        "type": "boolean",
//        "label": 'Use in Favorites',
//        "checked": this.data.resource.data.use_in_favorites
//    }
//};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getUseAsSearchTimerField = function () {

    return {
        "category": "searchtimer",
        "type": "enum",
        "label": 'Use as Searchtimer',
        "values": {
            "yes": {
                "label": 'Yes',
                "value": 1,
                "selected": this.data.resource.data.use_as_searchtimer === 1
            },
            "no": {
                "label": 'No',
                "value": 0,
                "selected": this.data.resource.data.use_as_searchtimer === 0
            },
            "user_defined": {
                "label": 'User defined',
                "value": 2,
                "selected": this.data.resource.data.use_as_searchtimer === 2
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchTimerFromField = function () {

    return {
        "category": "searchtimer",
        "type": "datetime",
        "label": "From date",
        "format": "%d.%m.%Y",
        "depends": {"use_as_searchtimer": 2},
        "value": function () {

            var d;

            if (0 === this.data.resource.data.use_as_searchtimer_from) {
                return '';
            }

            d = new Date(this.data.resource.data.use_as_searchtimer_from * 1000);

            return d.getFullYear().toString() +
                VDRest.helper.pad(d.getMonth() + 1, 2) +
                VDRest.helper.pad(d.getDate(), 2)
        }.bind(this)(),
        "form_order": "Ymd"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchTimerTilField = function () {

    return {
        "category": "searchtimer",
        "type": "datetime",
        "label": "Until date",
        "format": "%d.%m.%Y",
        "depends": {"use_as_searchtimer": 2},
        "value": function () {

            var d;

            if (0 === this.data.resource.data.use_as_searchtimer_til) {
                return '';
            }
            d = new Date(this.data.resource.data.use_as_searchtimer_til * 1000);

            return d.getFullYear().toString() +
                VDRest.helper.pad(d.getMonth() + 1, 2) +
                VDRest.helper.pad(d.getDate(), 2)
        }.bind(this)(),
        "form_order": "Ymd"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSearchTimerActionField = function () {

    return {
        "category": "searchtimer",
        "type": "enum",
        "label": 'Action',
        "depends": {"use_as_searchtimer": [1, 2]},
        "values": {
            "record": {
                "label": 'Record',
                "value": 0,
                "selected": this.data.resource.data.search_timer_action === 0
            },
            "announce": {
                "label": 'Announce',
                "value": 1,
                "selected": this.data.resource.data.search_timer_action === 1
            },
            "switch": {
                "label": 'Switch',
                "value": 2,
                "selected": this.data.resource.data.search_timer_action === 2
            },
            "announce_switch": {
                "label": 'Announce and Switch',
                "value": 3,
                "selected": this.data.resource.data.search_timer_action === 3
            },
            "announce_by_mail": {
                "label": 'Announce by mail',
                "value": 4,
                "selected": this.data.resource.data.search_timer_action === 4
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getSwitchMinBeforeField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": 'minutes before switch',
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": [2, 3]
        },
        "value": this.data.resource.data.switch_min_before
    }
};
/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getUseSeriesRecordingField = function () {

    return {
        "category": "searchtimer",
        "type": "boolean",
        "label": 'Is series recording',
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        },
        "checked": this.data.resource.data.use_series_recording
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getDirectoryField = function () {

    var field = {
            "category": "searchtimer",
            "type": "combobox",
            "label": 'Directory',
            "depends": {
                "use_as_searchtimer": [1, 2],
                "search_timer_action": 0
            },
            "text_input_seperator": ', ',
            "text_value": this.data.resource.data.directory
        },
        directories = VDRest.app.getModule('VDRest.SearchTimer').getModel('RecordingDirs').getCollection();

    field.values = {};

    directories.forEach(function (value) {

        field.values[value.data] = {
            "label": value.data,
            "value": value.data,
            "selected": value.data == this.data.resource.data.directory,
            "translate": false
        }

    }.bind(this));

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getDelRecsAfterDaysField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": 'Delete after &hellip; days',
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        },
        "value": this.data.resource.data.del_recs_after_days
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getKeepRecsField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": 'Keep &hellip; recordings',
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        },
        "value": this.data.resource.data.keep_recs
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getPauseOnRecsField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": 'Pause after &hellip; recordings',
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 0
        },
        "value": this.data.resource.data.pause_on_recs
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getCompareSubtitleValues = function () {

    return {
        "no": {
            "label": 'No',
            "value": 0,
            "selected": this.data.resource.data.compare_subtitle == 0
        },
        "exists": {
            "label": 'If exists',
            "value": 1,
            "selected": this.data.resource.data.compare_subtitle == 1
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getCompareTimeValues = function () {

    return {
        "no": {
            "label": 'No',
            "value": 0,
            "selected": this.data.resource.data.compare_time == 0
        },
        "day": {
            "label": 'Same Day',
            "value": 1,
            "selected": this.data.resource.data.compare_time == 1
        },
        "week": {
            "label": 'Same Week',
            "value": 2,
            "selected": this.data.resource.data.compare_time == 2
        },
        "month": {
            "label": 'Same Month',
            "value": 3,
            "selected": this.data.resource.data.compare_time == 3
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getDelModeValues = function () {

    return {
        "no": {
            "label": 'No',
            "value": 0,
            "selected": this.data.resource.data.del_mode == 0
        },
        "recordings_count": {
            "label": 'Recordings count',
            "value": 1,
            "selected": this.data.resource.data.del_mode == 1
        },
        "days_count": {
            "label": 'Days count',
            "value": 2,
            "selected": this.data.resource.data.del_mode == 2
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getCompareCategoriesField = function () {

    var collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('ExtEPGInfoList').getCollection(),
        value = 1;

    collection.forEach(function (item) {

        this.searchFormFields['compare_categories_' + item.data.id.toString()] = {
            "category": "repeats",
            "type": "boolean",
            "label": VDRest.app.translate('Compare %s', item.data.name),
            "checked": (Math.abs(this.data.resource.data.compare_categories) & value) > 0,
            "depends": {
                "avoid_repeats": true,
                "use_as_searchtimer": [1, 2],
                "search_timer_action": 0
            },
            "value": value
        };

        value *= 2;
    }.bind(this));
};

/**
 * @typedef {{data:{name:string,id:string,is_group:boolean}}} descr
 * @return {{}}
 */
//Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getContentDescriptorValues = function () {
//
//    var collection = VDRest.app.getModule('VDRest.Epg').getModel('ContentDescriptors').getCollection(),
//        values = {}, selection = this.data.resource.data.content_descriptors.match(/.{1,2}/g) || [];
//
//    collection.forEach(function (descr) {
//
//        values[descr.data.id] = {
//            "label": descr.data.name,
//            "value": descr.data.id,
//            "selected": selection.indexOf(descr.data.id) > -1,
//            "translate" : false
//        };
//        if (!descr.data.is_group) {
//            values[descr.data.id].className = "indent";
//        }
//
//    }.bind(this));
//
//    return values;
//};

/**
 * retrieve channelgroups
 * @return {Gui.SearchTimer.Controller.List.channelgroups}
 */
Gui.SearchTimer.ViewModel.Window.SearchTimer.prototype.getChannelGroupFieldValues = function () {

    /**
     * @type {Gui.SearchTimer.Controller.List.channelgroups}
     */
    var cGroups = VDRest.app.getModule('Gui.SearchTimer').getController('List').channelgroups, i;

    for (i in cGroups) {
        if (cGroups.hasOwnProperty(i)) {
            cGroups[i].value = i;
            cGroups[i].selected = i === this.data.resource.data.channels;
            cGroups[i].translate = false;
        }
    }

    return cGroups;
};
