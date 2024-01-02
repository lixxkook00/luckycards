/**
 * Represents a typewriter effect for displaying text in a `Phaser.GameObjects.Text` object.
 */
export default class Typewriter extends Phaser.GameObjects.Text {
    reversedIndex = -1;

    /**
     * The current cursor index for typing.
     * @type {number}
     * @private
     */
    _cursorIndex = 0;

    /**
     * Indicates whether the typing is currently in reverse mode.
     * @type {boolean}
     */
    isReversed = false;

    /**
     * Creates a new Typewriter object.
     * @param {Phaser.Scene} scene - The scene that owns this game object.
     * @param {number} x - The x-coordinate of the game object in the scene.
     * @param {number} y - The y-coordinate of the game object in the scene.
     * @param {string} text - The initial text to be displayed.
     * @param {*} style - The style configuration for the text.
     */
    constructor(scene, x, y, text, style) {
        super(scene, x, y, '', style);
        scene.add.existing(this);
        this.setOrigin(0.5);

        /**
         * The placeholder text that will be typed out.
         * @type {string}
         */
        this.placeholder = text;

        /**
         * The Phaser.Time.TimerEvent used for typing.
         * @type {Phaser.Time.TimerEvent}
         */
        this.time = this.scene.time.addEvent({
            callback: () => this.update(),
            repeat: this.placeholder.length - 1,
            delay: 100,
            paused: true,
        });
    }

    /**
     * Gets the current cursor index for typing.
     * @returns {number} The current cursor index.
     */
    get cursorIndex() {
        return this.isReversed
            ? Math.max(this._cursorIndex--, 0)
            : Math.min(this._cursorIndex++, this.placeholder.length);
    }

    /**
     * Starts the typewriter effect.
     * @param {number} [timeScale=1] - The time scale for typing speed.
     * @returns {Typewriter} The Typewriter instance.
     */
    start(timeScale = 1) {
        this.time.paused = false;
        this.time.timeScale *= timeScale;
        return this;
    }

    /**
     * Sets the typing to reverse mode at a specified position.
     * @param {number} pos - The index at which the typing should be reversed.
     * @returns {Typewriter} The Typewriter instance.
     */
    reverseAt(pos) {
        this.isReversed = true;
        this.reversedIndex = pos;
        return this;
    }

    /**
     * Pauses the typewriter effect.
     * @returns {Typewriter} The Typewriter instance.
     */
    pause() {
        this.time.paused = true;
        return this;
    }

    /**
     * Resumes the typewriter effect.
     * @param {number} [timeScale] - The time scale for typing speed.
     * @returns {Typewriter} The Typewriter instance.
     */
    resume(timeScale) {
        return this.start(timeScale);
    }

    /**
     * Updates the text by appending the next character from the placeholder.
     */
    update() {
        this.text += this.placeholder.charAt(this.cursorIndex);
    }
}
