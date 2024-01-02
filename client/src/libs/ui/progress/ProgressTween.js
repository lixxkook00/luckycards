/**
 * Represents a mixin class for creating and updating numeric tween animations.
 *
 * This class provides functionality for creating and updating tween animations for numeric values.
 */
export default class ProgressTween extends Phaser.GameObjects.Container {
    value = 0;
    valueMax = 0;

    /**
     * @param {Phaser.Scene} scene - The scene to which this container belongs.
     * @param {number} x - The x-coordinate of the container.
     * @param {number} y - The y-coordinate of the container.
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);
    }

    /**
     * Creates a tween animation for a value.
     * @param {number} value - The starting value of the tween animation.
     * @param {number} max - The target value of the tween animation.
     * @param {number} duration - The duration of the tween animation in milliseconds. Default is 500ms.
     */
    createTween(value, max, duration = 500) {
        this.tween = this.scene.tweens.addCounter({
            from: value || this.value,
            to: max || this.valueMax,
            duration: duration,
            ease: Phaser.Math.Easing.Cubic.InOut,
            onUpdate: (tw) => this.onUpdate(tw.getValue()),
        });

        return this;
    }

    /**
     * Updates the value of the tween animation.
     * @param {number} value - The new value for the tween animation.
     * @param {number} max - The target value of the tween animation.
     * @param {number} duration - The duration of the tween animation in milliseconds.
     */
    update(value, max, duration) {
        if (this.tween && this.tween.isPlaying()) this.tween.updateTo('value', value);
        else this.createTween(value, max, duration);
    }

    /**
     * Method to override. Called when the tween animation updates.
     */
    onUpdate() {}
}
