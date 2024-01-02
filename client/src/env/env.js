import { FileLoader, GameConfig } from '../core';

const ratio = window.innerWidth / window.innerHeight;
const MAX_HEIGHT = 1024;
const MAX_WIDTH = 768;
const MIN_WIDTH = 682;
let WIDTH = ratio <= 2 / 3 ? MIN_WIDTH : ratio > 3 / 4 ? MAX_WIDTH : MAX_HEIGHT * ratio;
let HEIGHT = MAX_HEIGHT;
const OFFSET = (WIDTH - MIN_WIDTH) / 2;
const RATIO = WIDTH / HEIGHT;

const LAYER = { BACKGROUND: 0, DEFAULT: 1, HUD: 2, OVERLAY: 3, POPUP: 4, DEBUG: 5 };
const SCENE = {
    BOOT: 'Boot',
    PRELOADER: 'Preloader',
    MAIN_MENU: 'MainMenu',
    PLAY: 'Play',
    END: 'End',
    UI: 'UIScene',
};
const STATIC_PATH = process.env.platform === 'studio' ? '' : 'static/';
const loader = new FileLoader();
const game = new GameConfig(WIDTH, HEIGHT, STATIC_PATH);

/**
 * Environment Variables.
 */
const ENV = {
    WIDTH: WIDTH,
    HEIGHT: HEIGHT,
    CENTER_X: WIDTH / 2,
    CENTER_Y: HEIGHT / 2,
    OFFSET,
    RATIO,
    LAYER,
    SCENE,
    STATIC_PATH,
    CONFIG: game.config,
    MAX_GAME_TIME: 3,

    LOADER: {
        BOOT: loader.getAtlas('boot'),
        ATLAS: loader.getAtlas('atlas'),
        ANIMATION: loader.getAtlas('animation'),
        UPDATE: loader.getAtlas('update'),
        VIDEO: loader.getMedia(`${STATIC_PATH}tvc.mp4`),
    },

    /**
     * @type {CSSRuleList}
     */
    FONT_RULE: [
        {
            fontFamily: 'FontPrimary',
            src: `url('./${STATIC_PATH}fonts/InspireTWDC-Black.woff') format('woff'),url('./${STATIC_PATH}fonts/InspireTWDC-Black.woff2') format('woff2')`,
        },
        {
            fontFamily: 'FontSecondary',
            src: `url('./${STATIC_PATH}fonts/InspireTWDC-Medium.woff') format('woff'),url('./${STATIC_PATH}fonts/InspireTWDC-Medium.woff2') format('woff2')`,
        },
    ],

    CARD_GAP: 78,
};

export default Object.freeze(ENV);
