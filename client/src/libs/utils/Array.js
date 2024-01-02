/**
 * A collection of utility functions for working with arrays.
 * @namespace ArrayUtils
 */
const ArrayUtils = {
    /**
     * Returns the sum of all the numbers in an array.
     * @param {number[]} array - The array of numbers to sum.
     * @returns {number} The sum of the numbers in the array.
     */
    Sum(array = []) {
        try {
            return array.reduce((a, b) => a + b, 0);
        } catch (error) {
            console.error(`ArrayUtils.Sum: ${error.message}`);
            throw error;
        }
    },

    /**
     * Returns true if the argument is an array of arrays, and false otherwise.
     * @param {*} arg - The argument to check.
     * @returns {boolean} True if the argument is an array of arrays, false otherwise.
     */
    IsNested(arg) {
        try {
            return Array.isArray(arg) && arg.every((e) => Array.isArray(e));
        } catch (error) {
            console.error(`ArrayUtils.IsNested: ${error.message}`);
            throw error;
        }
    },

    /**
     * Checks if all the arrays passed to it have at least one common element.
     * @param {...any[]} arrays - The arrays to check.
     * @returns {boolean} True if all the arrays have at least one common element, false otherwise.
     */
    HasCommonElement(...arrays) {
        try {
            return arrays.every((arr) => arr.some((el) => arrays.every((a) => a.includes(el))));
        } catch (error) {
            console.error(`ArrayUtils.HasCommonElement: ${error.message}`);
            throw error;
        }
    },

    /**
     * Splits an array into chunks of a specified size.
     * @param {any[]} array - The array to split.
     * @param {number} size - The size of each chunk.
     * @returns {any[][]} An array of chunk arrays.
     */
    Chunk(array, size = 1) {
        try {
            return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
                array.slice(i * size, i * size + size)
            );
        } catch (error) {
            console.error(`ArrayUtils.Chunk: ${error.message}`);
            throw error;
        }
    },

    /**
     * Returns a new copy of an array with all falsy values removed.
     * @param {any[]} array - The array to remove falsy values from.
     * @returns {any[]} A new array with all falsy values removed.
     */
    Compact(array) {
        try {
            return array.filter(Boolean);
        } catch (error) {
            console.error(`ArrayUtils.Compact: ${error.message}`);
            throw error;
        }
    },

    /**
     * Rotates an array in a circular fashion around a specified element.
     * @param {any[]} array - The array to rotate.
     * @param {*} element - The element around which to rotate the array.
     * @param {boolean} anticlockwise - Whether to rotate the array in a counter-clockwise direction.
     * @returns {any[]} A new array that is a circular rotation of the input array.
     */
    Rotate(array, element, anticlockwise) {
        try {
            const index = array.indexOf(element);
            if (index === -1) throw new Error(`ArrayUtils.Rotate: Element ${element} not found in array.`);

            const offset = anticlockwise ? -1 : 1;
            return array.reduce((rotated, _, i) => [...rotated, array[(i - offset + array.length) % array.length]], []);
        } catch (error) {
            console.error(`ArrayUtils.Rotate: ${error.message}`);
            throw error;
        }
    },
};

export default ArrayUtils;
