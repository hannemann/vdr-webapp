
Gui.Recordings.View.List = function () {};

Gui.Recordings.View.List.prototype = new VDRest.Abstract.View();

Gui.Recordings.View.List.prototype.init = function () {

    this.node = $('<div id="recordings-list" class="simple-list clearer">');
};

Gui.Recordings.View.List.prototype.renderFirstLevel = function () {

    var i= 0, l;

    this.tree = this.getTree();

    this.tree.data.directories.sort(this.sortAlpha);

    l = this.tree.data.directories.length;

    for (i; i<l; i++) {

        this.tree.data.directories[i].dispatchView();
    }

    this.tree.data.files.sort(this.sortAlpha);

    i=0; l = this.tree.data.files.length;

    for (i; i<l; i++) {

        this.tree.data.files[i].dispatchView();
    }

    this.tree.dispatchView();
};

Gui.Recordings.View.List.prototype.sortAlpha = function (a, b) {

    a = a.data.name.toLowerCase().replace(/^[^a-z]/, '')[0];
    b = b.data.name.toLowerCase().replace(/^[^a-z]/, '')[0];

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
};