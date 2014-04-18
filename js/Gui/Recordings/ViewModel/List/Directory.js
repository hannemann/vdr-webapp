
Gui.Recordings.ViewModel.List.Directory = function () {};

Gui.Recordings.ViewModel.List.Directory.prototype = new VDRest.Abstract.ViewModel();

Gui.Recordings.ViewModel.List.Directory.prototype.cacheKey = 'path';

Gui.Recordings.ViewModel.List.Directory.prototype.init = function () {

    this.resource = this.data.resource;

    this.initViewMethods();
};