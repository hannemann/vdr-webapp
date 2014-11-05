/**
 * Provide additional math methods
 */

if ("undefined" === typeof Math.degToRad) {

    /**
     * convert degrees to radians
     * @param deg
     * @returns {number}
     */
    Math.degToRad = function (deg) {

        return deg * this.PI / 180;
    }
}
if ("undefined" === typeof Math.radToDeg) {

    /**
     * convert radians to degrees
     * @param rad
     * @returns {number}
     */
    Math.radToDeg = function (rad) {

        return rad * 180 / this.PI;
    }
}
Math.Triangle = {

    /**
     * compute length of cathetus by angle and diameter of circumcircle
     * @param angle
     * @param circumcircleDiameter
     * @returns {number}
     */
    "getLengthByAngleAndDiameter" : function (angle, circumcircleDiameter) {

        return circumcircleDiameter * Math.sin(Math.degToRad(angle));
    },

    /**
     * compute missing angle
     * @param {Number} alpha
     * @param {Number} beta
     * @returns {number}
     */
    "getAngle" : function (alpha, beta) {
        return 180 - alpha - beta;
    },

    /**
     * Compute diameter of circumcircle by given angle
     * and length of opposite cathetus
     * @param {Number} angle
     * @param {Number} length
     * @returns {number}
     */
    "getCircumcircleDiameter" : function (angle, length) {

        return length / Math.sin(Math.degToRad(angle));
    }
};