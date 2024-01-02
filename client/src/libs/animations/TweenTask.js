import { ArrayUtils } from '../utils';

/**
 * @utility
 */
export default class TweenTask {
    /**
     * The default duration for tweens, in milliseconds. If no duration is specified when creating a new TweenTask instance, this value will be used.
     * @type {number}
     * @default 500
     * @example
     * TweenTask.DEFAULT_DURATION = 1000; // Set a new default duration
     */
    static DEFAULT_DURATION = 500;

    /**
     * @static Moves the targets to the specified coordinates.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} x - The x-coordinate to move the targets to.
     * @param {number} y - The y-coordinate to move the targets to.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The easing function to use for the animation. If not specified, a default easing function will be used.
     */
    static MoveTo(targets, x, y, config = {}) {
        this.assert({ x, y });

        config.targets = targets;
        config.x = x;
        config.y = y;
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    /**
     * @static Moves the targets by the specified amount.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} x - The amount to move the targets horizontally.
     * @param {number} y - The amount to move the targets vertically.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static MoveBy(targets, x, y, config = {}) {
        this.assert({ x, y });

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    /**
     * @static Animates the targets to fly in from a specific direction.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} x - The x-coordinate to fly in from.
     * @param {number} y - The y-coordinate to fly in from.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FlyIn(targets, x, y, config = {}) {
        this.assert({ x, y });
        this.callOnTargets(targets, (t) => t.setPosition(t.x - x, t.y - y));

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Back.Out;

        return this.add(config);
    }

    /**
     * @static Animates the targets to float in from a specific direction with fading effect.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} x - The x-coordinate to float in from.
     * @param {number} y - The y-coordinate to float in from.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FloatIn(targets, x, y, config = {}) {
        this.assert({ x, y });
        this.callOnTargets(targets, (t) => t.setAlpha(0).setPosition(t.x - x, t.y - y));

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.alpha = this.define(config.alpha, 1);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.InOut;

        return this.add(config);
    }

    /**
     * @static Fades in the targets by adjusting their alpha value.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeIn(targets, config = {}) {
        this.callOnTargets(targets, (t) => t.setAlpha(0));

        config.targets = targets;
        config.alpha = this.define(config.alpha, 1);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    /**
     * @static Fades out the targets by adjusting their alpha value.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeOut(targets, config = {}) {
        config.targets = targets;
        config.alpha = this.define(config.alpha, 0);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.In;

        return this.add(config);
    }

    /**
     * @static Fades out the targets by adjusting their alpha value while applying a relative movement.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} x - The amount to move the targets along the x-axis.
     * @param {number} y - The amount to move the targets along the y-axis.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeOutBy(targets, x, y, config = {}) {
        this.assert({ x, y });

        config.targets = targets;
        config.alpha = this.define(config.alpha, 0);
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    static FadeOutScale(targets, config = {}) {
        config.targets = targets;
        config.alpha = this.define(config.alpha, 0);
        config.scale = this.define(config.scale, 1.5);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Cubic.Out;

        return this.add(config);
    }

    /**
     * @static Fades out the targets by adjusting their alpha value while scaling them.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeOutScale(targets, config = {}) {
        config.targets = targets;
        config.alpha = this.define(config.alpha, 0);
        config.scale = this.define(config.scale, 1.5);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Cubic.Out;

        return this.add(config);
    }

    /**
     * @static Fades the targets horizontally by adjusting their alpha value.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} [alpha=0] - The alpha value to fade the targets to.
     * @param {number} [duration=this.DEFAULT_DURATION] - The duration of the animation in milliseconds. If not specified, the default duration will be used.
     * @param {boolean} [fromRight=false] - Indicates whether the fade should start from the right side. If true, the fade will start from the right side; otherwise, it will start from the left side.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeHoriz(targets, alpha = 0, duration = this.DEFAULT_DURATION, fromRight = false, config = {}) {
        this.assert({ alpha, duration });

        const start = {
            value: alpha,
            duration: duration / 2,
            ease: Phaser.Math.Easing.Cubic.In,
        };
        const end = {
            value: alpha,
            delay: duration / 2,
            duration: duration / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
        };

        config.targets = targets;
        config.alphaTopLeft = fromRight ? end : start;
        config.alphaBottomLeft = fromRight ? end : start;
        config.alphaTopRight = fromRight ? start : end;
        config.alphaBottomRight = fromRight ? start : end;

        return this.add(config);
    }

    /**
     * @static Animates the targets with a vertical fade effect by adjusting their alpha value.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} [alpha=0] - The alpha value to fade the targets to. Defaults to 0.
     * @param {number} [duration=this.DEFAULT_DURATION] - The duration of the animation in milliseconds. If not specified, the default duration will be used.
     * @param {boolean} [fromBottom=false] - Indicates whether the fade should start from the bottom side. If true, the fade will start from the bottom side; otherwise, it will start from the top side.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeVert(targets, alpha = 0, duration = this.DEFAULT_DURATION, fromBottom = false, config = {}) {
        this.assert({ alpha, duration });

        const start = {
            value: alpha,
            duration: duration / 2,
            ease: Phaser.Math.Easing.Cubic.In,
        };
        const end = {
            value: alpha,
            delay: duration / 2,
            duration: duration / 2,
            ease: Phaser.Math.Easing.Cubic.Out,
        };

        config.targets = targets;
        config.alphaTopLeft = fromBottom ? end : start;
        config.alphaTopRight = fromBottom ? end : start;
        config.alphaBottomLeft = fromBottom ? start : end;
        config.alphaBottomRight = fromBottom ? start : end;

        return this.add(config);
    }

    /**
     * @static Animates the targets with a diagonal fade effect by adjusting their alpha value.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} [alpha=0] - The alpha value to fade the targets to. Defaults to 0.
     * @param {number} [duration=this.DEFAULT_DURATION] - The duration of the animation in milliseconds. If not specified, the default duration will be used.
     * @param {boolean} [fromRight=false] - Indicates whether the fade should start from the right side. If true, the fade will start from the right side; otherwise, it will start from the left side.
     * @param {boolean} [fromBottom=false] - Indicates whether the fade should start from the bottom side. If true, the fade will start from the bottom side; otherwise, it will start from the top side.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeDiag(targets, alpha, duration, fromRight = false, fromBottom = false, config = {}) {
        alpha = this.define(alpha, 0);
        duration = this.define(duration, this.DEFAULT_DURATION);

        this.assert({ alpha, duration });

        const start = {
                value: alpha,
                duration: duration * 0.25,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
            mid = {
                value: alpha,
                delay: duration * 0.25,
                duration: duration * 0.5,
            },
            end = {
                value: alpha,
                delay: duration * 0.75,
                duration: duration * 0.25,
                ease: Phaser.Math.Easing.Quadratic.Out,
            };

        config.targets = targets;
        config.alphaTopLeft = fromBottom && fromRight ? end : fromBottom || fromRight ? mid : start;
        config.alphaBottomRight = fromBottom && fromRight ? start : fromBottom || fromRight ? mid : end;
        config.alphaBottomLeft = fromBottom && fromRight ? mid : fromRight ? end : fromBottom ? start : mid;
        config.alphaTopRight = fromBottom && fromRight ? mid : fromRight ? start : fromBottom ? end : mid;

        return this.add(config);
    }

    /**
     * @static Fades the targets circularly.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to animate. Can be an array of objects or a single object.
     * @param {number} alpha - The alpha value to fade to (between 0 and 1).
     * @param {number} [duration=this.DEFAULT_DURATION] - The duration of the tween in milliseconds.
     * @param {string} [startCorner='topLeft'] - The corner to start the fade effect from.
     * @example Possible value: topLeft, topRight, bottomRight, bottomLeft
     * @param {boolean} [anticlockwise=false] - Whether to fade in an anticlockwise direction.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} [config] - The configuration for the tween animation.
     */
    static FadeCirc(targets, alpha, duration, startCorner = 'topLeft', anticlockwise = false, config = {}) {
        alpha = this.define(alpha, 0);
        duration = this.define(duration, this.DEFAULT_DURATION);

        this.assert({ alpha, duration });

        const corners = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
        if (!corners.includes(startCorner)) throw new Error('Invalid corner value.');

        config.targets = targets;

        ArrayUtils.Rotate(corners, startCorner, anticlockwise).forEach(
            (c, i) =>
                (config[`alpha${Phaser.Utils.String.UppercaseFirst(c)}`] = {
                    value: alpha,
                    duration: duration * 0.25,
                    delay: i * duration * 0.25,
                    ease:
                        i === 0
                            ? Phaser.Math.Easing.Quadratic.In
                            : i === corners.length - 1
                            ? Phaser.Math.Easing.Quadratic.Out
                            : Phaser.Math.Easing.Linear,
                })
        );

        return this.add(config);
    }

    static ZoomIn(targets, config = {}) {
        config.targets = targets;
        config.scale = this.define(config.scale, 1);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Back.Out;

        return this.add(config);
    }

    static ZoomOut(targets, config = {}) {
        config.targets = targets;
        config.scale = this.define(config.scale, 0);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Back.In;

        return this.add(config);
    }

    static ZoomInBy(targets, x, y, config = {}) {
        this.assert(x, y);
        this.callOnTargets(targets, (t) => t.setPosition(t.x - x, t.y - y));

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.scale = this.define(config.scale, 1);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Back.Out;

        return this.add(config);
    }

    static ZoomOutBy(targets, x, y, config = {}) {
        this.assert(x, y);

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.scale = this.define(config.scale, 0);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Back.In;

        return this.add(config);
    }

    static SnapIn(targets, config = {}) {
        this.callOnTargets(targets, (t) => t.setAlpha(0).setScale(2));

        config.targets = targets;
        config.alpha = this.define(config.alpha, 1);
        config.scale = this.define(config.scale, 1);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quintic.In;

        return this.add(config);
    }

    static RubberIn(targets, config = {}) {
        this.callOnTargets(targets, (t) => t.setAlpha(0).setScale(0));

        config.targets = targets;
        config.alpha = this.define(config.alpha, 1);
        config.scale = this.define(config.scale, 1);
        config.duration = this.define(config.duration, 1000);
        config.ease = config.ease || Phaser.Math.Easing.Elastic.Out;

        return this.add(config);
    }

    static Bob(targets, y = 0, config = {}) {
        this.assert(y);

        config.targets = targets;
        config.y = this.getAddition(y);
        config.scaleX = this.define(config.scaleX, 0.85);
        config.scaleY = this.define(config.scaleY, 0.75);
        config.duration = this.define(config.duration, 100);
        config.yoyo = this.define(config.yoyo, true);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    static Pulse(targets, config = {}) {
        config.targets = targets;
        config.scale = this.define(config.scale, 1.01);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.repeat = this.define(config.repeat, -1);
        config.repeatDelay = this.define(config.repeatDelay, this.DEFAULT_DURATION);
        config.yoyo = this.define(config.yoyo, true);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        return this.add(config);
    }

    static HeartBeat(targets, config = {}) {
        config.ease = Phaser.Math.Easing.Back.Out;
        return this.Pulse(targets, config);
    }

    static Flash(targets, config = {}) {
        config.targets = targets;
        config.alpha = this.define(config.alpha, { from: 0, to: 1 });
        config.duration = this.define(config.duration, 100);
        config.repeat = this.define(config.repeat, -1);
        config.yoyo = this.define(config.yoyo, true);
        config.ease = config.ease || Phaser.Math.Easing.Bounce.InOut;

        return this.add(config);
    }

    static Blink(targets, config = {}) {
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.repeatDelay = this.define(config.repeatDelay, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.In;
        return this.Flash(targets, config);
    }

    static Idle(targets, x, y, config = {}) {
        this.assert(x, y);

        config.targets = targets;
        config.x = this.getAddition(x);
        config.y = this.getAddition(y);
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.repeat = this.define(config.repeat, -1);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.InOut;
        config.yoyo = true;

        return this.add(config);
    }

    static Seesaw(targets, config = {}) {
        config.targets = targets;
        config.angle = this.define(config.angle, { from: -5, to: 5 });
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.repeat = this.define(config.repeat, -1);
        config.yoyo = true;
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.InOut;

        return this.add(config);
    }
    //* CHAIN

    static FadeInAndOut(targets, hold = 0, duration = this.DEFAULT_DURATION, config = {}) {
        this.callOnTargets(targets, (t) => t.setAlpha(0));

        config.targets = targets;
        config.tweens = [
            {
                alpha: 1,
                duration: duration / 2,
                ease: Phaser.Math.Easing.Quadratic.Out,
            },
            {
                alpha: 0,
                delay: hold,
                duration: duration / 2,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
        ];

        return this.chain(config);
    }

    static ZoomInAndOut(targets, hold = 0, duration = this.DEFAULT_DURATION, config = {}) {
        this.callOnTargets(targets, (t) => t.setScale(0));

        config.targets = targets;
        config.tweens = [
            {
                scale: 1,
                duration: duration / 2,
                ease: Phaser.Math.Easing.Back.Out,
            },
            {
                scale: 0,
                delay: hold,
                duration: duration / 2,
                ease: Phaser.Math.Easing.Back.In,
            },
        ];

        return this.chain(config);
    }

    static Popup(targets, y, offsetY, duration = this.DEFAULT_DURATION, config = {}) {
        this.assert(y, offsetY, duration);
        this.callOnTargets(targets, (t) => t.setAlpha(0).setScale(0));
        y = this.define(y, this.getAddition(0));

        config.targets = targets;
        config.tweens = [
            {
                scale: 1,
                alpha: 1,
                y: y - offsetY,
                duration: duration * 0.4,
                ease: Phaser.Math.Easing.Back.Out,
            },
            {
                alpha: 0,
                y: y - offsetY - offsetY,
                delay: duration * 0.2,
                duration: duration * 0.4,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
        ];

        return this.chain(config);
    }

    static GrowRotate(targets, angle, duration = 1000, config = {}) {
        this.assert(angle, duration);
        this.callOnTargets(targets, (t) => t.setAlpha(0).setAngle(0).setScale(0));

        config.targets = targets;
        config.tweens = [
            {
                alpha: 0.7,
                angle: -angle,
                scale: 0.8,
                duration: duration / 2,
                ease: Phaser.Math.Easing.Quadratic.Out,
            },
            {
                alpha: 1,
                angle: angle / 3,
                scale: 1.1,
                duration: duration / 4,
            },
            {
                angle: 0,
                scale: 1,
                duration: duration / 4,
                ease: Phaser.Math.Easing.Back.Out,
            },
        ];

        return this.chain(config);
    }

    static Bounce(targets, y, scale = 1, duration = this.DEFAULT_DURATION, config = {}) {
        this.assert(y, scale, duration);

        config.targets = targets;
        config.tweens = [
            {
                y: this.getSubtraction(y),
                scaleX: scale - 0.05,
                scaleY: scale + 0.05,
                duration: duration * 0.3,
                ease: Phaser.Math.Easing.Sine.Out,
            },
            {
                y: this.getAddition(y),
                scaleX: scale + 0.1,
                scaleY: scale - 0.1,
                duration: duration * 0.2,
                ease: Phaser.Math.Easing.Sine.In,
            },
            {
                y: this.getSubtraction(y * 0.5),
                scaleX: scale - 0.05,
                scaleY: scale + 0.05,
                duration: duration * 0.3,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
            {
                y: this.getAddition(y * 0.5),
                scaleX: 1,
                scaleY: 1,
                duration: duration * 0.2,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
        ];

        return this.chain(config);
    }

    static RubberBand(targets, duration = 1000, config = {}) {
        this.assert(duration);

        config.targets = targets;
        config.tweens = [
            {
                scaleX: this.getAddition(0.3),
                scaleY: this.getSubtraction(0.3),
                duration: duration * 0.4,
                ease: Phaser.Math.Easing.Quadratic.Out,
            },
            {
                scaleX: this.getSubtraction(0.5),
                scaleY: this.getAddition(0.5),
                duration: duration * 0.12,
                ease: Phaser.Math.Easing.Quadratic.In,
            },
            {
                scaleX: this.getAddition(0.35),
                scaleY: this.getSubtraction(0.35),
                duration: duration * 0.12,
            },
            {
                scaleX: this.getSubtraction(0.2),
                scaleY: this.getAddition(0.2),
                duration: duration * 0.12,
            },
            {
                scaleX: this.getAddition(0.15),
                scaleY: this.getSubtraction(0.15),
                duration: duration * 0.12,
            },
            {
                scaleX: 1,
                scaleY: 1,
                duration: duration * 0.12,
            },
        ];

        return this.chain(config);
    }

    static Wobble(targets, offset, duration = 1000, config = {}) {
        this.assert(offset, duration);

        config.targets = targets;
        config.repeat = this.define(config.repeat, -1);
        config.yoyo = this.define(config.yoyo, true);
        config.tweens = [
            {
                x: this.getSubtraction(offset),
                angle: this.getSubtraction(offset / 10),
                scale: 1,
                duration: duration * 0.25,
                ease: Phaser.Math.Easing.Sine.Out,
            },
            {
                x: this.getAddition(offset * 2),
                angle: this.getAddition(offset / 5),
                duration: duration * 0.5,
                ease: Phaser.Math.Easing.Sine.InOut,
            },
            {
                x: this.getSubtraction(offset),
                angle: this.getSubtraction(offset / 10),
                duration: duration * 0.25,
                ease: Phaser.Math.Easing.Sine.In,
            },
        ];

        return this.chain(config);
    }

    static Tada(targets, offset = 5, duration = 700, config = {}) {
        this.assert(offset, duration);

        config.targets = targets;
        config.tweens = [
            {
                angle: -offset,
                scale: 1 - offset * 0.01,
                duration: duration * 0.25,
                ease: Phaser.Math.Easing.Quadratic.Out,
            },
            {
                angle: offset,
                scale: 1 + offset * 0.01,
                duration: duration * 0.15,
            },
            {
                angle: -offset,
                duration: duration * 0.15,
                yoyo: true,
                repeat: 2,
            },
            {
                angle: 0,
                scale: 1,
                duration: duration * 0.15,
                ease: Phaser.Math.Easing.Quadratic.Out,
            },
        ];

        return this.chain(config);
    }

    static TintTo(targets, red, green, blue, config = {}) {
        this.assert(red, green, blue);

        const originColor = new Phaser.Display.Color.IntegerToColor(targets.tintTopLeft);

        config.from = 0;
        config.to = 1;
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;
        config.onUpdate = (tw) => {
            const color = Phaser.Display.Color.Interpolate.ColorWithRGB(
                originColor,
                red,
                green,
                blue,
                1,
                tw.getValue()
            );
            this.callOnTargets(targets, (e) => e.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b)));
        };

        return this.addCounter(config);
    }

    static TintBy(targets, red = 0, green = 0, blue = 0, config = {}) {
        this.assert(red, green, blue);

        const originColor = new Phaser.Display.Color.IntegerToColor(targets.tintTopLeft);
        const altColor = new Phaser.Display.Color(originColor.r + red, originColor.g + green, originColor.b + blue);

        config.from = 0;
        config.to = 1;
        config.duration = this.define(config.duration, this.DEFAULT_DURATION);
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;
        config.onUpdate = (tw) => {
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(originColor, altColor, 1, tw.getValue());
            this.callOnTargets(targets, (t) => t.setTint(Phaser.Display.Color.GetColor(color.r, color.g, color.b)));
        };

        return this.addCounter(config);
    }

    static add(config) {
        return this.getTween(config.targets).add(config);
    }

    static chain(config) {
        return this.getTween(config.targets).chain(config);
    }

    static addCounter(config) {
        return this.getTween(config.targets).addCounter(config);
    }

    /**
     * @private Retrieves the Phaser Scene associated with the targets.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to retrieve the scene from. Can be an array of objects or a single object.
     */
    static getTween(targets) {
        try {
            const isArray = Array.isArray(targets);
            const isValidTarget = (target) => target instanceof Phaser.GameObjects.GameObject;

            if (!isArray && !isValidTarget(targets))
                throw new TypeError('Invalid targets. Expected a GameObject or an array of GameObjects.');

            const scene = isArray ? targets.find(isValidTarget)?.scene : targets.scene;
            if (!scene) throw new TypeError('Invalid targets. Array should contain only GameObjects.');

            scene.tweens.killTweensOf(targets);
            return scene.tweens;
        } catch (error) {
            console.error('Error while retrieving scene:', error);
            throw error;
        }
    }

    /**
     * @private Generates an addition string for use in tween configurations.
     * @param {number} value - The value to add.
     * @returns {string} The addition string in the format `+=value`.
     */
    static getAddition(value) {
        return `+=${this.define(value, 0)}`;
    }

    /**
     * @private Generates an subtraction string for use in tween configurations.
     * @param {number} value - The value to subtract.
     * @returns {string} The addition string in the format `-=value`.
     */
    static getSubtraction(value) {
        return `-=${this.define(value, 0)}`;
    }

    /**
     * @private Defines a value and returns an alternative value if the input is undefined or null.
     * @param {*} value - The value to define.
     * @param {*} alternative - The alternative value to return if the input value is undefined or null.
     */
    static define(value, alternative) {
        return value !== undefined && value !== null ? value : alternative;
    }

    /**
     * @private Asserts that all arguments are numeric values.
     * @param {Object} params - The arguments to check.
     */
    static assert(params) {
        try {
            const invalidKeys = Object.keys(params).filter((prop) => !Number.isFinite(Number(params[prop])));

            if (invalidKeys.length > 0)
                throw new TypeError(
                    `Invalid arguments. The following properties must have numeric values: ${invalidKeys.join(', ')}`
                );
        } catch (error) {
            console.error(`TweenTask TypeError: ${error.message}`);
        }
    }

    /**
     * @private Calls a callback function on the given targets. If the callback is not a function, it logs a warning.
     * @param {Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[]} targets - The targets to perform the callback on. Can be an array of objects or a single object.
     * @param {Function} callback - The callback function to call on the targets.
     */
    static callOnTargets(targets, callback) {
        if (typeof callback !== 'function') return console.warn('TweenTask.callOnTargets Error: Invalid callback.');

        if (targets.scene) callback.call(null, targets);
        else targets.length && targets.forEach(callback);
    }

      /**
     * Shaking target with offset.
     * @param {Phaser.GameObjects.GameObject} targets
     * @param {number} offsetX Default is 0.
     * @param {number} offsetY Default is 0.
     * @param {Phaser.Types.Tweens.TweenBuilderConfig} config
     */
    static Shaking(targets, offset, config = {}) {
        config.targets = targets;
        config.angle =  {
                from: -offset,
                to: offset
            }
        config.repeat = 1;
        config.yoyo = true;
        config.duration = 80;
        config.ease = config.ease || Phaser.Math.Easing.Quadratic.Out;

        config.onComplete = function() {
            targets.setRotation(0);
        }

        return this.add(config);
    }
}
