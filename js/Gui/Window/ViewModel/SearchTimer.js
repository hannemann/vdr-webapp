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

//    var me = this;

    VDRest.Abstract.ViewModel.prototype.initViewMethods.call(this);

    this.data.view.getTabConfig = this.getTabConfig.bind(this.data.view);

    this.data.view.getSearchFormData = this.getSearchFormData.bind(this);

    this.data.view.getTimerFormData = this.getTimerFormData.bind(this);
};

Gui.Window.ViewModel.SearchTimer.prototype.getTabConfig = function () {

    var me = this;

    return {
        "keyInCache": this.keyInCache,
        "parentView": this.body,
        "cacheKey": this.cacheKey,
        "tabs": {
            "search": {
                "label": VDRest.app.translate('Search'),
                "content": function (content) {

                    $(content).append(me.getSearchForm());
                },
                "default": true
            },
            "timer": {
                "label": "Timer",
                "content": function (content) {

                    $(content).append(me.getTimerForm());
                }
            }
        }
    }
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
        "timer": {"label": VDRest.app.translate('Timer')}
    };
};

/**
 * @typedef {{}} searchTimerFormFields
 * @property {searchTimerCommonField} search
 * @property {searchTimerSearchModesField} mode
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


    this.searchFormFields.search = this.getSearchField();
    this.searchFormFields.mode = this.getSearchModeField();
    this.searchFormFields.tolerance = this.getToleranceField();
    this.searchFormFields.match_case = this.getMatchCaseField();
    this.searchFormFields.use_search_in = this.getUseSearchInField();
    this.searchFormFields.use_ext_epg_info = this.getUseExtEpgInfoField();
    this.getExtEpgInfoFields();
    this.searchFormFields.use_channel = this.getUseChannelField();
    this.searchFormFields.channel_min = this.getChannelMinField();
    this.searchFormFields.channel_max = this.getChannelMaxField();
    this.searchFormFields.channels = this.getChannelGroupField();
    this.searchFormFields.use_time = this.getUseTimeField();
    this.searchFormFields.start_time = this.getStartTimeField();
    this.searchFormFields.stop_time = this.getStopTimeField();
    this.searchFormFields.use_duration = this.getUseDurationField();
    this.searchFormFields.duration_min = this.getUseDurationMinField();
    this.searchFormFields.duration_max = this.getUseDurationMaxField();
    this.searchFormFields.use_dayofweek = this.getUseDayOfWeekField();
    this.searchFormFields.dayofweek = this.getDayOfWeekField();
    this.searchFormFields.blacklist_mode = this.getBlacklistModeField();
    this.searchFormFields.blacklist_ids = this.getBlacklistSelectorField();
    this.searchFormFields.use_in_favorites = this.getUseInFavoritesField();
    this.searchFormFields.use_as_searchtimer = this.getUseAsSearchTimerField();
    this.searchFormFields.use_as_searchtimer_from = this.getSearchTimerFromField();
    this.searchFormFields.use_as_searchtimer_til = this.getSearchTimerTilField();
    this.searchFormFields.search_timer_action = this.getSearchTimerActionField();
    this.searchFormFields.switch_min_before = this.getSwitchMinBeforeField();

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
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchField = function () {

    return {
        "category": "search",
        "type": "string",
        "label": VDRest.app.translate('Query'),
        "value": this.resource.search
    };
};

/**
 * retrieve search mode configuration
 *
 * @typedef {{}} searchTimerSearchMode
 * @property {string} label
 * @property {number} value
 *
 * @typedef {{}} searchTimerSearchModesField
 * @property {string} category
 * @property {string} type
 * @property {string} label
 * @property {Object.<searchTimerSearchMode>} values
 * @return {searchTimerSearchModesField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSearchModeField = function () {

    return {
        "category": "search",
        "type": "enum",
        "label": VDRest.app.translate('Mode'),
        "values": {
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
        }
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getToleranceField = function () {

    return {
        "category": "search",
        "type": "number",
        "label": VDRest.app.translate('Tolerance'),
        "depends": {
            "mode": 5
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getMatchCaseField = function () {

    return {
        "category": "search",
        "type": "boolean",
        "label": VDRest.app.translate('Match case'),
        "checked": this.resource.match_case
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseSearchInField = function () {

    return {
        "category": "search",
        "type": "enum",
        "multiselect": true,
        "label": VDRest.app.translate('Search in'),
        "values": {
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
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseExtEpgInfoField = function () {

    return {
        "category": "search",
        "type": "boolean",
        "label": VDRest.app.translate('Use Extended EPG Info'),
        "checked": this.resource.use_ext_epg_info
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getExtEpgInfoFields = function () {


    //debugger;

    var e = this.resource.ext_epg_info,
        collection = VDRest.app.getModule('VDRest.SearchTimer').getModel('ExtEPGInfoList').getCollection(),
        selected = {};


    e.forEach(function (sel) {

        sel = sel.split('#');
        selected[sel[0]] = sel[1];
    }.bind(this));


    collection.forEach(function (def) {

        if (0 === def.data.values.length) {
            this.searchFormFields['ext_epg_info_' + def.data.id] = this.getExtEpgInfoSimpleField(
                def,
                selected[def.data.id]
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
Gui.Window.ViewModel.SearchTimer.prototype.getExtEpgInfoSimpleField = function (def, value) {

    return {
        "category": "search",
        "type": "string",
        "label": VDRest.app.translate(def.data.name),
        "value": value,
        "depends": "use_ext_epg_info"
    };
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getExtEpgInfoComboField = function (def, value, values) {

    var field = {
        "category": "search",
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
Gui.Window.ViewModel.SearchTimer.prototype.getUseTimeField = function () {

    return {
        "category": "search",
        "type": "boolean",
        "label": VDRest.app.translate('Use Time'),
        "checked": this.resource.use_time
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getStartTimeField = function () {

    return {
        "category": "search",
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
        "category": "search",
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
Gui.Window.ViewModel.SearchTimer.prototype.getUseChannelField = function () {

    return {
        "category": "search",
        "type": "enum",
        "label": VDRest.app.translate('Use Channel'),
        "values": {
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
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getChannelMinField = function () {

    return {
        "category": "search",
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
        "category": "search",
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
Gui.Window.ViewModel.SearchTimer.prototype.getChannelGroupField = function () {

    return {
        "category": "search",
        "type": "enum",
        "label": VDRest.app.translate('Channel Group'),
        "depends": {"use_channel": 2},
        "values": this.getChannelGroupFieldValues()
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseDurationField = function () {

    return {
        "category": "search",
        "type": "boolean",
        "label": VDRest.app.translate('Use duration'),
        "checked": this.resource.use_duration
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseDurationMinField = function () {

    return {
        "category": "search",
        "type": "string",
        "label": VDRest.app.translate('Min duration'),
        "value": this.resource.duration_min,
        "depends": "use_duration"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseDurationMaxField = function () {

    return {
        "category": "search",
        "type": "string",
        "label": VDRest.app.translate('Max duration'),
        "value": this.resource.duration_max,
        "depends": "use_duration"
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getUseDayOfWeekField = function () {

    return {
        "category": "search",
        "type": "boolean",
        "label": VDRest.app.translate('Use day of week'),
        "checked": this.resource.use_dayofweek
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getDayOfWeekField = function () {

    return {
        "category": "search",
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
        "category": "search",
        "type": "enum",
        "label": VDRest.app.translate('Use blacklists'),
        "values": {
            "yes": {
                "label": VDRest.app.translate('No'),
                "value": 0,
                "selected": this.resource.blacklist_mode === 0
            },
            "no": {
                "label": VDRest.app.translate('Selection'),
                "value": 1,
                "selected": this.resource.blacklist_mode === 1
            },
            "user_defined": {
                "label": VDRest.app.translate('All'),
                "value": 2,
                "selected": this.resource.blacklist_mode === 2
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
        "category": "search",
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
        "category": "search",
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
        "category": "search",
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
        "category": "search",
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
        "category": "search",
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
        "category": "search",
        "type": "enum",
        "label": VDRest.app.translate('Action'),
        "depends": {"use_as_searchtimer": [1, 2]},
        "values": {
            "yes": {
                "label": VDRest.app.translate('Record'),
                "value": 0,
                "selected": this.resource.search_timer_action === 0
            },
            "no": {
                "label": VDRest.app.translate('Announce'),
                "value": 1,
                "selected": this.resource.search_timer_action === 1
            },
            "user_defined": {
                "label": VDRest.app.translate('Switch'),
                "value": 2,
                "selected": this.resource.search_timer_action === 2
            }
        }
    }
};

/**
 * @return {searchTimerCommonField}
 */
Gui.Window.ViewModel.SearchTimer.prototype.getSwitchMinBeforeField = function () {

    return {
        "category": "search",
        "type": "string",
        "label": VDRest.app.translate('minutes before switch'),
        "depends": {
            "use_as_searchtimer": [1, 2],
            "search_timer_action": 2
        },
        "value": this.resource.switch_min_before
    }
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
