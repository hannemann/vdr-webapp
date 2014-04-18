
Gui.Recordings.View.List.Directory = function () {};

Gui.Recordings.View.List.Directory.prototype = new VDRest.Abstract.View();

Gui.Recordings.View.List.Directory.prototype.cacheKey = 'path';

Gui.Recordings.View.List.Directory.prototype.init = function () {

    this.node = $('<div class="recordings-path list-item clearer">');

    this.name = $('<div class="name">').appendTo(this.node);
};

Gui.Recordings.View.List.Directory.prototype.render = function () {

    this.name.text(this.getName());

//    this.renderItems();

    VDRest.Abstract.View.prototype.render.call(this);
};


Gui.Recordings.View.List.Directory.prototype.renderItems = function () {

    var i = 0, l,
        directories = this.getDirectories(),
        files = this.getFiles();

    l = directories.length;

    for (i; i<l; i++) {

        directories[i].dispatchView();
    }

    i = 0; l = files.length;

    for (i; i<l; i++) {

        files[i].dispatchView();
    }
};
