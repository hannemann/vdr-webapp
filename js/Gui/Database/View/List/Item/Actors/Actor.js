/**
 * @class
 * @constructor
 */
Gui.Database.View.List.Item.Actors.Actor = function () {
};

/**
 * @type {VDRest.Abstract.View}
 */
Gui.Database.View.List.Item.Actors.Actor.prototype = new VDRest.Abstract.View();

/**
 * @type {boolean}
 */
Gui.Database.View.List.Item.Actors.Actor.prototype.bypassCache = true;

/**
 * initialize
 */
Gui.Database.View.List.Item.Actors.Actor.prototype.init = function () {

    this.node = $('<div class="display-item-actors-actor clearer">');

    this.baseUrl = VDRest.Api.Resource.prototype.getBaseUrl();

    this.baseImageUrl = this.baseUrl + 'scraper/image/';
};

/**
 * render view
 */
Gui.Database.View.List.Item.Actors.Actor.prototype.render = function () {

    this.addImage()
        .addName()
        .addRole();

    VDRest.Abstract.View.prototype.render.call(this);
};

Gui.Database.View.List.Item.Actors.Actor.prototype.addImage = function () {

    $('<img>')
        .attr('src', this.baseImageUrl + this.getData('thumb'))
        .appendTo(this.node);

    return this;
};

Gui.Database.View.List.Item.Actors.Actor.prototype.addName = function () {

    $('<div>').addClass('actor-name')
        .html(this.getData('name'))
        .appendTo(this.node);

    return this;
};

Gui.Database.View.List.Item.Actors.Actor.prototype.addRole = function () {

    $('<div>').addClass('actor-role')
        .html(this.getData('role'))
        .appendTo(this.node);

    return this;
};