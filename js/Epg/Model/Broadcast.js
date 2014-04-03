Epg.Model.Broadcast = function () {};

Epg.Model.Broadcast.prototype = new Abstract.Model();

Epg.Model.Broadcast.prototype.init = function () {

    debugger;
    if (!this.hasData('count')) {

        if (this.hasData('id')) {

            this.data = this.module.getResource().load(this.getData('id'));
        }
    }
};