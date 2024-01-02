import ProgressTween from './ProgressTween';

/**
 * Enum representing the types of rendering for the progress pie.
 * @enum {Object}
 */
const TYPE = { NONE: 0, TEXTURE: 1, COLOR: 2, GRADIENT: 3 };

/**
 * Class representing a progress bar.
 */
export default class ProgressBar extends ProgressTween {
    renderType = TYPE.NONE;
    barWidth = 0;
    barHeight = 0;
    paddingX = 0;
    paddingY = 0;

    /**
     * @default 0x000000
     */
    borderColor = 0x000000;

    /**
     * @default 0x00ff00
     */
    fillColor = 0x00ff00;

    /**
     * Creates a progress bar.
     * @constructor
     * @param {Phaser.Scene} scene - The Phaser scene to create the progress bar in.
     * @param {number} x - The x coordinate of the progress bar in the scene.
     * @param {number} y - The y coordinate of the progress bar in the scene.
     */
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        /**
         * The graphics object to render the progress bar.
         * @type {Phaser.GameObjects.Graphics}
         */
        this.bar = scene.add.graphics();
        this.add(this.bar);
    }

    /**
     * Draws the progress bar.
     * @param {number} value - The value to draw.
     */
    onUpdate(value) {
        this.value = value;
        this.bar.clear();

        switch (this.renderType) {
            case TYPE.COLOR:
                this.bar.fillStyle(this.borderColor);
                this.bar.fillRoundedRect(-this.barWidth / 2, -this.barHeight / 2, this.barWidth, this.barHeight, 3);

                const x = -this.barWidth / 2 + this.paddingX;
                const y = -this.barHeight / 2 + this.paddingY;
                const width = this.barWidth - this.paddingX * 2;
                const height = this.barHeight - this.paddingY * 2;

                this.bar.fillStyle(0xffffff).fillRoundedRect(x, y, width, height, 3);
                this.bar.fillStyle(this.fillColor).fillRoundedRect(x, y, width * this.value, height, 3);
                break;
            case TYPE.TEXTURE:
                const rect = this.texture.getBounds();
                this.bar.clear();
                this.bar.fillStyle(0x000000, 0);
                this.bar.fillRect(rect.x, rect.y, rect.width * this.value, rect.height);
                break;
        }
    }

    /**
     * Sets the color properties of the progress bar.
     * @param {ProgressBarColorConfig} config - The configuration object for the color.
     */
    setColor(width, height, px, py, borderColor, fillColor) {
        this.barWidth = width;
        this.barHeight = height;
        this.paddingX = px;
        this.paddingY = py;
        this.borderColor = borderColor || 0x000000;
        this.fillColor = fillColor || 0x00ff00;

        this.renderType = TYPE.COLOR;
        this.createTween();
        return this;
    }

    /**
     * Sets the texture of the progress bar.
     * @param {string} texture - The name of the texture to use.
     * @param {string} frame - The name of the texture frame to use.
     */
    setTexture(texture, frame) {
        const mask = this.bar.createGeometryMask();
        this.texture = this.scene.add.image(0, 0, texture, frame).setMask(mask);
        this.add(this.texture);

        this.renderType = TYPE.TEXTURE;
        this.createTween();
        return this;
    }

    /**
     * Sets the background image of the progress bar.
     * @param {number} x - The x coordinate of the background image.
     * @param {number} y - The y coordinate of the background image.
     * @param {string} texture - The name of the texture to use for the background.
     * @param {string} frame - The name of the texture frame to use for the background.
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
     * Sets the text to display with the progress bar.
     * @param {string} text - The text to display.
     * @param {Object} style - The style object to use for the displayed text.
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
