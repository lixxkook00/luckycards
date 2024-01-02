import Calc from './Calc';

const Common = {
    /**
     * Returns the scene property of an object or the first object in an array.
     * @param {Phaser.GameObjects.GameObject} targets - The `targets` parameter is an array or object that contains one or more elements.
     */
    GetScene(targets) {
        return targets.scene || targets[0].scene;
    },

    /**
     * Returns the first argument if it is not `null` or `undefined`,
     * otherwise returns the second argument or the result of the alternative function (if provided).
     * @param {*} value - The value to check.
     * @param {*} alternative - The alternative value or function to return or evaluate if the first argument is `null` or `undefined`.
     */
    Define(value, alternative) {
        return value !== undefined && value !== null
            ? value
            : typeof alternative === 'function'
            ? alternative()
            : alternative;
    },

    /**
     * Calls a callback function on a set of targets, either a single target or an array of targets.
     * @param {object|Array<object>} targets - The target or array of targets to call the callback on.
     * @param {function} callback - The callback function to call on the targets.
     */
    CallOnTargets(targets, callback) {
        if (typeof callback !== 'function')
            return console.warn('Invalid callback');

        if (targets.scene) callback.call(null, targets);
        else targets.length && targets.forEach(callback);
    },

    /**
     * Checks whether all arguments are numeric.
     * @param {...number} args - The arguments to check.
     * @throws {TypeError} If any argument is not numeric.
     */
    VerifyNumericArgs(...args) {
        if (args.some((val) => !Calc.Numeric(val)))
            throw new TypeError('Arguments must be numeric');
    },

    Validate(funcName) {
        
    },

    /**
     * Generates an array of frame names based on a prefix and total number of frames.
     * @param {string} prefix - The prefix to be used for each frame name.
     * @param {number} totalFrames - The total number of frames to generate.
     * @returns {string[]} An array of frame names.
     */
    GenerateFrameNames(prefix, totalFrames) {
        const frameNames = [];
        
        for (let i = 1; i <= totalFrames; i++) {
            const frameName = `${prefix}${i}`;
            frameNames.push(frameName);
        }
    
        return frameNames;
    }
};

export default Common;
