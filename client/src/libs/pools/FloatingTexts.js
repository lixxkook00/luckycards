/**
 * Represents a floating text that spawns and animates in the scene.
 */
class FloatingText extends Phaser.GameObjects.Text {
    /**
     * @param {Phaser.Scene} scene - The scene that owns this game object.
     */
    constructor(scene) {
        super(scene, 0, 0);
        this.setOrigin(0.5);
    }

    /**
     * Spawns the floating text at the specified coordinates and animates it.
     * @param {number} x - The x-coordinate of the spawn position.
     * @param {number} y - The y-coordinate of the spawn position.
     * @param {number} [duration=500] - The duration of the animation in milliseconds.
     */
    spawn(x, y, destroy, duration = 500) {
        this.setPosition(x, y).setActive(true).setVisible(true);

        const fadeOut = {
            alpha: 0,
            y: y - 40,
            delay: duration * 0.2,
            duration: duration * 0.4,
            ease: Phaser.Math.Easing.Quadratic.In,
        };
        const tweens = [{ scale: 0.8, alpha: 1, y: y - 20, duration: duration * 0.4, ease: Phaser.Math.Easing.Back.Out }];
        destroy && tweens.push(fadeOut);

        this.scene.tweens.chain({
            targets: this,
            tweens,
            onComplete: () => destroy && this.setActive(false).setVisible(false),
        });

        return this;
    }
}

/**
 * Represents a group of floating texts that can be spawned and managed.
 */
export default class FloatingTexts extends Phaser.GameObjects.Group {
    /**
     * @param {Phaser.Scene} scene - The scene that owns this group.
     * @param {number} [maxSize=10] - The maximum number of floating texts that can be in the group.
     * @param {string} [text=''] - The default text to use for the floating texts.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} [style={}] - The default style configuration for the floating texts.
     */
    constructor(scene, maxSize = 10, text = '', style = {}) {
        super(scene);

        /**
         * The class type used for the floating texts in the group.
         * @type {typeof FloatingText}
         */
        this.classType = FloatingText;

        /**
         * The maximum number of floating texts that can be in the group.
         * @type {number}
         */
        this.maxSize = maxSize;

        /**
         * The default text to use for the floating texts.
         * @type {string}
         */
        this.defaultText = text;

        /**
         * The default style configuration for the floating texts.
         * @type {Phaser.Types.GameObjects.Text.TextStyle}
         */
        this.defaultStyle = style;
    }

    /**
     * Spawns a floating text at the specified coordinates with the provided duration, text, and style.
     * @param {number} x - The x-coordinate of the spawn position.
     * @param {number} y - The y-coordinate of the spawn position.
     * @param {number} [duration] - The duration of the animation in milliseconds.
     * @param {string} [text] - The text to display in the floating text.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} [style] - The style configuration for the floating text.
     */
    spawn(x, y, destroy = true, duration, text = this.defaultText, style = this.defaultStyle) {
        /**
         * @type {FloatingText}
         */
        const item = this.get();
        item.setText(text).setStyle(style).spawn(x, y, destroy, duration);

        return item;
    }
}
