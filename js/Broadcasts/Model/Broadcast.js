Broadcasts.Model.Broadcast = function () {};

Broadcasts.Model.Broadcast.prototype = new Abstract.Model();

Broadcasts.Model.Broadcast.prototype.init = function () {

    debugger;
    if (!this.hasData('count')) {

        if (this.hasData('id')) {

            this.data = this.module.getResource().load(this.getData('id'));
        }
    }
};