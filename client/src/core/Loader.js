export default class FileLoader {
    /**
     * Returns an array of objects containing image file configuration.
     * @param {string} extension - The file extension of the images (e.g. '.jpg', '.png').
     * @param {string[]} files - An array of image file names.
     * @returns {Phaser.Types.Loader.FileTypes.ImageFileConfig[]} - An array of objects containing the image file name, URL, and extension.
     */
    getImage(extension, ...files) {
        return files.map((key) => ({ key, url: `images/${key}`, extension }));
    }

    /**
     * Returns an array of objects containing texture atlas configuration.
     *
     * @param {string[]} files - An array of texture atlas names (without the file extension).
     * @returns {Phaser.Types.Loader.FileTypes.AtlasJSONFileConfig[]} - An array of objects containing the texture atlas name, texture URL, and atlas URL.
     */
    getAtlas(...files) {
        return files.map((key) => ({
            key,
            textureURL: `images/${key}.png`,
            atlasURL: `images/${key}.json`,
        }));
    }

    /**
     * Returns an array of objects containing animation configuration.
     * @param {string[]} files - An array of json file names.
     * @returns {Phaser.Types.Loader.FileTypes.JSONFileConfig[]} - An array of objects containing the JSON key and utl.
     */
    getJSON(...files) {
        return files.map((key) => ({ key, url: `images/${key}.json` }));
    }

    getMedia(path) {
        return process.env.platform === 'studio' && Enabler.isServingInLiveEnvironment() ? Enabler.getUrl(path) : path;
    }
}
