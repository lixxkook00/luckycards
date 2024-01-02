import ProgressTween from './ProgressTween';

/**
 * Enum representing the types of rendering for the progress pie.
 * @enum {number}
 */
const TYPE = { NONE: 0, TEXTURE: 1, COLOR: 2 };

/**
 * Class representing a progress pie.
 */
export default class ProgressPie extends ProgressTween {
    renderType = TYPE.NONE;
    radius = 0;
    borderWidth = 0;
    fillWidth = 0;

    /**
     * @default 0x000000
     */
    borderColor = 0x000000;

    /**
     * @default 0x00ff00
     */
    fillColor = 0x00ff00;

    /**
     * @param {Phaser.Scene} scene - The Phaser scene to create the progress pie in.
     * @param {number} x - The x coordinate of the progress pie in the scene.
     * @param {number} y - The y coordinate of the progress pie in the scene.
     * @param {number} [startAngle=0] - The angle to start the arc in degrees.
     * @param {number} [endAngle=360] - The end angle of the arc in degrees. Must be greater than start.
     * @param {boolean} [anticlockwise=false] - The direction of the progress pie. Default `false`.
     * @param {number} [overshoot=0.02] - The amount of overshoot when drawing the pie. Default `0.02`.
     */
    constructor(scene, x, y, startAngle = 0, endAngle = 360, anticlockwise = false, overshoot = 0.02) {
        super(scene, x, y);
        scene.add.existing(this);

        this.startAngle = Phaser.Math.DegToRad(startAngle);
        this.endAngle = Phaser.Math.DegToRad(endAngle);

        /**
         * The direction of the progress pie.
         * @type {boolean}
         */
        this.anticlockwise = anticlockwise;

        /**
         * The overshoot value for the arc rendering.
         * @type {number}
         */
        this.overshoot = overshoot;

        /**
         * The graphics object used to render the progress pie.
         * @type {Phaser.GameObjects.Graphics}
         */
        this.pie = this.scene.add.graphics().setAngle(-90);
        this.add(this.pie);
    }

    /**
     * Get the current progress of the progress pie in radians.
     * @type {number}
     */
    get progress() {
        return this.startAngle + (this.endAngle - this.startAngle) * this.value;
    }

    /**
     * Render the pie based on its render type.
     * @param {number} value - The value of the progress (between 0 and 1).
     */
    onUpdate(value) {
        this.value = value;
        this.pie.clear();

        switch (this.renderType) {
            case TYPE.COLOR:
                this.pie.lineStyle(this.borderWidth, this.borderColor).beginPath();
                this.pie.arc(0, 0, this.radius, this.startAngle, this.endAngle, this.anticlockwise, this.overshoot);
                this.pie.strokePath().closePath().beginPath();

                this.pie.lineStyle(this.fillWidth, this.fillColor);
                this.pie.arc(0, 0, this.radius, this.startAngle, this.progress, this.anticlockwise, this.overshoot);
                this.pie.strokePath().closePath();
                break;
            case TYPE.TEXTURE:
                const rect = this.pie.getBounds();
                const radius = Math.max(rect.width, rect.height) / 2;
                this.pie
                    .fillStyle(0x000000, 0.2)
                    .slice(0, 0, radius, this.startAngle, this.endAngle, this.anticlockwise)
                    .fillPath();
                break;
            default:
                break;
        }
    }

    /**
     * Set the color rendering properties of the progress pie.
     * @param {number} radius - The radius of the progress pie.
     * @param {number} borderWidth - The width of the border for color rendering.
     * @param {number} fillWidth - The width of the fill for color rendering.
     * @param {number} borderColor - The color of the border for color rendering (in hexadecimal format).
     * @param {number} fillColor - The color of the fill for color rendering (in hexadecimal format).
     * @returns {Phaser.Tweens.Tween} - The created tween object.
     */
    setColor(radius, borderWidth, fillWidth, borderColor, fillColor) {
        this.radius = radius;
        this.borderWidth = borderWidth;
        this.fillWidth = fillWidth;
        this.borderColor = borderColor;
        this.fillColor = fillColor;

        this.renderType = TYPE.COLOR;
        this.createTween();
        return this;
    }

    /**
     * Set the start angle of the progress pie.
     * @param {number} value - The start angle in degrees.
     * @returns {ProgressPie} - The ProgressPie instance.
     */
    setStartAngle(value) {
        this.startAngle = Phaser.Math.DegToRad(value);
        return this;
    }

    /**
     * Set the end angle of the progress pie.
     * @param {number} value - The end angle in degrees.
     * @returns {ProgressPie} - The ProgressPie instance.
     */
    setEndAngle(value) {
        this.endAngle = Phaser.Math.DegToRad(value);
        return this;
    }

    /**
     * Set the direction of the progress pie.
     * @param {boolean} value - The direction of the progress pie.
     * @returns {ProgressPie} - The ProgressPie instance.
     */
    setAnticlockwise(value) {
        this.anticlockwise = value;
        return this;
    }
}
