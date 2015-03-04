/**
 * Extend native objects
 */

/**
 * remove duplicates
 * @return {Array}
 */
Array.prototype.unique = function() {

    var u = {}, a = [];
    for(var i = 0, l = this.length; i < l; ++i){
        if(u.hasOwnProperty(this[i])) {
            continue;
        }
        a.push(this[i]);
        u[this[i]] = 1;
    }
    return a;
};

/**
 * shuffle array
 * @return void
 */
Array.prototype.shuffle = function () {

    for(var j, x, i = this.length; i; j = Math.floor(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
};

/**
 * retrieve array intersection
 * @param b
 * @returns {Array}
 */
Array.prototype.pfIntersect = function (b) {

    var ai = 0, bi = 0, result = [],
        a = Array.prototype.slice.call(this),
        c = Array.prototype.slice.call(b);

    a.sort();
    c.sort();

    while (ai < a.length && bi < c.length) {
        if (a[ai] < c[bi]) {
            ai++;
        }
        else if (a[ai] > c[bi]) {
            bi++;
        }
        else {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }
    return result;
};

/**
 * transform string to numeric value
 * @returns {number}
 */
String.prototype.toCacheKey = function () {

    return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
};

/**
 * capitalize first letter
 * @returns {String}
 */
String.prototype.ucfirst = function () {

    return this.charAt(0).toUpperCase() + this.slice(1);
};