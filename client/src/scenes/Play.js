import { Timepiece, Counter, RotateScene } from '../libs/ui';
import { ParticleTask, TweenTask } from '../libs/animations';
import { ENV, EVENT, TEXT_STYLES } from '../env';
import { FloatingTexts, MemoryCards } from '../libs/pools';
import { Common } from '../libs/utils';

let n = 0;
const STATE = { TUT: n++, START: n++, GAME: n++, LEVEL_UP: n++, TIME: n++, END: n++ };
const UPDATE = 'update'
const CREATE = 'create'

export default class Play extends RotateScene {
    hudNames = ['SCORE', 'PAIRS', 'TIME'];
    cardNames = Common.GenerateFrameNames('card-', 10);;
    map = [
        { row: 2, col: 4, time: 30 },
        { row: 3, col: 4, time: 30 },
        { row: 4, col: 5, time: 40 },
    ];
    firstImpression = true;

    constructor() {
        super(ENV.SCENE.PLAY);
    }

    get pairMax() {
        return (this.map[this.level-1].row*this.map[this.level-1].col)/2;
    }

    init() {
        this.level = 1;
        this.isReplay = false
        this.score = 0;
        this.cascade = 0;
        this.pairCount = 0;

        this.ui = this.scene.get(ENV.SCENE.UI);
        
        this.delayCallToNextLevel = null;

        this.overlay = this.add.rectangle(ENV.CENTER_X, ENV.CENTER_Y, ENV.WIDTH, ENV.HEIGHT, 0x000000, 0.7)
            // .graphics()
            // .fillStyle(0x000000, 0.7)
            // .fillRect(0, 0, ENV.WIDTH, ENV.HEIGHT)
            .setDepth(ENV.LAYER.OVERLAY)
            .setAlpha(0)
            .setInteractive();

        this.tutBox = this.add.image(ENV.CENTER_X, 477, 'atlas', 'rect-tut').setDepth(ENV.LAYER.OVERLAY).setAlpha(0);

        this.handleHUB(CREATE)
    }

    handleHUB(action) {
        switch (action) {
            case CREATE:
                this.timesUpText = this.add
                    .text(ENV.CENTER_X, ENV.CENTER_Y, "TIME'S UP", TEXT_STYLES.TIMES_UP)
                    .setOrigin(0.5)
                    .setDepth(ENV.LAYER.POPUP)
                    .setScale(0);

                this.scoreText = new Counter(this, 0, 40, 0, TEXT_STYLES.SCORE_BOX);
                this.scoreBox = this.add.container(ENV.CENTER_X, ENV.CENTER_Y).setDepth(ENV.LAYER.POPUP).setScale(0);
                this.scoreBox.add([
                    this.add.image(0, 0, 'atlas', 'box-result'),
                    this.add.text(0, -36, 'SCORE', TEXT_STYLES.END).setOrigin(0.5),
                    this.scoreText,
                ]);
                break;
            
            case UPDATE:
                this.hudScore.text.setText('0')
                this.hudTimer.clock.setDuration(this.map[this.level - 1].time)
                this.hudTimer.clock.reset();
                this.hudCount.text.setText(`${this.pairCount}/${this.pairMax}`);
                
                break;
        
            default:
                break;
        }
    }

    preload() {
        this.add.image(ENV.CENTER_X, ENV.CENTER_Y, 'boot', 'bg');
        this.add.image(ENV.CENTER_X, 1006, 'boot', 'copyright');

        this.hudScore = new Counter(this, ENV.CENTER_X - 240, 110, 0, TEXT_STYLES.HUD_NUM);
        this.hudCount = new Counter(this, ENV.CENTER_X, 110, '0/4', TEXT_STYLES.HUD_NUM);
        this.hudTimer = new Timepiece(this, ENV.CENTER_X + 240, 110, this.map[this.level - 1].time, TEXT_STYLES.HUD_NUM);

        [this.hudScore, this.hudCount, this.hudTimer].forEach((hud, i) => {
            const bg = this.add.image(0, 0, 'atlas', 'hud');
            const text = this.add.text(4, 95, this.hudNames[i], TEXT_STYLES.HUD_TEXT).setOrigin(0.5).setAngle(-12);
            hud.text.setAngle(-12);
            hud.add([bg, text]).sendToBack(bg);
            TweenTask.FlyIn(hud, 0, 300, { delay: 100 * i });
        });

        this.ui.start();
    }

