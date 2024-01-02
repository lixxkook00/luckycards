import { ProgressBar, RotateScene } from '../libs/ui';
import { TweenTask } from '../libs/animations';
import { ENV, EVENT, TEXT_STYLES } from '../env';
import { Metamask, connectWallet, disconnectWallet } from '../services/wallets';

export default class Preloader extends RotateScene {
    constructor() {
        super(ENV.SCENE.PRELOADER);
    }

    preload() {
        this.load.atlas(ENV.LOADER.ATLAS);
        this.load.atlas(ENV.LOADER.ANIMATION);
        this.load.atlas(ENV.LOADER.UPDATE);
        this.load.spritesheet('shockwave', 'images/vfx-shockwave.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('fractal', 'images/vfx-fractal.png', { frameWidth: 128, frameHeight: 128 });

        // Loading Screen
        this.add.image(ENV.CENTER_X, ENV.CENTER_Y, 'boot', 'bg');
        this.add.image(ENV.CENTER_X, 1006, 'boot', 'copyright');
        this.add.image(ENV.CENTER_X, 177, 'boot', 'logo').setScale(0.8);

        this.loadingBar = new ProgressBar(this, ENV.CENTER_X, ENV.CENTER_Y);
        this.loadingBar
            .setColor(ENV.WIDTH / 2, 50, 5, 5, 0xf3e10a, 0x1d3c70)
            .setText('LOADING 0%', TEXT_STYLES.LOADING);

        this.load.on(Phaser.Loader.Events.PROGRESS, (value) =>
            this.loadingBar.setText(`LOADING ${parseInt(value * 100)}%`).update(value)
        );
    }

    create() {

        TweenTask.FadeOut(this.loadingBar, { onComplete: () => this.next() });

        this.anims.create({
            key: 'vfx-fractal',
            frames: this.anims.generateFrameNames('fractal', { start: 0, end: 63 }),
        });
        this.anims.create({
            key: 'vfx-shockwave',
            frames: this.anims.generateFrameNames('shockwave', { start: 0, end: 63 }),
        });

        this.anims.create({
            key: 'Kai',
            frameRate : 15,
            repeat : -1,
            yoyo: true,
            frames: this.anims.generateFrameNames('animation', { start: 1, end: 5 , prefix : 'Kai Brightstar_'}),
        });

        this.anims.create({
            key: 'LysSolay',
            frameRate : 15,
            repeat : -1,
            yoyo: true,
            frames: this.anims.generateFrameNames('animation', { start: 1, end: 4 , prefix : 'LysSolay_'}),
        });

        this.anims.create({
            key: 'Nubs',
            frameRate : 15,
            repeat : -1,
            yoyo: true,
            frames: this.anims.generateFrameNames('animation', { start: 1, end: 5 , prefix : 'Nubs_'}),
        });
    }

    next() {
        window.FT = true
        this.scene.launch(ENV.SCENE.UI);
        this.scene.start(ENV.SCENE.MAIN_MENU);
    }
}
