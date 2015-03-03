/**
 * @class
 *
 * dispatch by event
 *
 * $.event.trigger({
 *     "type" : "window.request",
 *     "payload" : {
 *         "type" : "Window.Form",
 *         "module" : VDRest.app.getModule('Gui.Form'),
 *         "data" : {your data here}
 *     }
 * })
 *
 * @constructor
 */
Gui.Form.Controller.Window.Form = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Form.Controller.Window.Form.prototype = new Gui.Window.Controller.Abstract();

/**
 * @type {boolean}
 */
Gui.Form.Controller.Window.Form.prototype.bypassCache = true;

/**
 * initialize view
 */
Gui.Form.Controller.Window.Form.prototype.init = function () {

    this.data = {
        "cacheKey": 'blafiggi',
        "blafiggi": 'Blasi',
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
            "query1": {
                "type": "string",
                "category": "search",
                "label": VDRest.app.translate("Query")
            },
            "query2": {
                "type": "string",
                "category": "search",
                "label": VDRest.app.translate("Query")
            },
            "query3": {
                "type": "string",
                "category": "search",
                "label": VDRest.app.translate("Query")
            },
            "query4": {
                "type": "string",
                "category": "search",
                "label": VDRest.app.translate("Query")
            },
            "advanced": {
                "type": "boolean",
                "category": "search",
                "label": VDRest.app.translate("Advanced"),
                "checked": false
            },
            "channel": {
                "type": "channel",
                "category": "search",
                "depends": "advanced",
                "label": "Channel"
            },
            "mode": {
                "type": "enum",
                "name": "mode",
                "label": VDRest.app.translate("Mode"),
                "depends": "advanced",
                "category": "search",
                "values": {
                    "phrase": {
                        "label": VDRest.app.translate("Phrase"),
                        "value": "0",
                        "selected": true
                    },
                    "and": {
                        "label": VDRest.app.translate("AND"),
                        "value": "1"
                    },
                    "or": {
                        "label": VDRest.app.translate("OR"),
                        "value": "2"
                    },
                    "exact": {
                        "label": VDRest.app.translate("Exact"),
                        "value": "3"
                    },
                    "regex": {
                        "label": VDRest.app.translate("RegEx"),
                        "value": "4"
                    },
                    "fuzzy": {
                        "label": VDRest.app.translate("Fuzzy"),
                        "value": "5"
                    }
                }
            },
            "use_title": {
                "type": "boolean",
                "label": VDRest.app.translate("Search Title"),
                "depends": "advanced",
                "category": "search",
                "checked": true
            },
            "use_subtitle": {
                "type": "boolean",
                "label": VDRest.app.translate("Search Subtitle"),
                "depends": "advanced",
                "category": "search",
                "checked": false
            },
            "use_description": {
                "type": "boolean",
                "label": VDRest.app.translate("Search Description"),
                "depends": "advanced",
                "category": "search",
                "checked": false
            }
        }
    };


    var formData = this.data;

    this.formKey = this.data[this.data.cacheKey];


    this.eventPrefix = 'window.form';
    this.view = this.module.getView('Window.Form', this.data);
    formData.parentView = {"node": this.view.body};
    this.module.dispatch(formData);
    Gui.Window.Controller.Abstract.prototype.init.call(this);
};

/**
 * dispatch
 */
Gui.Form.Controller.Window.Form.prototype.dispatchView = function () {

    Gui.Window.Controller.Abstract.prototype.dispatchView.call(this);
    this.addObserver();
    this.setPosition();
};

/**
 * add event listeners
 */
Gui.Form.Controller.Window.Form.prototype.addObserver = function () {

    this.view.body.find('form').on('submit', this.okAction.bind(this));
    this.view.ok.on('click', this.okAction.bind(this));
    this.view.cancel.on('click', this.cancel.bind(this));
    $(window).on("resize form.size-changed", this.setPosition.bind(this));
};

/**
 * remove event listeners
 */
Gui.Form.Controller.Window.Form.prototype.removeObserver = function () {

    this.view.body.find('form').off('submit');
    this.view.ok.off('click');
    this.view.cancel.off('click');
    $(window).off("resize form.size-changed");
};

/**
 * handle confirm
 */
Gui.Form.Controller.Window.Form.prototype.okAction = function (e) {

    this.vibrate();
    e.preventDefault();
    history.back();
};

/**
 * cancel action
 */
Gui.Form.Controller.Window.Form.prototype.cancel = function () {

    this.vibrate();
    history.back();
};

/**
 * adjust position in case keyboard pops up
 */
Gui.Form.Controller.Window.Form.prototype.setPosition = function () {

    var winHeight = $(window).height(), height = this.view.node.height(), top;
    top = parseInt((winHeight - height) / 2, 10) + 'px';
    this.view.node.css({
        "transition": "top .2s",
        "top": top
    });

};

/**
 * Destroy
 */
Gui.Form.Controller.Window.Form.prototype.destructView = function () {

    // remove on animation end
    this.view.node.one(this.animationEndEvents, function () {

        $.event.trigger({
            "type": "destruct.form-" + this.formKey
        });
        Gui.Window.Controller.Abstract.prototype.destructView.call(this);
    }.bind(this));
    // apply animation
    this.view.node.toggleClass('collapse expand');
};