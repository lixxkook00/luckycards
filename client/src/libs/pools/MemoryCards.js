import { EVENT } from '../../env';

class MemoryCard extends Phaser.GameObjects.Image {
    isFlipping = false;
    frontFrame = '';

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene, x, y, texture, backFrame) {
        super(scene, x, y - 100, texture, backFrame);

        this.backFrame = backFrame;
        this.flipUp = false;

        this.setAlpha(0);
    }

    spawn(delay, frontFrame, id) {
        this.frontFrame = frontFrame;
        this.id = id;
        this.setName(frontFrame).setActive(true).setVisible(true);
        this.scene.add.tween({
            targets: this,
            x: this.x,
            y: this.y + 100,
            alpha: 1,
            duration: 500,
            delay,
            ease: Phaser.Math.Easing.Quadratic.In,
        });
        return this;
    }

    flip(callbackStart, callbackComplete, scale = 1) {
        if (this.isFlipping) return;

        this.scene.tweens.chain({
            targets: [this],
            tweens: [
                {
                    scaleX: 0,
                    duration: 200,
                    ease: Phaser.Math.Easing.Expo.In,
                    onComplete: () => {
                        this.flipUp = !this.flipUp;
                        this.setFrame(this.flipUp ? this.frontFrame : this.backFrame);
                    },
                },
                { scaleX: scale, duration: 200, ease: Phaser.Math.Easing.Expo.Out },
            ],
            onStart: () => {
                this.isFlipping = true;
                callbackStart && callbackStart();
            },
            onComplete: () => {
                this.isFlipping = false;
                callbackComplete && callbackComplete();
            },
        });

        return this;
    }

    shake(callbackStart, callbackComplete) {
        this.scene.tweens.add({
            targets: this,
            angle: { from: -5, to: 5 },
            repeat: 1,
            yoyo: true,
            duration: 50,
            ease: Phaser.Math.Easing.Quadratic.Out,
            onComplete: () => {
                this.setRotation(0);
                this.flip(callbackStart, callbackComplete);
            },
        });

        return this;
    }

    release(delay = 0) {
        this.scene &&
            this.scene.add.tween({
                targets: [this],
                y: this.y + 100,
                alpha: 0,
                delay,
                duration: 500,
                easing: Phaser.Math.Easing.Elastic.In,
                onComplete: () => this.setActive(false).setVisible(false).destroy(),
            });

        return this;
    }
}

export default class MemoryCards extends Phaser.GameObjects.Group {
    /**
     * @type {MemoryCard}
     */
    cardOpened = null;
    canMove = true;
    matrix = [];
    list = [];

    /**
     * @param {Phaser.Scene} scene - The scene that owns this group.
     * @param {number} [maxSize=10] - The maximum number of floating texts that can be in the group.
     * @param {string} [text=''] - The default text to use for the floating texts.
     * @param {Phaser.Types.GameObjects.Text.TextStyle} [style={}] - The default style configuration for the floating texts.
     */
    constructor(scene, maxSize = 10, texture, frontFrames, backFrame) {
        super(scene);

        /**
         * The class type used for the floating texts in the group.
         * @type {typeof MemoryCard}
         */
        this.classType = MemoryCard;

        /**
         * The maximum number of floating texts that can be in the group.
         * @type {number}
         */
        this.maxSize = maxSize;

        this.texture = texture;
        this.frontFrames = frontFrames;
        this.backFrame = backFrame;
    }

    get isCompleted() {
        return this.matrix.every((card) => card);
    }

    getRandomFrameList(length) {
        return this.frontFrames.slice(0, length);
    }

    /**
     * Spawns a floating text at the specified coordinates with the provided duration, text, and style.
     * @param {number} x - The x-coordinate of the spawn position.
     * @param {number} y - The y-coordinate of the spawn position.
     * @param {number} [delay] - The duration of the animation in milliseconds.
     */
    spawn(x, y, delay, frame, id) {
        /**
         * @type {MemoryCard}
         */
        const item = this.get(x, y, this.texture, this.backFrame);
        item.spawn(delay, frame, id).setSize(item.width, item.height);
        item.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, this.onpointerdown.bind(this, item));
        this.list.push(item);
        return item;
    }

    spawnMap(x, y, row, col, rowGap = 0, colGap = rowGap, delay = 0) {
        this.matrix = Array.from({ length: row * col }, () => false);
        const map = this.map(row, col, rowGap, colGap);
        const rand = this.getRandomFrameList((row * col) / 2);
        const names = Phaser.Utils.Array.Shuffle([...rand, ...rand]);
        const matrix = [];
        map.forEach((row, i) => {
            {
                matrix.push([]);
                row.forEach((pos, j) => {
                    const id = i * col + j;
                    this.spawn(x + pos.x, y + pos.y, (i + j) * delay, names[id], id);
                    matrix[i].push(names[id]);
                });
            }
        });

        console.log(" --------- For QC ---------- \n" ,matrix);

        return this;
    }

    release(item) {
        Phaser.Utils.Array.Remove(this.list, item);
        item.release();
        return this;
    }

    releaseAll(delay = 0) {
        this.list.forEach((item, i) => item.release(delay * (this.list.length - i)));
    }

    map(row, col, rowGap = 0, colGap = rowGap) {
        return Array.from({ length: row }, (_, i) =>
            Array.from({ length: col }, (_, j) => ({
                x: (j - (col - 1) / 2) * colGap,
                y: (i - (row - 1) / 2) * rowGap,
            }))
        );
    }

    /**
     * @param {MemoryCard} card
     */
    onpointerdown(card) {
        if (!this.canMove || this.matrix[card.id]) return;

        this.canMove = false;

        if (this.cardOpened !== null) {
            if (this.cardOpened.x === card.x && this.cardOpened.y === card.y) {
                this.canMove = true;
                return false;
            }


            card.flip(null, () => {
                if (this.cardOpened.name === card.name) {
                    this.matrix[this.cardOpened.id] = true;
                    this.matrix[card.id] = true;
                    this.onMatch();
                    this.onCardMatch(card);
                    this.onCardMatch(this.cardOpened);
                    this.cardOpened = null;
                    this.canMove = true;
                } else {
                    card.shake();
                    this.cardOpened.shake();
                    this.onMismatch();
                    this.scene.time.delayedCall(100, () => {
                        this.cardOpened = null;
                        this.canMove = true;
                    });
                }
            });
        } else if (this.cardOpened === null) {
            card.flip();
            this.cardOpened = card;
            this.scene.time.delayedCall(100, () => {
                this.canMove = true;
            });
        }
    }

    onMatch() {}

    onCardMatch() {}

    onMismatch() {}
}
