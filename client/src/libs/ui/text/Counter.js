import ProgressTween from '../progress/ProgressTween';

/**
 * @reference {@link https://labs.phaser.io/edit.html?src=src/tweens/counter%20tween.js}
 */
export default class Counter extends ProgressTween {
    /**
     * @param {Phaser.Scene} scene - The scene that owns this game object.
     * @param {number} x - The x-coordinate of the game object in the scene.
     * @param {number} y - The y-coordinate of the game object in the scene.
     * @param {string} text - The initial value of the counter as a string.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} style - The style configuration for the text.
     */
    constructor(scene, x, y, text, style) {
        super(scene, x, y);
        scene.add.existing(this);

        // try {
        //     if (!Number.isFinite(Number(text))) throw new Error(`Invalid counter value: '${text}' is not a number.`);
        // } catch (error) {
        //     console.error(error.message);
        // }

        /**
         * The text object representing the counter value.
         * @type {Phaser.GameObjects.Text}
         */
        this.text = scene.add.text(0, 0, text, style).setOrigin(0.5);
        this.add(this.text);
    }

    /**
     * Updates the value of the counter and the displayed text.
     * @param {number} value - The new value of the counter.
     */
    onUpdate(value) {
        this.value = Math.floor(Number(this.text.text));
        this.text.setText(Math.floor(value));
    }
}
