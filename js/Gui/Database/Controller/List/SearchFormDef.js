/**
 * Definition of the database list search form
 */
Gui.Database.Controller.List.prototype.searchForm = {
    "cacheKey": "key",
    "key": "database.list.form",
    "catConfig": {
        "search": {
            "label": VDRest.app.translate("Search")
        }
    },
    "fields": {
        "query": {
            "type": "string",
            "category": "search",
            "label": VDRest.app.translate("Query")
        },
        "genre": {
            "type": "enum",
            "multiselect": true,
            "label": VDRest.app.translate('Genre'),
            "category": "search"
        },
        "advanced": {
            "type": "boolean",
            "category": "search",
            "label": VDRest.app.translate("Advanced"),
            "checked": false
        },
        "attributes": {
            "type": "enum",
            "multiselect": true,
            "label": VDRest.app.translate('Search in'),
            "category": "search",
            "depends": "advanced",
            "values": {
                "title": {
                    "label": VDRest.app.translate('Title'),
                    "value": "title",
                    "selected": true
                },
                "tagline": {
                    "label": VDRest.app.translate('Subtitle'),
                    "value": "tagline"
                },
                "overview": {
                    "label": VDRest.app.translate('Description'),
                    "value": "overview"
                }
            }
        }
    }
};
Gui.Database.Controller.List.prototype.sortForm = {
    "cacheKey": "key",
    "key": "sort",
    "catConfig": {
        "sort": {
            "label": VDRest.app.translate("Sort")
        }
    },
    "fields": {
        "method": {
            "category": "sort",
            "type": "enum",
            "dataType": "string",
            "label": VDRest.app.translate('Method'),
            "values": {
                "sortRecordingDate": {
                    "label": "Recording Date",
                    "method": "sortRecordingDate",
                    "selected": true
                },
                "sortReleaseDate": {
                    "label": "Release Date",
                    "method": "sortReleaseDate"
                },
                "sortAlpha": {
                    "label": "Title",
                    "method": "sortAlpha"
                },
                "sortRating": {
                    "label": "Rating",
                    "method": "sortRating"
                }
            }
        },
        "reverse": {
            "category": "sort",
            "type": "boolean",
            "label": VDRest.app.translate('Descending')
        }
    }
};
