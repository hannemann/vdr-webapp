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

    var i=0, l=this.items.length;

    for (i;i<l;i++) {

        this.items[i].dom()
            .text(this.items[i].getData('filename'))
            .appendTo(this.root);

        // delegate this shit to timer....?
        // schicht zum normalisieren der events, timer und aufnahmen?

    }

};