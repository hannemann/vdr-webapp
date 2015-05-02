/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.SearchTimer = function () {};

/**
 * @type {VDRest.Abstract.ViewModel}
 */
Gui.Window.ViewModel.SearchTimer.prototype = new Gui.SearchTimer.ViewModel.List.SearchTimer();

/**
 * @type {string}
 */
Gui.Window.ViewModel.SearchTimer.prototype.cacheKey = 'id';

/**
 * @type {string}
 */
Gui.Window.ViewModel.SearchTimer.prototype.weekDays = {

    "sunday": 0x0001,
    "monday": 0x0002,
    "tuesday": 0x0004,
    "wednesday": 0x0008,
    "thursday": 0x0010,
    "friday": 0x0020,
    "saturday": 0x0040
};

/**
 * initialize resources
 */
Gui.Window.ViewModel.SearchTimer.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};

/**
 * add magic methods
 */
Gui.Window.ViewModel.SearchTimer.prototype.initViewMethods = function () {

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
Gui.Window.ViewModel.SearchTimer.prototype.getSearchFormData = function () {

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
Gui.Window.ViewModel.SearchTimer.prototype.getSearchFormCategories = function () {

    return {
        "search": {"label": VDRest.app.translate('Search')},
        "parameter": {"label": VDRest.app.translate('Parameter')},
        "searchtimer": {"label": VDRest.app.translate('Searchtimer')},
        "repeats": {"label": VDRest.app.translate('Repeats')},
        "timer": {"label": VDRest.app.translate('Timer')}
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
 * @return {searchTimerFormFields}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchFormFields = function () {

    this.searchFormFields = {};


    this.searchFormFields.search = this.getStringField(
        "search", "Query", this.resource.search
    );
    this.searchFormFields.mode = this.getEnumField(
        "search", 'Mode', this.getSearchModeValues()
    );
    this.searchFormFields.tolerance = this.getNumberField(
        "search", 'Tolerance', this.resource.tolerance, {"mode": 5}
    );
    this.searchFormFields.match_case = this.getBooleanField(
        "parameter", 'Match case', this.resource.match_case
    );
    this.searchFormFields.use_search_in = this.getEnumField(
        "parameter", 'Search in', this.getSearchInValues(), undefined, true
    );
    this.searchFormFields.use_content_descriptors = this.getBooleanField(
        "parameter", 'Use content descriptors', (this.resource.content_descriptors !== '')
    );
    this.searchFormFields.content_descriptors = this.getEnumField(
        "parameter", 'Content descriptors', this.getContentDescriptorValues(), "use_content_descriptors", true
    );
    this.searchFormFields.use_ext_epg_info = this.getBooleanField(
        "parameter", 'Use Extended EPG Info', this.resource.use_ext_epg_info
    );
    this.getExtEpgInfoFields();
    this.searchFormFields.use_channel = this.getEnumField(
        "parameter", 'Use Channel', this.getUseChannelValues()
    );
    this.searchFormFields.channel_min = this.getChannelMinField();
    this.searchFormFields.channel_max = this.getChannelMaxField();
    this.searchFormFields.channels = this.getEnumField(
        "parameter", 'Channel Group', this.getChannelGroupFieldValues(), {"use_channel": 2}
    );
    this.searchFormFields.use_time = this.getBooleanField(
        "parameter", 'Use Time', this.resource.use_time
    );
    this.searchFormFields.start_time = this.getStartTimeField();
    this.searchFormFields.stop_time = this.getStopTimeField();
    this.searchFormFields.use_duration = this.getBooleanField(
        "parameter", 'Use duration', this.resource.use_duration
    );
    this.searchFormFields.duration_min = this.getNumberField(
        "parameter", 'Min duration', this.resource.duration_min, 'use_duration'
    );
    this.searchFormFields.duration_max = this.getNumberField(
        "parameter", 'Max duration', this.resource.duration_max, 'use_duration'
    );
    this.searchFormFields.use_dayofweek = this.getBooleanField(
        "parameter", 'Use day of week', this.resource.use_dayofweek
    );
    this.searchFormFields.dayofweek = this.getDayOfWeekField();
    this.searchFormFields.blacklist_mode = this.getBlacklistModeField();
    this.searchFormFields.blacklist_ids = this.getBlacklistSelectorField();
    this.searchFormFields.use_in_favorites = this.getUseInFavoritesField();

    /**
     * searchtimer
     */
    this.searchFormFields.use_as_searchtimer = this.getUseAsSearchTimerField();
    this.searchFormFields.use_as_searchtimer_from = this.getSearchTimerFromField();
    this.searchFormFields.use_as_searchtimer_til = this.getSearchTimerTilField();
    this.searchFormFields.search_timer_action = this.getSearchTimerActionField();
    this.searchFormFields.switch_min_before = this.getSwitchMinBeforeField();
    this.searchFormFields.use_series_recording = this.getUseSeriesRecordingField();
    this.searchFormFields.directory = this.getDirectoryField();
    this.searchFormFields.del_recs_after_days = this.getDelRecsAfterDaysField();
    this.searchFormFields.keep_recs = this.getKeepRecsField();
    this.searchFormFields.pause_on_recs = this.getPauseOnRecsField();


    this.searchFormFields.avoid_repeats = this.getBooleanField(
        "repeats", "Avoid repeats", this.resource.avoid_repeats, {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.allowed_repeats = this.getNumberField(
        "repeats", "Allowed repeats", this.resource.allowed_repeats, {
            "use_as_searchtimer": [1, 2],
            "avoid_repeats": true
        }
    );
    this.searchFormFields.repeats_within_days = this.getNumberField(
        "repeats", "Repeats withing &hellip; days only", this.resource.repeats_within_days, {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2]
        }
    );
    this.searchFormFields.compare_title = this.getBooleanField(
        "repeats", "Compare title", this.resource.compare_title, {"avoid_repeats": true, "use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.compare_subtitle = this.getEnumField(
        "repeats", "Compare subtitle", this.getCompareSubtitleValues(), {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2]
        }
    );
    this.searchFormFields.compare_summary = this.getBooleanField(
        "repeats", "Compare summary", this.resource.compare_summary, {
            "avoid_repeats": true,
            "use_as_searchtimer": [1, 2]
        }
    );
    this.searchFormFields.summary_match = this.getNumberField(
        "repeats", "Min. summary match in %%", this.resource.summary_match, {
            "avoid_repeats": true,
            "compare_summary": true,
            "use_as_searchtimer": [1, 2]
        }
    );
    this.searchFormFields.compare_time = this.getEnumField(
        "repeats", "Compare time", this.getCompareTimeValues(), {"avoid_repeats": true, "use_as_searchtimer": [1, 2]}
    );
    this.getCompareCategoriesField();


    /**
     * Timer
     */
    this.searchFormFields.priority = this.getNumberField(
        "timer", "Priority", this.resource.priority, {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.lifetime = this.getNumberField(
        "timer", "Lifetime", this.resource.lifetime, {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.margin_start = this.getNumberField(
        "timer", "Margin start", this.resource.margin_start, {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.margin_stop = this.getNumberField(
        "timer", "Margin stop", this.resource.margin_stop, {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.del_mode = this.getEnumField(
        "timer", "Auto delete searchtimer", this.getDelModeValues(), {"use_as_searchtimer": [1, 2]}
    );
    this.searchFormFields.del_after_count_recs = this.getNumberField(
        "timer", "after &hellip; recordings", this.resource.del_after_count_recs, {
            "del_mode": 1,
            "use_as_searchtimer": [1, 2]
        }
    );
    this.searchFormFields.del_after_days_of_first_rec = this.getNumberField(
        "timer", "after &hellip; days after first recording",
        this.resource.del_after_days_of_first_rec, {"del_mode": 2, "use_as_searchtimer": [1, 2]}
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
Gui.Window.ViewModel.SearchTimer.prototype.getBooleanField = function (category, label, checked, depends) {

    var field = {
        "category": category,
        "type": "boolean",
        "label": VDRest.app.translate(label),
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
Gui.Window.ViewModel.SearchTimer.prototype.getStringField = function (category, label, value, depends) {

    var field = {
        "category": category,
        "type": "string",
        "label": VDRest.app.translate(label),
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
Gui.Window.ViewModel.SearchTimer.prototype.getNumberField = function (category, label, value, depends) {

    var field = {
        "category": category,
        "type": "number",
        "label": VDRest.app.translate(label),
        "value": value
    };

    if ("undefined" !== typeof depends) {
        field.depends = depends;
    }

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getEnumField = function (category, label, values, depends, multiselect) {

    var field = {
        "category": category,
        "type": "enum",
        "label": VDRest.app.translate(label),
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
Gui.Window.ViewModel.SearchTimer.prototype.getSearchModeValues = function () {

    return {
        "phrase": {
            "label": VDRest.app.translate('Phrase'),
            "value": 0,
            "selected": this.resource.mode === 0
        },
        "and": {
            "label": VDRest.app.translate('AND'),
            "value": 1,
            "selected": this.resource.mode === 1
        },
        "or": {
            "label": VDRest.app.translate('OR'),
            "value": 2,
            "selected": this.resource.mode === 2
        },
        "exact": {
            "label": VDRest.app.translate('Exact'),
            "value": 3,
            "selected": this.resource.mode === 3
        },
        "regex": {
            "label": VDRest.app.translate('RegEx'),
            "value": 4,
            "selected": this.resource.mode === 4
        },
        "fuzzy": {
            "label": VDRest.app.translate('Fuzzy'),
            "value": 5,
            "selected": this.resource.mode === 5
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchInValues = function () {

    return {
        "use_title": {
            "label": VDRest.app.translate('Title'),
            "value": true,
            "selected": this.resource.use_title
        },
        "use_subtitle": {
            "label": VDRest.app.translate('Subtitle'),
            "value": true,
            "selected": this.resource.use_subtitle
        },
        "use_description": {
            "label": VDRest.app.translate('Description'),
            "value": true,
            "selected": this.resource.use_description
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getExtEpgInfoFields = function () {

    var e = this.resource.ext_epg_info,
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
                selected[def.data.id],
                def.data.values
            );
        }


    }.bind(this));


};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getExtEpgInfoComboField = function (def, value, values) {

    var field = {
        "category": "parameter",
        "type": "combobox",
        "label": VDRest.app.translate(def.data.name),
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
            "selected": selected.indexOf(value) > -1
        }

    }.bind(this));

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getStartTimeField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": VDRest.app.translate("Broadcast start after"),
        "format": "%H:%i",
        "depends": "use_time",
        "value": this.resource.start_time,
        "output_format": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getStopTimeField = function () {

    return {
        "category": "parameter",
        "type": "datetime",
        "label": VDRest.app.translate("Broadcast start before"),
        "format": "%H:%i",
        "depends": "use_time",
        "value": this.resource.stop_time,
        "output_format": "Hi"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseChannelValues = function () {

    return {
        "no": {
            "label": VDRest.app.translate('No'),
            "value": 0,
            "selected": this.resource.use_channel === 0
        },
        "range": {
            "label": VDRest.app.translate('Range'),
            "value": 1,
            "selected": this.resource.use_channel === 1
        },
        "channelgroup": {
            "label": VDRest.app.translate('Channel Group'),
            "value": 2,
            "selected": this.resource.use_channel === 2
        },
        "ftaonly": {
            "label": VDRest.app.translate('Free to air only'),
            "value": 3,
            "selected": this.resource.use_channel === 3
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getChannelMinField = function () {

    return {
        "category": "parameter",
        "type": "channel",
        "label": VDRest.app.translate('From Channel'),
        "depends": {"use_channel": 1},
        "selected": this.resource.channel_min,
        "onchange": function () {
            this.searchFormFields.channel_max.getValuesAfter();
        }.bind(this)
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getChannelMaxField = function () {

    return {
        "category": "parameter",
        "type": "channel",
        "label": VDRest.app.translate('To Channel'),
        "depends": {"use_channel": 1},
        "selected": this.resource.channel_max,
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
Gui.Window.ViewModel.SearchTimer.prototype.getDayOfWeekField = function () {

    return {
        "category": "parameter",
        "type": "enum",
        "multiselect": true,
        "bitmask": true,
        "label": VDRest.app.translate('Day of week'),
        "values": {
            "monday": {
                "label": VDRest.app.translate('Monday'),
                "value": this.weekDays.monday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.monday
            },
            "tuesday": {
                "label": VDRest.app.translate('Tuesday'),
                "value": this.weekDays.tuesday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.tuesday
            },
            "wednesday": {
                "label": VDRest.app.translate('Wednesday'),
                "value": this.weekDays.wednesday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.wednesday
            },
            "thursday": {
                "label": VDRest.app.translate('Thursday'),
                "value": this.weekDays.thursday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.thursday
            },
            "friday": {
                "label": VDRest.app.translate('Friday'),
                "value": this.weekDays.friday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.friday
            },
            "saturday": {
                "label": VDRest.app.translate('Saturday'),
                "value": this.weekDays.saturday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.saturday
            },
            "sunday": {
                "label": VDRest.app.translate('Sunday'),
                "value": this.weekDays.sunday,
                "selected": Math.abs(this.resource.dayofweek) & this.weekDays.sunday
            }
        },
        "depends": "use_dayofweek"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getBlacklistModeField = function () {

    return {
        "category": "parameter",
        "type": "enum",
        "label": VDRest.app.translate('Use blacklists'),
        "values": {
            "global_only": {
                "label": VDRest.app.translate('Global only'),
                "value": 0,
                "selected": this.resource.blacklist_mode === 0
            },
            "no": {
                "label": VDRest.app.translate('Selection'),
                "value": 1,
                "selected": this.resource.blacklist_mode === 1
            },
            "all": {
                "label": VDRest.app.translate('All'),
                "value": 2,
                "selected": this.resource.blacklist_mode === 2
            },
            "none": {
                "label": VDRest.app.translate('None'),
                "value": 3,
                "selected": this.resource.blacklist_mode === 3
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getBlacklistSelectorField = function () {

    var collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('Blacklists').getCollection(),
        blacklists = {};

    collection.forEach(function (b) {
        var search = b.getData('search'),
            id = b.getData('id');
        blacklists[search] = {
            "label": search,
            "value": id,
            "selected": this.resource.blacklist_ids.indexOf(id) > -1
        }
    }.bind(this));

    return {
        "category": "parameter",
        "type": "enum",
        "multiselect": true,
        "label": VDRest.app.translate('Blacklists'),
        "depends": {"blacklist_mode": 1},
        "values": blacklists
    }
};
/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseInFavoritesField = function () {

    return {
        "category": "parameter",
        "type": "boolean",
        "label": VDRest.app.translate('Use in Favorites'),
        "checked": this.resource.use_in_favorites
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseAsSearchTimerField = function () {

    return {
        "category": "searchtimer",
        "type": "enum",
        "label": VDRest.app.translate('Use as Searchtimer'),
        "values": {
            "yes": {
                "label": VDRest.app.translate('Yes'),
                "value": 1,
                "selected": this.resource.use_as_searchtimer === 1
            },
            "no": {
                "label": VDRest.app.translate('No'),
                "value": 0,
                "selected": this.resource.use_as_searchtimer === 0
            },
            "user_defined": {
                "label": VDRest.app.translate('User defined'),
                "value": 2,
                "selected": this.resource.use_as_searchtimer === 2
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchTimerFromField = function () {

    return {
        "category": "searchtimer",
        "type": "datetime",
        "label": VDRest.app.translate("From date"),
        "format": "%d.%m.%Y",
        "depends": {"use_as_searchtimer": 2},
        "value": function () {

            var d = new Date(this.resource.use_as_searchtimer_from * 1000);

            return d.getFullYear().toString() +
                VDRest.helper.pad(d.getMonth() + 1, 2) +
                VDRest.helper.pad(d.getDate(), 2)
        }.bind(this)(),
        "output_format": "Ymd"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchTimerTilField = function () {

    return {
        "category": "searchtimer",
        "type": "datetime",
        "label": VDRest.app.translate("Until date"),
        "format": "%d.%m.%Y",
        "depends": {"use_as_searchtimer": 2},
        "value": function () {

            var d = new Date(this.resource.use_as_searchtimer_til * 1000);

            return d.getFullYear().toString() +
                VDRest.helper.pad(d.getMonth() + 1, 2) +
                VDRest.helper.pad(d.getDate(), 2)
        }.bind(this)(),
        "output_format": "Ymd"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchTimerActionField = function () {

    return {
        "category": "searchtimer",
        "type": "enum",
        "label": VDRest.app.translate('Action'),
        "depends": {"use_as_searchtimer": [1, 2]},
        "values": {
            "record": {
                "label": VDRest.app.translate('Record'),
                "value": 0,
                "selected": this.resource.search_timer_action === 0
            },
            "announce": {
                "label": VDRest.app.translate('Announce'),
                "value": 1,
                "selected": this.resource.search_timer_action === 1
            },
            "switch": {
                "label": VDRest.app.translate('Switch'),
                "value": 2,
                "selected": this.resource.search_timer_action === 2
            },
            "announce_switch": {
                "label": VDRest.app.translate('Announce and Switch'),
                "value": 3,
                "selected": this.resource.search_timer_action === 3
            },
            "announce_by_mail": {
                "label": VDRest.app.translate('Announce by mail'),
                "value": 4,
                "selected": this.resource.search_timer_action === 4
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSwitchMinBeforeField = function () {

    return {
        "category": "searchtimer",
        "type": "string",
        "label": VDRest.app.translate('minutes before switch'),
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 2
        },
        "value": this.resource.switch_min_before
    }
};
/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseSeriesRecordingField = function () {

    return {
        "category": "searchtimer",
        "type": "boolean",
        "label": VDRest.app.translate('Is series recording'),
        "depends": {
            "use_as_searchtimer": [1, 2]
        },
        "checked": this.resource.use_series_recording
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getDirectoryField = function () {

    var field = {
            "category": "searchtimer",
            "type": "combobox",
            "label": VDRest.app.translate('Directory'),
            "depends": {
                "use_as_searchtimer": [1, 2]
            },
            "text_input_seperator": ', ',
            "text_value": this.resource.directory
        },
        directories = VDRest.app.getModule('VDRest.SearchTimer').getModel('RecordingDirs').getCollection();

    field.values = {};

    directories.forEach(function (value) {

        field.values[value.data] = {
            "label": value.data,
            "value": value.data,
            "selected": value.data == this.resource.directory
        }

    }.bind(this));

    return field;
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getDelRecsAfterDaysField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": VDRest.app.translate('Delete after &hellip; days'),
        "depends": {
            "use_as_searchtimer": [1, 2]
        },
        "value": this.resource.del_recs_after_days
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getKeepRecsField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": VDRest.app.translate('Keep &hellip; recordings'),
        "depends": {
            "use_as_searchtimer": [1, 2]
        },
        "value": this.resource.keep_recs
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getPauseOnRecsField = function () {

    return {
        "category": "searchtimer",
        "type": "number",
        "label": VDRest.app.translate('Pause after &hellip; recordings'),
        "depends": {
            "use_as_searchtimer": [1, 2]
        },
        "value": this.resource.pause_on_recs
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getCompareSubtitleValues = function () {

    return {
        "no": {
            "label": VDRest.app.translate('No'),
            "value": 0,
            "selected": this.resource.compare_subtitle == 0
        },
        "exists": {
            "label": VDRest.app.translate('If exists'),
            "value": 1,
            "selected": this.resource.compare_subtitle == 1
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getCompareTimeValues = function () {

    return {
        "no": {
            "label": VDRest.app.translate('No'),
            "value": 0,
            "selected": this.resource.compare_time == 0
        },
        "day": {
            "label": VDRest.app.translate('Same Day'),
            "value": 1,
            "selected": this.resource.compare_time == 1
        },
        "week": {
            "label": VDRest.app.translate('Same Week'),
            "value": 2,
            "selected": this.resource.compare_time == 2
        },
        "month": {
            "label": VDRest.app.translate('Same Month'),
            "value": 3,
            "selected": this.resource.compare_time == 3
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getDelModeValues = function () {

    return {
        "no": {
            "label": VDRest.app.translate('No'),
            "value": 0,
            "selected": this.resource.del_mode == 0
        },
        "recordings_count": {
            "label": VDRest.app.translate('Recordings count'),
            "value": 1,
            "selected": this.resource.del_mode == 1
        },
        "days_count": {
            "label": VDRest.app.translate('Days count'),
            "value": 2,
            "selected": this.resource.del_mode == 2
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getCompareCategoriesField = function () {

    var collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('ExtEPGInfoList').getCollection(),
        value = 1;

    collection.forEach(function (item) {

        this.searchFormFields['compare_categories_' + item.data.id.toString()] = {
            "category": "repeats",
            "type": "boolean",
            "label": VDRest.app.translate('Compare %s', item.data.name),
            "checked": (Math.abs(this.resource.compare_categories) & value) > 0,
            "depends": {"avoid_repeats": true, "use_as_searchtimer": [1, 2]}
        };

        value *= 2;
    }.bind(this));
};

Gui.Window.ViewModel.SearchTimer.prototype.getContentDescriptorValues = function () {

    var collection = VDRest.app.getModule('VDRest.Epg').getModel('ContentDescriptors').getCollection(),
        values = {}, selection = this.resource.content_descriptors.match(/.{1,2}/g) || [];

    collection.forEach(function (descr) {

        values[descr.data.id] = {
            "label": descr.data.name,
            "value": descr.data.id,
            "selected": selection.indexOf(descr.data.id) > -1
        };
        if (!descr.data.is_group) {
            values[descr.data.id].className = "indent";
        }

    }.bind(this));

    return values;
};


Gui.Window.ViewModel.SearchTimer.prototype.getChannelGroupFieldValues = function () {

    var cGroups = VDRest.app.getModule('Gui.SearchTimer').getController('List').channelgroups, i;

    for (i in cGroups) {
        if (cGroups.hasOwnProperty(i)) {
            cGroups[i].value = i;
            cGroups[i].selected = i === this.resource.channels;
        }
    }

    return cGroups;
};

Gui.Window.ViewModel.SearchTimer.prototype.getTimerFormData = function () {

    return 'Boing';
};
