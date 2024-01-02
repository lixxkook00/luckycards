import { TATracker } from '../core';
import { ENV, EVENT, TEXT_STYLES } from '../env';
import { TweenTask } from '../libs/animations';
import { Video } from '../libs/components';
import { RotateScene } from '../libs/ui';

export default class UIScene extends RotateScene {
    constructor() {
        super({ key: ENV.SCENE.UI });

        this.dwellTime = null;
        this.muted = true;
    }

    get dwell() {
        return (this.dwellTime.repeat - this.dwellTime.repeatCount + 1) * 5;
    }

    preload() {
        // this.dwellTime = this.time.addEvent({
        //     delay: 5000,
        //     repeat: 23,
        //     callback: () => TATracker.sendOnce(EVENT.MAIN.DWELL_TIME + this.dwell),
        // });
    }

    create() {
        // this.audioBtn = this.add
        //     .image(ENV.WIDTH - 40, 40, 'atlas', 'sound-off')
        //     .setScale(0)
        //     .setInteractive()
        //     .on(Phaser.Input.Events.POINTER_DOWN, () => {
        //         this.muted = !this.muted;
        //         this.sound.volume = this.muted ? 0 : 1;
        //         TATracker.send(this.muted ? EVENT.MAIN.MUTE : EVENT.MAIN.UNMUTE);
        //         this.audioBtn.setFrame(this.muted ? 'sound-off' : 'sound-on');
        //     });

        this.walletAddress = this.add.text(ENV.WIDTH - 5, 20, 'Loading...', TEXT_STYLES.END).setOrigin(0.5).setOrigin(1, 0.5);

        this.video = new Video(this, ENV.WIDTH + 41, 163, 485, 280, 'engagement-tvc', ENV.LOADER.VIDEO, 485 / 640);
        this.video
            .setVideoFrame('update', 'tvc', 12, 12, 510, 296)
            .setSoundButton('svg-sound', 'svg-sound-on', 'svg-sound-off')
            .setPlayButton('svg-play');
    }

    setWalletAddress(walletAddress = '') {
        this.walletAddress.setText(walletAddress)
    }

    showVideo() {
        this.video.load();
        this.video.play();
        TweenTask.MoveTo(this.video, ENV.OFFSET + 100, 163);
    }

    hideVideo() {
        this.video.pause();
        TweenTask.MoveTo(this.video, ENV.WIDTH + 41, 163);
    }

    start() {
        // TweenTask.ZoomIn(this.audioBtn);
    }

    end() {
        // TweenTask.ZoomOut(this.audioBtn);
    }
}
