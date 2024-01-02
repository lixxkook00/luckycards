/**
 * Configuration object for text styles.
 * @typedef {Object<string, Phaser.Types.GameObjects.Text.TextStyle>} TextStyleConfig
 */

/**
 * Object containing text styles.
 */
const TEXT_STYLES = {
    LOADING: {
        fontFamily: 'FontPrimary',
        fontSize: 28,
        align: 'center',
        fill: '#fce800',
        stroke: '#F68A22',
        strokeThickness: 8,
    },

    HUD_NUM: {
        fontFamily: 'FontPrimary',
        fontSize: 48,
        align: 'center',
        fill: '#fce800',
    },

    HUD_TEXT: {
        fontFamily: 'FontPrimary',
        fontSize: 43,
        align: 'center',
        fill: '#fce800',
        stroke: '#F68A22',
        strokeThickness: 2,
    },

    LEVEL: {
        fontFamily: 'FontPrimary',
        fontSize: 43,
        align: 'center',
        fill: '#fce800',
        stroke: '#F68A22',
        strokeThickness: 5,
    },

    POPUP: {
        fontFamily: 'FontPrimary',
        fontSize: 80,
        align: 'center',
        fill: '#fce800',
        stroke: '#194683',
        strokeThickness: 8,
    },

    SCORE_BOX: {
        fontFamily: 'FontPrimary',
        fontSize: 60,
        align: 'center',
        fill: '#ffffff',
    },

    END: {
        fontFamily: 'FontPrimary',
        fontSize: 22,
        align: 'center',
        fill: '#fce800',
        stroke: '#F68A22',
        strokeThickness: 8,
    },

    END_SCORE: {
        fontFamily: 'FontPrimary',
        fontSize: 40,
        align: 'center',
        fill: '#ffffff',
    },

    TIMES_UP: {
        fontFamily: 'FontPrimary',
        fontSize: 80,
        align: 'center',
        fill: '#fff',
        stroke: '#111e4c',
        strokeThickness: 8,
    },
};

export default Object.freeze(TEXT_STYLES);
