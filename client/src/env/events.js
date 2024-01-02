/** An object containing all event constants. */
const EVENT = {
    MAIN: {
        /** Track when the rich media has been loaded. */
        IMPRESSION: 'ta-imp',
        /** Track when the rich media has been loaded and the dimension of the user's device. */
        VIEWPORT_SIZE: `viewport-dimension`,
        /** Track when the rich media has been loaded and the dimension of the user's device. */
        CREATIVE_SIZE: `creative-dimension`,
        /** Users' first engagement. */
        START: 'Start Game',
        /** Users actively played half the rich media length. */
        ACTIVE: 'Active Play',
        ACTIVE_AUTO: 'Active play Auto',
        /** Users completed rich media play through. */
        COMPLETE: 'Complete',
        /** Users replay rich media. */
        REPLAY: 'Replay',
        /** Users click through the CTA button. */
        CTA: 'Discover More',
        /** Track the seconds user spent in the rich media (span from 5 to 120s, 5s step, under name “dwell-5”, “dwell-10”, …, “dwell-120”). */
        DWELL_TIME: 'dwell-',
        /** User taps on the “Mute” button. */
        MUTE: 'Mute Theme',
        /** User taps on the “Unmute” button. */
        UNMUTE: 'Unmute Theme',
    },

    GAME : {
        ACTIVE_LEVEL : 2,
        MAX_LEVEL : 3,
    },

    VIDEO: {
        /** Users replay video. */
        REPLAY: 'Video Replay',
        /** User taps on the “Mute Video” button. */
        MUTE: 'Video Mute',
        /** User taps on the “Unmute Video” button. */
        UNMUTE: 'Video Unmute',
    },

    CONTENT: {},
};

export default Object.freeze(EVENT);
