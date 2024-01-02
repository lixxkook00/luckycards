export default class Common {
    static 
    /**
     * Replaces all non-word characters followed by a word character with the capitalized one.
     * @param {string} string - The string to be camelCased.
     */
    CamelCase(string = '') {
        return string.replace(/\W+\w/g, (match) => match.slice(-1).toUpperCase());
    },
}