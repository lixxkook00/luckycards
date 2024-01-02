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
    Actions: require('phaser/src/actions'),
    Animations: require('phaser/src/animations'),
    BlendModes: require('phaser/src/renderer/BlendModes'),
    Cache: require('phaser/src/cache'),
    Cameras: require('phaser/src/cameras'),
    Core: require('phaser/src/core'),
    Class: require('phaser/src/utils/Class'),
    Create: require('phaser/src/create'),
    Curves: require('phaser/src/curves'),
    Data: require('phaser/src/data'),
    Display: require('phaser/src/display'),
    DOM: require('phaser/src/dom'),
    Events: require('phaser/src/events'),
    FX: require('phaser/src/fx'),
    Game: require('phaser/src/core/Game'),
    GameObjects: require('phaser/src/gameobjects'),
    Geom: require('phaser/src/geom'),
    Input: require('phaser/src/input'),
    Loader: require('phaser/src/loader'),
    Math: require('phaser/src/math'),
    Physics: require('phaser/src/physics'),
    Plugins: require('phaser/src/plugins'),
    Renderer: require('phaser/src/renderer'),
    Scale: require('phaser/src/scale'),
    ScaleModes: require('phaser/src/renderer/ScaleModes'),
    Scene: require('phaser/src/scene/Scene'),
    Scenes: require('phaser/src/scene'),
    Structs: require('phaser/src/structs'),
    Textures: require('phaser/src/textures'),
    Tilemaps: require('phaser/src/tilemaps'),
    Time: require('phaser/src/time'),
    Tweens: require('phaser/src/tweens'),
    Utils: require('phaser/src/utils'),
};

//  Merge in the optional plugins and WebGL only features

if (typeof FEATURE_SOUND) {
    Phaser.Sound = require('phaser/src/sound');
}

if (typeof PLUGIN_CAMERA3D) {
    Phaser.Cameras.Sprite3D = require('.phaser/src/plugins/camera3d/src');
    Phaser.GameObjects.Sprite3D = require('.phaser/src/plugins/camera3d/src/sprite3d/Sprite3D');
    Phaser.GameObjects.Factories.Sprite3D = require('.phaser/src/plugins/camera3d/src/sprite3d/Sprite3DFactory');
    Phaser.GameObjects.Creators.Sprite3D = require('.phaser/src/plugins/camera3d/src/sprite3d/Sprite3DCreator');
}

if (typeof PLUGIN_FBINSTANT) {
    Phaser.FacebookInstantGamesPlugin = require('.phaser/src/plugins/fbinstant/src/FacebookInstantGamesPlugin');
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
