/**
 * Creates a background that is infinitely scrolling.
 */
export class ScrollingBackground extends Phaser.GameObjects.Container {
    /**
     * This is a constructor function that creates a scrolling background by adding multiple instances
     * of an image to a Phaser scene.
     * @param {ScrollingBackgroundConfig} config It is a configuration object that contains the necessary parameters for creating
     * an instance of this class.
     */
    constructor(config) {
        super(config.scene, 0, config.y);
        scene.add.existing(this);

        this.acceleration = config.acceleration;
        this.texture = this.scene.add
            .image(0, 0, config.texture, config.frame)
            .setOrigin(0, config.originY);
        this.add(this.texture);

        const width = this.texture.getBounds().width;
        for (let i = 1; i < Math.ceil(config.screenWidth / width) + 1; i++)
            this.add(
                this.scene.add
                    .image((width - 1) * i, 0, config.texture, config.frame)
                    .setOrigin(0, config.originY || 0.5)
            );
    }

    /**
     * "Sets the origin of the texture to the given y value.
     * @param {number} y The y coordinate of the origin.
     */
    setOriginY(y = 1) {
        this.texture.setOrigin(0, y);
        return this;
    }

    /**
     * Sets the scrolling acceleration.
     * @param {number} acceleration The acceleration of the object.
     */
    setAcceleration(acceleration) {
        this.acceleration = acceleration;
        return this;
    }

    update(delta, speed) {
        this.list.forEach(
            (segment) => (segment.x -= speed * this.acceleration * delta)
        );

        if (this.list[0].x + this.list[0].width <= 0) {
            let first = this.list.shift();
            let last = this.list[this.list.length - 1];
            first.x = last.x + last.width - 1;
            this.list.push(first);
        }
    }
}

/**
 * Creates a background that is infinitely parallax scrolling.
 */
export class IPS {
    /**
     * @param {Phaser.Scene} scene the scene that the background is being added to
     * @param {number} width The width of the screen
     */
    constructor(scene, width) {
        this.scene = scene;

        this.width = width;
        this.list = [];
    }

    /**
     * Adds a new scrolling background to the list of scrolling backgrounds.
     * @param {ScrollingBackgroundConfig} config Configuration options for the ScrollingBackground class.
     */
    add(config) {
        config.scene = config.scene || this.scene;
        config.width = config.width || this.width;

        const bg = new ScrollingBackground(config);
        this.list.push(bg);
        return bg;
    }

    /**
     * Updates a list of backgrounds based on the given delta and speed.
     * @param {number} delta - The time elapsed between the current frame and the previous frame.
     * It is usually measured in ms and is used to calculate smooth animations and movements regardless of the device's processing speed.
     * @param {number} speed - The  numerical value that represents the speed at which the background is moving.
     * It is used in the update method to update the position of the background based on the elapsed time (delta) and the speed.
     */
    update(delta, speed) {
        this.list.forEach((bg) => bg.update(delta, speed));
    }
}

/**
 * @typedef ScrollingBackgroundConfig A custom type that can be passed to the `ScrollingBackground` class.
 * @prop {Phaser.Scene} scene The Scene to which this background belongs.
 * @prop {number} y The vertical position of this background in the world. Default `0`.
 * @prop {number} originY The origin of the texture.
 * @prop {number} screenWidth The width of the screen
 * @prop {string|Phaser.Textures.Texture} texture The texture to use for the background.
 * @prop {string|Phaser.Textures.Frame} frame The frame of the texture to use.
 * @prop {number} acceleration The speed at which the background moves
 */
