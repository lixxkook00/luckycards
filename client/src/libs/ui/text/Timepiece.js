import Timer from '../Timer';

/**
 * Represents a chronometer that counts down from a specified duration.
 * @extends Phaser.GameObjects.Container
 */
export default class Timepiece extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene - The scene that owns this game object.
     * @param {number} x - The x-coordinate of the game object in the scene.
     * @param {number} y - The y-coordinate of the game object in the scene.
     * @param {number} duration - The duration of the chronometer in seconds.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} style - The style configuration for the text.
     */
    constructor(scene, x, y, duration, style) {
        super(scene, x, y);
        scene.add.existing(this);

        try {
            if (!Number.isFinite(Number(duration)))
                throw new Error(`Invalid counter value: '${duration}' is not a number.`);
        } catch (error) {
            console.error(error.message);
        }

        /**
         * The timer object managing the chronometer.
         * @type {Timer}
         */
        this.clock = new Timer(duration);

        /**
         * The text object displaying the remaining time.
         * @type {Phaser.GameObjects.Text}
         */
        this.text = this.scene.add.text(0, 0, duration, style).setOrigin(0.5);
        this.add(this.text);
    }

    /**
     * Sets the background image of the chronometer.
     * @param {number} x - The x-coordinate of the background image.
     * @param {number} y - The y-coordinate of the background image.
     * @param {string} texture - The key of the texture to be used for the background image.
     * @param {string|number} frame - The key or index of the frame within the texture to be used for the background image.
     * @returns {Chronometer} The Chronometer instance.
     */
    setBackground(x, y, texture, frame) {
        if (this.background instanceof Phaser.GameObjects.GameObject)
            this.background.setPosition(x, y).setTexture(texture, frame);
        else {
            this.background = this.scene.add.image(x, y, texture, frame);
            this.addAt(this.background, 0);
        }

        return this;
    }

    /**
     * Updates the chronometer.
     * @param {number} delta - The time elapsed since the last update in milliseconds.
     */
    update(delta) {
        this.clock.update(delta);
        this.text.setText(Math.ceil(this.clock.remainTime));
    }
}
