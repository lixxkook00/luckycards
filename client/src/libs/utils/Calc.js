/**
 * A utility object that provides various math functions.
 * @namespace Calc
 */
const Calc = {
    /**
     * Determines whether a value is numeric or a string that can be converted to a number.
     * @param {*} value - The value to check.
     */
    Numeric(value) {
        try {
            return Number.isFinite(Number(value));
        } catch (e) {
            console.error(`Calc.Numeric: ${e.message}`);
            return false;
        }
    },

    /**
     * Interpolates between two values.
     * @param {number} from - The starting value to interpolate from.
     * @param {number} to - The target value to interpolate towards.
     * @param {number} ratio - The amount to interpolate between the two values.
     */
    Lerp(from, to, ratio) {
        try {
            validateParams('Calc.Lerp', { from, to, ratio });
            return from * (1 - ratio) + to * ratio;
        } catch (e) {
            console.error(`${e.message}`);
            return 0;
        }
    },

    /**
     * Returns true if the value is in the range, and false if it is not.
     * @param {number} value The value to check if it's in range.
     * @param {number} first The first value in the range.
     * @param {number} last The last value in the range.
     * @param {boolean} [endpointIncluded=true] Specify whether the endpoints are included in the range.
     * */
    IsBetween(value, first, last, endpointIncluded = true) {
        try {
            validateParams('Calc.IsBetween', { value, first, last });
            first > last && ([first, last] = [last, first]);
            return endpointIncluded
                ? value >= first && value <= last
                : value > first && value < last;
        } catch (e) {
            console.error(`${e.message}`);
            return false;
        }
    },

    /**
     * Returns a random value from an object.
     * @param {object} object The object you want to get a random value from.
     */
    GetRandomProp(object) {
        try {
            let keys = Object.keys(object);
            return object[keys[(keys.length * Math.random()) << 0]];
        } catch (e) {
            console.error(`Calc.GetRandomProp: ${e.message}`);
            return null;
        }
    },

    /**
     * Generates a random string of a specified length using a combination of uppercase and lowercase letters and numbers.
     * @param {number} [length=1] - The desired length of the random string.
     */
    GetRandomString(length = 1) {
        try {
            let res = '';
            const char =
                'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const crypto = window.crypto || window.msCrypto;
            const a = new Uint8Array(length);

            crypto.getRandomValues(a);
            a.forEach((v) => (res += char[v % char.length]));
            return res;
        } catch (e) {
            console.error(`Calc.GetRandomString: ${e.message}`);
            return null;
        }
    },

    ...Phaser.Math,
};

export default Calc;

/**
 * Validates the parameters of a function.
 * @param {string} funcName - The name of the function being called.
 * @param {object} params - An object containing the parameters passed to the function.
 * @throws {Error} If any of the parameters are invalid.
 */
function validateParams(funcName, params) {
    for (const param in params)
        if (!Calc.Numeric(params[param]))
            throw new Error(
                `${funcName}: '${param}' value must be a number or a string that can be converted to a number. (reading ${params[param]})`
            );
}
