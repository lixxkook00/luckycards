import { Calc } from "../utils";

export default class ParallaxTask {
    /**
     * Sets the position of the target object to a value between the from and to values, based on the offset value.
     * @param {Phaser.GameObjects.GameObject} target - The target object to move.
     * @param {object} offset - The amount of pixels to move the target by.
     * @param {object} from - The starting position of the object.
     * @param {object} to - The target position.
     */
    static setPosition(target, offset, from, to) {
        return target.setPosition(
            Calc.clamp(from.x + offset.x, from.x, to.x),
            Calc.clamp(from.y + offset.y, from.y, to.y)
        );
    }

    /**
     * Sets the x position of the target object to a value between the from and to values, based on the offset value.
     * @param {Phaser.GameObjects.GameObject} target - The target object to move.
     * @param {object} offset - The amount of pixels to move the target by.
     * @param {object} from - The starting position of the object.
     * @param {object} to - The target position.
     */
    static setPositionX(target, offset, from, to) {
        const x = Calc.clamp(from + offset, from, to);
        return Array.isArray(target)
            ? target.forEach((e) => e.setPosition(x, e.y))
            : target.setPosition(x, target.y);
    }

    /**
     * Sets the y position of the target object to a value between the from and to values, based on the offset value.
     * @param {Phaser.GameObjects.GameObject} target - The target object to move.
     * @param {object} offset - The amount of pixels to move the target by.
     * @param {object} from - The starting position of the object.
     * @param {object} to - The target position.
     */
    static setPositionY(target, offset, from, to) {
        return target.setPosition(
            target.x,
            Calc.clamp(from + offset, from, to)
        );
    }

    /**
     * Sets the scale of the target object to a value between the from and to values, based on the offset value.
     * @param {Phaser.GameObjects.GameObject} target - The target object to be scaled.
     * @param {number} offset - The offset from the current scale.
     * @param {number} from - The minimum value of the scale.
     * @param {number} to - The target scale.
     */
    static setScale(target, offset, from, to) {
        return target.setScale(Calc.clamp(from + offset, from, to));
    }

    /**
     * Sets the angle of the target object to a value between the from and to values, based on the offset value.
     * @param {Phaser.GameObjects.GameObject} target - The target object to be rotated.
     * @param {number} offset - The offset from the current angle.
     * @param {number} from - The minimum value of the angle.
     * @param {number} to - The target angle.
     */
    static setAngle(target, offset, from, to) {
        return target.setAngle(Calc.clamp(from + offset, from, to));
    }
}
