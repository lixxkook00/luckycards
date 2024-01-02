import ProgressTween from './ProgressTween';

/**
 * A progress bar that extends from Phaser's Container. It can contain a 3 slice Game Object as a filler and 9 slice object as background
 *
 * You can only stretch the filler horizontally.
 *
 * ```
 *      A                          B
 *    +---+----------------------+---+
 *    |   |                      |   |
 *  C | 1 |          2           | 3 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 * ```
 *
 * When changing this objects width (you cannot change its height)
 *
 *     areas 1 and 3 will remain unscaled
 *     area 2 will be stretched horizontally
 *
 * @reference {@link https://labs.phaser.io/edit.html?src=src/game%20objects/nine%20slice/progress%20bar.js}
 */
export default class ProgressSlice extends ProgressTween {
    /**
     * @param {Phaser.Scene} scene - The scene the progress bar belongs to.
     * @param {number} x - The x position of the progress bar.
     * @param {number} y - The y position of the progress bar.
     * @param {string|Phaser.Textures.Texture} texture - The texture key of the progress bar image.
     * @param {string|number} [frame] - The frame index of the progress bar image.
     * @param {number} [maxWidth] - The maximum width of the progress bar. You can adjust the width post-creation.
     * @param {number} [height] - The height of the progress bar, it will be fixed to the height of the texture and cannot be changed.
     * @param {number} [leftWidth] - The size of the left vertical column (A).
     * @param {number} [rightWidth] - The size of the right vertical column (B).
     */
    constructor(scene, x, y, texture, frame, maxWidth, height, leftWidth, rightWidth) {
        super(scene, x, y);

        /**
         * The maximum width of the progress bar.
         * @type {number}
         */
        this.maxWidth = maxWidth;

        /**
         * The background of the progress bar.
         * @type {Phaser.GameObjects.NineSlice}
         */
        this.background = null;

        /**
         * The text display of the progress bar.
         * @type {Phaser.GameObjects.Text}
         */
        this.text = null;

        /**
         * The fill of the progress bar.
         * @type {Phaser.GameObjects.NineSlice}
         */
        this.bar = scene.add
            .nineslice(-maxWidth / 2, 0, texture, frame, 0, height, leftWidth, rightWidth)
            .setOrigin(0, 0.5);
        this.add(this.bar);

        this.createTween();
    }

    /**
     * Gets the current value of the progress bar between 0 and 1.
     */
    get value() {
        return Math.min(this.bar.width / this.maxWidth, 1);
    }

    /**
     * Resizes a bar based on a given value.
     * @param {number} value - The value parameter is a number between 0 and 1 that represents the progress of some task or process.
     * The maximum width of the bar is multiplied by the value to determine the current width of the bar.
     */
    onUpdate(value) {
        this.bar.setSize(this.maxWidth * value, this.bar.height);
    }

    /**
     * Sets the background of the progress bar.
     * @param {number} x - The x position of the background.
     * @param {number} y - The y position of the background.
     * @param {string|Phaser.Textures.Texture} texture - The texture key of the background image.
     * @param {string|number} [frame] - The frame index of the background image.
     */
    setBackground(x, y, texture, frame) {
        if (this.background instanceof Phaser.GameObjects.GameObject)
            this.background.setPosition(x, y).setTexture(texture, frame);
        else {
            this.background = this.scene.add.nineslice(x, y, texture, frame);
            this.addAt(this.background, 0);
        }

        return this;
    }

    /**
     * Sets the text of the progress bar, it displays on top of the Progress Slice.
     * @param {string|string[]} text - The text this Text object will display.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} [style] - The Text style configuration object.
     */
    setText(text, style) {
        if (this.text instanceof Phaser.GameObjects.GameObject)
            this.text.setText(text).setStyle(style || this.text.style);
        else {
            this.text = this.scene.add.text(0, 0, text, style).setOrigin(0.5);
            this.add(this.text);
        }

        return this;
    }
}
