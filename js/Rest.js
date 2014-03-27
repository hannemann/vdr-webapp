Rest = function () {};

Rest.prototype.host = config.getItem('host');

Rest.prototype.port = config.getItem('port');

Rest.prototype.load = function () {
    var list = this.itemList.empty();
    main.getModule('gui').showThrobber();
    $.ajax({
        "url":"http://"+this.host+":"+this.port+"/"+this.urls.load,
        "success":$.proxy(this.onSuccess, this),
        "complete":$.proxy(this.onComplete, this),
        "error":$.proxy(this.onError, this)
    });
};

Rest.prototype.onSuccess = function (result) {};

Rest.prototype.onComplete = function () {
    main.getModule('gui').hideThrobber();
};

Rest.prototype.onError = function () {};
