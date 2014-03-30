Gui.ListView = function () {};

/**
 * Items Setter
 * @param items
 * @return {*}
 */
Gui.ListView.prototype.setItems = function (items) {
    this.items = items;
    return this;
};

/**
 * root setter
 * @param root
 * @return {*}
 */
Gui.ListView.prototype.setRoot = function (root) {
    this.root = root;
    return this;
};

/**
 * render items to root node
 */
Gui.ListView.prototype.render = function () {

    var i=0, l=this.items.length, text;

    for (i;i<l;i++) {

        text = [
            this.items[i].getData('filename'),
            helper.getDateString(this.items[i].date(), true),
            helper.getTimeString(this.items[i].startDate()) +' - '+ helper.getTimeString(this.items[i].stopDate())
        ].join(' ');

        this.items[i].dom()
            .text(text)
            .appendTo(this.root);

//            console.log(timers[i].date(), timers[i].startDate(), timers[i].stopDate(), timers[i].paths(), timers[i].name(), timers[i].getData('priority'));

        // delegate this shit to timer....?
        // schicht zum normalisieren der events, timer und aufnahmen?

    }

};