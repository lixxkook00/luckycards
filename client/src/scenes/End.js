import { TATracker } from '../core';
import { ENV, EVENT, TEXT_STYLES } from '../env';
import { TweenTask } from '../libs/animations';

export default class End extends Phaser.Scene {
    pkgNames = [
        { frame: 'F80025X00_pkg_23', x: 107 },
        { frame: 'F80035X00_pkg_23', x: 262 },
        { frame: 'F80045X00_pkg_23', x: 418 },
        { frame: 'F80055X00_pkg_23', x: 576 },
    ];

    constructor() {
        super(ENV.SCENE.END);
    }

    init(data) {
        this.score = data.score;
        this.ui = this.scene.get(ENV.SCENE.UI);
        this.package = [];
    }

    preload() {
        this.add.image(ENV.CENTER_X, ENV.CENTER_Y, 'boot', 'bg');
        this.copyright = this.add.image(ENV.CENTER_X, 1006, 'boot', 'copyright');
        this.logo = this.add.image(ENV.CENTER_X, 77, 'boot', 'logo').setAngle(30).setScale(0);

        this.scoreText = this.add.container(ENV.OFFSET + 217, 515).setScale(0);
        this.scoreText.add([
            this.add.image(0, 0, 'update', 'final_score_box'),
            this.add.text(0, -25, 'FINAL SCORE', TEXT_STYLES.END).setOrigin(0.5),
            this.add.text(0, 22, this.score || 0, TEXT_STYLES.END_SCORE).setOrigin(0.5),
        ]);

        this.footer = this.add.container(ENV.CENTER_X, ENV.HEIGHT + 80);
        this.footer.add([
            this.add.rectangle(0, 0, ENV.WIDTH, 80, 0xfde801).setOrigin(0.5, 1),
            this.add.image(-192, -36, 'atlas', 'text-available-at'),
            this.add.image(-26, -39, 'atlas', 'store-big'),
            this.add.image(105, -39, 'atlas', 'store-kmart'),
            this.add.image(237, -39, 'atlas', 'store-myer'),
        ]);

        this.ui.showVideo();
    }

    create() {
        this.replayButton = this.add
            .image(ENV.OFFSET + 461, 505, 'atlas', 'btn-replay')
            .setScale(0)
            .setInteractive()
            .once(Phaser.Input.Events.POINTER_DOWN, () => {
                this.replayButton.removeInteractive();
                this.replay();
            });

        this.ctaButton = this.add
            .image(ENV.CENTER_X, 745, 'update', 'discover_more_box')
            .setScale(0)
            .setInteractive()
            .on(Phaser.Input.Events.POINTER_DOWN, () => {
                this.callToAction();
                this.ctaButton.removeInteractive();
                this.time.delayedCall(500, () => this.ctaButton.setInteractive());
            });

        TweenTask.ZoomIn(this.logo, { scale: 0.6, angle: 0 });
        TweenTask.ZoomIn(this.scoreText);
        TweenTask.MoveBy([this.copyright, this.footer], 0, -80);

        TweenTask.ZoomIn(this.replayButton, {
            scale : 1.05,
            delay: 500,
            onComplete: () => TweenTask.Pulse(this.replayButton, { delay: 500 , scale : 1.02}),
        });

        TweenTask.ZoomIn(this.ctaButton, {
            delay: 250,
            onComplete: () => TweenTask.HeartBeat(this.ctaButton, { delay: 1000 , duration : 250}),
        });

        this.arrow = this.add.image(ENV.OFFSET + 629, 531, 'update', 'arrow').setScale(0)
        TweenTask.ZoomIn(
            this.arrow,
            {
                delay: 250,
                onComplete: () => {
                    TweenTask.MoveTo(
                        this.arrow,
                        ENV.OFFSET + 624,
                        533,
                        {
                            yoyo: true,
                            repeat : -1,
                        }
                    )
                }
            }
        )
        
    }

    replay() {
        window.FT = false
        TweenTask.ZoomOut([this.replayButton, this.logo, this.ctaButton]);
        TweenTask.MoveBy([this.copyright, this.footer], 0, 80);
        TweenTask.MoveBy(this.scoreText, ENV.WIDTH, 0, {
            hold: 400,
            onComplete: () => this.scene.start(ENV.SCENE.PLAY),
        });

        this.ui.hideVideo();
    }

    callToAction() {
        // TATracker.click(EVENT.MAIN.CTA);
    }
}