    create() {
        this.levelText = this.add
            .text(ENV.CENTER_X, 315, `LEVEL ${this.level}`, TEXT_STYLES.LEVEL)
            .setOrigin(0.5)
            .setAlpha(0);
        this.deck = this.add.image(ENV.CENTER_X, 649, 'atlas', 'rect-1').setAlpha(0);
        this.cards = new MemoryCards(this, 52, 'atlas', this.cardNames, 'card-back');
        this.popup = new FloatingTexts(this, 52, '+50', TEXT_STYLES.POPUP);

        this.fractal = ParticleTask.Spark(this.add.particles(0, 0, 'fractal'), this.anims.get('vfx-fractal').frames, {
            scale: { min: 1, max: 2 },
            angle: { min: 0, max: 360 },
            rotate: { min: 0, max: 360 },
            speed: { min: 0, max: 20 },
            lifespan: 1000,
            blendMode: Phaser.BlendModes.ADD,
            tint: 0xfce800,
            emitZone: {
                type: 'random',
                source: new Phaser.Geom.Rectangle(-50, -50, 100, 100),
            },
            frequency: -1,
        });

        this.fractal.setDepth(ENV.LAYER.POPUP + 1);

        this.cards.onMatch = () => {
            this.cascade++;
            this.hudScore.update(this.score, this.score + this.cascade * 100);
            this.score += this.cascade * 100;
            this.pairCount += 1;
            this.hudCount.text.setText(
                `${Math.min(this.pairCount, this.pairMax)}/${this.pairMax}`
            );
        };

        this.cards.onCardMatch = (card) => {
            this.popup.spawn(card.x, card.y, true, 500, `+${this.cascade * 50}`).setDepth(ENV.LAYER.OVERLAY);
            this.fractal.explode(15, card.x, card.y);
        };

        this.cards.onMismatch = () => (this.cascade = 0);

        this.shiftState(STATE.START);

        this.replayButton = this.add
            .image(ENV.CENTER_X, 670, 'atlas', 'btn-replay')
            .setScale(1)
            .setAlpha(0)
            .setDepth(100)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.delayCallToNextLevel.remove()

                TweenTask.FadeOut(this.replayButton)
                TweenTask.FadeOut(this.overlay);
                TweenTask.ZoomOut(this.scoreBox);

                this.isReplay = true
                this.level = this.level - 1;
                this.shiftState(STATE.GAME)
            });
    }

    createAndConfigureCard(x, y, frame, scale) {
        return this.cards
            .spawn(x, y, 100, frame)
            .setScale(scale)
            .setDepth(ENV.LAYER.POPUP)
            .removeInteractive(); // Remove interactive immediately
    }

    createTutorial() {
        TweenTask.FadeIn(this.overlay);
        const frame = Phaser.Utils.Array.GetRandom(this.cardNames);

        const card1 = createAndConfigureCard.call(this, ENV.OFFSET + 244, 577, frame, 1.3);
        const card2 = createAndConfigureCard.call(this, ENV.OFFSET + 430, 577, frame, 1.3);

        TweenTask.FloatIn(this.tutBox, 0, 100, {
            onComplete: () => {
                card1.flip(
                    null,
                    () => {
                        this.popup1 = this.popup.spawn(ENV.OFFSET + 244, 465, false).setDepth(ENV.LAYER.POPUP);
                        this.fractal.explode(15, card1.x, card1.y);
                    },
                    1.3
                );
                card2.flip(
                    null,
                    () => {
                        this.popup2 = this.popup.spawn(ENV.OFFSET + 430, 465, false).setDepth(ENV.LAYER.POPUP);
                        this.fractal.explode(15, card2.x, card2.y);
                    },
                    1.3
                );
            },
        });

        this.btnClose = this.add
            .image(ENV.CENTER_X, 780, 'atlas', 'btn-close')
            .setDepth(ENV.LAYER.POPUP)
            .setScale(0);

        TweenTask.ZoomIn(this.btnClose, {
            delay: 500,
            duration: 500,
            onComplete: () => {
                    const delayedCallToStart = this.time.delayedCall(5000, () => {
                        this.btnClose.removeInteractive()

                        card1.release();
                        card2.release();
                        TweenTask.ZoomOut(this.btnClose);
                        TweenTask.FadeOut([this.popup1, this.popup2]);

                        this.shiftState(STATE.START);
                    })
                    
                    this.btnClose.setInteractive().once(Phaser.Input.Events.POINTER_DOWN, () => {
                        delayedCallToStart.remove()
                        card1.release();
                        card2.release();
                        TweenTask.ZoomOut(this.btnClose);
                        TweenTask.FadeOut([this.popup1, this.popup2]);

                        this.shiftState(STATE.START);
                    })
                },
        });
    }

    shiftState(state) {
        this.state = state;

        switch (state) {
            case STATE.TUT:
                this.createTutorial();

                break;
            case STATE.START:
                TweenTask.FadeOutBy(this.tutBox, 0, 100);
                TweenTask.FadeOut(this.overlay, { onComplete: () => this.shiftState(STATE.GAME) });
                break;
            case STATE.GAME:
                window.CRLV = this.level

                this.handleHUB(UPDATE)
                
                this.levelText.setPosition(ENV.CENTER_X, 420 - this.level * 50).setText(`LEVEL ${this.level}`);
                this.deck.setPosition(ENV.CENTER_X, 649).setFrame(`rect-${this.level}`);
                this.cards.spawnMap(
                    ENV.CENTER_X,
                    646,
                    this.map[this.level - 1].row,
                    this.map[this.level - 1].col,
                    156,
                    116,
                    100
                );

                TweenTask.FloatIn([this.levelText, this.deck], 0, -50);
                break;
            case STATE.LEVEL_UP:
                this.isReplay = false
                this.cascade = 0;
                this.pairCount = 0;
                this.cards.releaseAll(25);
                this.hudTimer.clock.reset();
                this.level++;
                TweenTask.FadeOutBy([this.levelText, this.deck], 0, 50, {
                    hold: 500,
                    onComplete: () => this.shiftState(STATE.SCORE),
                });
                break;
            case STATE.TIME:
                TweenTask.FadeOutBy([this.levelText], 0, 50);
                TweenTask.ZoomIn(
                    this.timesUpText
                    ,
                    {
                        onComplete: () => {
                            if(this.level === 1 && this.score === 0){
                                this.shiftState(STATE.END) 
                            }else{
                                this.shiftState(STATE.LEVEL_UP)
                            }
                        }
                    }
                )
                TweenTask.FadeIn(this.overlay)
                break;
            case STATE.SCORE:
                this.scoreText.update(0, this.score, 500);
                TweenTask.ZoomOut(this.timesUpText)
                TweenTask.FadeInAndOut(this.overlay, 1000, 1000);
                TweenTask.ZoomInAndOut(this.scoreBox, 1000, 1000, { onComplete: () => {
                    this.shiftState(this.level <= 3 ? STATE.GAME : STATE.END)
                } });
                break;
            case STATE.END:
                [this.hudScore, this.hudCount, this.hudTimer].forEach((hud, i) => {
                    TweenTask.MoveBy(hud, 0, -300, { delay: 100 * i });
                });
                this.time.delayedCall(700, () => this.next());
                break;
        }
    }

    update(_, dt) {
        dt /= 1000;
        switch (this.state) {
            case STATE.START:
                break;
            case STATE.GAME:
                if (this.cards.isCompleted) this.shiftState(STATE.LEVEL_UP);
                this.hudTimer.update(dt);
                if (this.hudTimer.clock.justFinished) this.shiftState(STATE.TIME);
                break;
            case STATE.TIME:
                break;
            case STATE.END:
                break;
        }
    }

    next() {
        this.ui.end();
        this.scene.start(ENV.SCENE.END, { score: this.score });
    }
}
