class AnimatedParticle extends Phaser.GameObjects.Particles.Particle {
    constructor(emitter, frames = []) {
        super(emitter);

        this.t = 0;
        this.i = 0;
        this.frames = frames;
    }

    update(delta, step, processors) {
        let id = Math.floor(((this.life - this.lifeCurrent) / this.life) * this.frames.length);
        id = Math.min(this.frames.length - 1, id);
        this.frame = this.frames[id].frame;

        return super.update(delta, step, processors);
    }
}

/**
 * Creates a subclass of AnimatedParticle, is used for Particle Class Config.
 * @param {Phaser.Types.Animations.AnimationFrame} animationFrame Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
 */
function subclass(animationFrame) {
    return class Subclass extends AnimatedParticle {
        constructor(emitter) {
            super(emitter, animationFrame);
        }
    };
}

/**
 * The function returns a value if it is not null, otherwise it returns an alternative value.
 * @param value - The value to be validated. It could be any data type (string, number, boolean,
 * object, etc.) or null.
 * @param alternative - The value that will be returned if the first parameter, "value", is null.
 */
function define(value, alternative) {
    return value == null ? alternative : value;
}

/**
 * Creates an emitter for particles with optional animation and configuration options.
 * @param {Phaser.GameObjects.Particles.ParticleEmitter} particles The particle system to create the emitter for.
 * @param {Phaser.Types.Animations.AnimationFrame} animationFrame This parameter is optional and refers to the frame of an animation
 * that the particles will use. If provided, the particles will use this animation frame instead of
 * a static image.
 * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config
 */
function emitterFactory(particles, animationFrame = undefined, config = {}) {
    config.on = define(config.on, false); // Disable auto-start
    animationFrame && (config.particleClass = subclass(animationFrame));
    return particles.setConfig(config);
}

export default class ParticleTask {
    /**
     * Scale and rotate out the particle, use `emitter.explode()` to emit particles.
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} particles The particle system to create the emitter for.
     * @param {Phaser.Types.Animations.AnimationFrame} animationFrame This parameter is optional and refers to the frame of an animation
     * that the particles will use. If provided, the particles will use this animation frame instead of
     * a static image.
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config
     */
    static Scale(particles, animationFrame = undefined, config = {}) {
        config.scale = define(config.scale, { start: 1, end: 3 });
        config.rotate = define(config.rotate, { min: 0, max: 360 });
        config.lifespan = define(config.lifespan, 1000);
        config.frequency = define(config.lifespan, -1);
        config.blendMode = define(config.blendMode, Phaser.BlendModes.ADD);

        const emitter = emitterFactory(particles, animationFrame, config);
        emitter.rotate.onUpdate = emitter.rotate.defaultUpdate;
        return emitter;
    }

    /**
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} particles The particle system to create the emitter for.
     * @param {Phaser.Types.Animations.AnimationFrame} animationFrame This parameter is optional and refers to the frame of an animation
     * that the particles will use. If provided, the particles will use this animation frame instead of
     * a static image.
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config
     */
    static ChannelX(particles, animationFrame = undefined, config = {}) {
        config.alpha = define(config.alpha, {
            start: 1,
            end: 0,
            ease: Phaser.Math.Easing.Quadratic.In,
        });
        config.scale = define(config.scale, {
            start: 0,
            end: 1,
            ease: Phaser.Math.Easing.Sine.Out,
        });
        config.speedX = define(config.speedX, 100);
        config.accelerationX = define(config.accelerationX, 1200);
        config.lifespan = define(config.lifespan, 1000);
        config.frequency = define(config.frequency, 100);

        return emitterFactory(particles, animationFrame, config);
    }

    /**
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} particles The particle system to create the emitter for.
     * @param {Phaser.Types.Animations.AnimationFrame} animationFrame This parameter is optional and refers to the frame of an animation
     * that the particles will use. If provided, the particles will use this animation frame instead of
     * a static image.
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config
     */
    static ChannelY(particles, animationFrame = undefined, config = {}) {
        config.alpha = define(config.alpha, {
            start: 1,
            end: 0,
            ease: Phaser.Math.Easing.Quadratic.In,
        });
        config.scale = define(config.scale, {
            start: 0,
            end: 1,
            ease: Phaser.Math.Easing.Sine.Out,
        });
        config.speedY = define(config.speedX, 100);
        config.accelerationY = define(config.accelerationX, 1200);
        config.lifespan = define(config.lifespan, 1000);
        config.frequency = define(config.frequency, 100);

        return emitterFactory(particles, animationFrame, config);
    }

    /**
     * @param {Phaser.GameObjects.Particles.ParticleEmitterManager} particles The particle system to create the emitter for.
     * @param {Phaser.Types.Animations.AnimationFrame} animationFrame This parameter is optional and refers to the frame of an animation
     * that the particles will use. If provided, the particles will use this animation frame instead of
     * a static image.
     * @param {Phaser.Types.GameObjects.Particles.ParticleEmitterConfig} config
     */
    static Spark(particles, animationFrame = undefined, config = {}) {
        config.speed = define(config.speed, { min: -800, max: 800 });
        config.angle = define(config.angle, { min: 0, max: 360 });
        config.scale = define(config.scale, { start: 0.3, end: 0 });
        config.blendMode = define(config.blendMode, Phaser.BlendModes.SCREEN);
        config.lifespan = define(config.lifespan, 300);
        config.gravityY = define(config.gravityY, 800);
        return emitterFactory(particles, animationFrame, config);
    }
}
