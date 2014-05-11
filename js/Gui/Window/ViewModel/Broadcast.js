/**
 * @class
 * @constructor
 */
Gui.Window.ViewModel.Broadcast = function () {};

/**
 * @type {VDRest.Lib.Cache.store.ViewModel}
 */
Gui.Window.ViewModel.Broadcast.prototype = new VDRest.Abstract.ViewModel();

/**
 * cache key
 * @type {string}
 */
Gui.Window.ViewModel.Broadcast.prototype.cacheKey = 'channel/id';

/**
 * map strings to images
 * @type {object}
 * @property {string} 16:9
 * @property {string} stereo
 */
Gui.Window.ViewModel.Broadcast.prototype.componentsMap = {
    "16:9":'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAYAAAB50g0VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gQCEiIMCs/EoQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJaSURBVEjH1Vc9iBNBGH3fZEMkm2IhFgfaSkAUC89CGwsrC8XKSTaFYooVz4DdgYIJGkErORIPIgQLQ/bmRJurba62OLQwcIL9YWDRxEh+9rOZyBLzYyBw64OF+d198973zc4QACilrgMoATiB8EBKKbdJk1MIJ6ShlRvhLoAtKWXrsBgppdYAVHS1REopHpGTUr4Ig2xBkiLQvhUia/9wEYGIbIUoO1p/EQwrjBlxwGOrovEx9Xr9gmEYz4holZkPADxKp9O1WR8sFovRVCq1LoS4yczHieiL7/uFTCbzdtJ4MUNmmkRqhEajcToajb4nIh4MBid7vd4qgHPzFEmlUgUhxGMArzqdzlEALhG9cV33/EIKzoMQ4gGAI4PB4F42m/2qm29PciG4UCK6AQCe55Udx2lXq9WyZVklIroP4MrSCAK4CACGYWwqpU4x8w8A7zqdznoul2tPm0RE5pSuMwtZPA9ElNTFnXa7vUJEFSK6Y5rmxpww2QEAy7LytVotYVlWXrevLJWgTgp4nlfO5XJtz/PKuuvarHme5+V9338JIG+a5gEzX9Xv+7bUGCSijwCOTej6OWue4zjfATj6geu6Z4noA4DdpRIcDodPI5HIZW3VRiKRGFn1elaSaFKb3W73oWEYCSHEcwC/fN9/spDFSikO7oXjddu2d33ftwFkTdNsMfMtZi42m83CP+wAe/F4fC8Wi31mZur3+5ds2/400alpqwzBgYH/i1+dCDBOhki95KQYTIdIuHSQ4L4uV5RSa4et5NiJej/0dxIhpdwGIANKhupW9xs0GPih7u1gBgAAAABJRU5ErkJggg==" alt="">',
    "stereo":'<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAXCAYAAAB50g0VAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMYFjQgrgLeogAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAJDSURBVEjHzZdBaBNBFIa/NykxObSUFsQWtEXwrF5EVJDeFCleirMJaqBgc6hQiuLNg9CbQpFWFEFoVTY7hd48FkXw5sWCqFAQqR7KQqUkp5Qkz4MbWWpoc0jpvsvuvnnDfPvPm3kzAuCcuwbMACdIjllr7ZJEcI5kmu2KlGvabSCw1m4eFJFzbhKYjz5nxDmnTThr7ZMkyBaHNDF/kKCp/cdiYhm5maDVsfkfYFKtq52gUql0SkTGgUvAEFABvovIy62trWfFYrG2R//rxpj7qjosIj9U9YHneX47Y7eloIg8F5GvwJUwDLu3t7dPA1+Aud7e3qe7JlMQXDTGvFLVt9VqdUBV3wGvfd8/3zEFPc87s8P1c2FhYSqbzRZUNQ/c2uXn7gLUarXZQqHw2/f92VQqVTTG3AOudkTBVpZOp89FAL/2CD0JEIbhOkClUlmP+/cFMAiC46lUag5o1Ov1O7vFquphgHK5XAVYWVmpRk1H9gXQOTcBrKrqkKqO5/P5N3vkbwjQ09NzCGB0dDQTNW10LAejlThgjHkBXAY+qupELpf71EbXVeDo4ODgMPAtnU4fi/k7o2AQBFZEPqvqBVWdWl5ePtsKzjmnsdLZnOJH0XN6cXGxT1Wn9a897OQ2E4hIn4h0i8jjsbGxehNmJ1CLHeC9qt4UkZFMJrMhIiONRuNGLpf70NbYzQGstZKkCtLkSnypMzHi/gSp198qB70ECefFAdei93nn3ORBK7njRL2W+DuJsdYuATamZKJudX8AyEXyf8hB+OQAAAAASUVORK5CYII=" alt="">'
};

/**
 * init view methods
 */
Gui.Window.ViewModel.Broadcast.prototype.init = function () {

    var me = this;

    this.resource = this.data.resource.data;
    this.view = this.data.view;

    this.initViewMethods();

    this.view.getStartTime = function () {

        return VDRest.helper.getTimeString(me.resource.start_date)
    };

    this.view.getEndTime = function () {

        return VDRest.helper.getTimeString(me.resource.end_date)
    };

    this.view.hasComponents = function () {

        return me.resource.components.length > 0;
    };

    this.view.getComponents = function () {

        return me.getComponents();
    };
};

/**
 * map components to images
 * @returns {Array}
 */
Gui.Window.ViewModel.Broadcast.prototype.getComponents = function () {

    var i = 0, l = this.resource.components.length, components, component;

    if (l > 0) {

        components = [];

        for (i;i<l;i++) {

            component = this.componentsMap[this.resource.components[i].description.toLowerCase()];
            if (typeof component != 'undefined') {

                components.push(component);
            }
        }
    }

    return components.unique();
};
