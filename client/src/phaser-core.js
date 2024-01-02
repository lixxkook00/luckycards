/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

require('phaser/src/polyfills/requestVideoFrame');

var CONST = require('phaser/src/const');
var Extend = require('phaser/src/utils/object/Extend');

/**
 * @namespace Phaser
 */

var Phaser = {
    Animations: require('phaser/src/animations'),
    BlendModes: require('phaser/src/renderer/BlendModes'),
    Cache: require('phaser/src/cache'),
    Cameras: { Scene2D: require('phaser/src/cameras/2d') },
    Core: require('phaser/src/core'),
    Class: require('phaser/src/utils/Class'),
    Data: require('phaser/src/data'),
    Display: {
        Masks: require('phaser/src/display/mask'),
        Color: require('phaser/src/display/color'),
    },
    DOM: require('phaser/src/dom'),
    Events: require('phaser/src/events'),
    FX: require('phaser/src/fx'),
    Game: require('phaser/src/core/Game'),
    GameObjects: require('phaser/src/gameobjects'),
    Geom: require('phaser/src/geom'),
    Input: require('phaser/src/input'),
    Loader: {
        Events: require('phaser/src/loader/events'),
        FileTypes: {
            AnimationJSONFile: require('phaser/src/loader/filetypes/AnimationJSONFile'),
            AtlasJSONFile: require('phaser/src/loader/filetypes/AtlasJSONFile'),
            AudioFile: require('phaser/src/loader/filetypes/AudioFile'),
            AudioSpriteFile: require('phaser/src/loader/filetypes/AudioSpriteFile'),
            CSSFile: require('phaser/src/loader/filetypes/CSSFile'),
            GLSLFile: require('phaser/src/loader/filetypes//GLSLFile'),
            HTML5AudioFile: require('phaser/src/loader/filetypes/HTML5AudioFile'),
            ImageFile: require('phaser/src/loader/filetypes/ImageFile'),
            JSONFile: require('phaser/src/loader/filetypes/JSONFile'),
            MultiAtlasFile: require('phaser/src/loader/filetypes/MultiAtlasFile'),
            PluginFile: require('phaser/src/loader/filetypes/PluginFile'),
            ScriptFile: require('phaser/src/loader/filetypes/ScriptFile'),
            SpriteSheetFile: require('phaser/src/loader/filetypes/SpriteSheetFile'),
            TextFile: require('phaser/src/loader/filetypes/TextFile'),
            XMLFile: require('phaser/src/loader/filetypes/XMLFile'),
            VideoFile: require('phaser/src/loader/filetypes/VideoFile'),
        },
        File: require('phaser/src/loader/File'),
        FileTypesManager: require('phaser/src/loader/FileTypesManager'),
        GetURL: require('phaser/src/loader/GetURL'),
        LoaderPlugin: require('phaser/src/loader/LoaderPlugin'),
        MergeXHRSettings: require('phaser/src/loader/MergeXHRSettings'),
        MultiFile: require('phaser/src/loader/MultiFile'),
        XHRLoader: require('phaser/src/loader/XHRLoader'),
        XHRSettings: require('phaser/src/loader/XHRSettings'),
    },
    Math: require('phaser/src/math'),
    Plugins: require('phaser/src/plugins'),
    Renderer: require('phaser/src/renderer'),
    Scale: require('phaser/src/scale'),
    ScaleModes: require('phaser/src/renderer/ScaleModes'),
    Scene: require('phaser/src/scene/Scene'),
    Scenes: require('phaser/src/scene'),
    Structs: require('phaser/src/structs'),
    Textures: require('phaser/src/textures'),
    Time: require('phaser/src/time'),
    Tweens: require('phaser/src/tweens'),
    Utils: require('phaser/src/utils'),
};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND) {
    Phaser.Sound = require('phaser/src/sound');
}

//   Merge in the consts

Phaser = Extend(false, Phaser, CONST);

/**
 * The root types namespace.
 *
 * @namespace Phaser.Types
 * @since 3.17.0
 */

//  Export it

module.exports = Phaser;

global.Phaser = Phaser;

/*
 * "Documentation is like pizza: when it is good, it is very, very good;
 * and when it is bad, it is better than nothing."
 *  -- Dick Brandon
 */
