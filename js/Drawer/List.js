DrawerList = function () {};

DrawerList.prototype.element = $('<ul>').addClass(this.className);

DrawerList.prototype.className = 'drawer';

DrawerList.prototype.header = $('<li>').text('Seiten').append($('<div>').addClass('clase').text('&#10006;'));

DrawerList.prototype.items = {};

DrawerList.prototype.dispatch = function () {
    var i;
    for (i in this.items) {
        this.items[i] = new DraweListItem(this.items[i]);
        this.element.append(this.items[i]);
    }
};