import { EVENT } from '../../env';
import env from '../../env/env';
import { TweenTask } from '../animations';

export default class Video extends Phaser.GameObjects.Container {
    loopStart = 0;
    loopEnd = 0;
    isLooping = false;

    /**
     * @param {Phaser.Scene} scene - The configuration object for the video.
     */
    constructor(scene, x, y, width, height, elementId, src, scale = 1) {
        super(scene, x, y);
        scene.add.existing(this);

        /**
         * The width of the video frame.
         * @type {number}
         */
        this.frameWidth = width || 0;

        /**
         * The height of the video frame.
         * @type {number}
         */
        this.frameHeight = height || 0;

        /**
         * The HTML video element.
         * @type {HTMLVideoElement}
         */
        this.video = document.getElementById(elementId);
        this.video.pause();
        this.video.addEventListener('timeupdate', () => this.ontimeupdate());

        this.dom = scene.add.dom(0, 0, this.video).setDisplayOrigin(0).setScale(scale);

        this.source = document.createElement('source');
        this.source.src = src;
        this.video.append(this.source);

        this.add(this.dom);
    }

    /**
     * The aspect ratio of the video frame.
     * @readonly
     */
    get ratio() {
        return this.frameWidth / this.frameHeight;
    }

    /**
     * Returns a boolean indicating whether the video is currently playing.
     * @readonly
     */
    get isPlaying() {
        return !!(this.video.currentTime > 0 && !this.video.paused && !this.video.ended && this.video.readyState > 2);
    }

    /**
     * A double-precision floating-point value which indicates the duration (total length) of the media in seconds,
     * on the media's timeline. If no media is present on the element, or the media is not valid, the returned value is NaN.
     *
     * If the media has no known end (such as for live streams of unknown duration, web radio, media incoming from WebRTC,
     * and so forth), this value is +Infinity.
     *
     * If no video has been loaded, this method will return 0.
     * @readonly
     */
    get duration() {
        return this.video.duration;
    }

    /**
     * Indicating whether the video is currently muted or not.
     */
    get muted() {
        return this.video.muted;
    }
    set muted(value = true) {
        this.video.muted = value;
    }

    /**
     * The current playback time in seconds.
     * @type {number}
     */
    get currentTime() {
        return this.video.currentTime;
    }
    set currentTime(value) {
        this.video.currentTime = value;
    }

    load() {
        this.video.load();
        return this;
    }

    play() {
        this.video.play();
    }

    pause() {
        this.video.pause();
    }

    setCurrentTime(value) {
        this.currentTime = value;
        return this;
    }

    setMute(value) {
        this.muted = value;
        return this;
    }

    setSoundButton(elementId, soundOnId, soundOffId) {
        const btn = document.getElementById(elementId);
        const soundOn = document.getElementById(soundOnId);
        const soundOff = document.getElementById(soundOffId);
        soundOn.style.display = this.muted ? 'none' : 'block';
        soundOff.style.display = this.muted ? 'block' : 'none';

        this.soundButton = this.scene.add.dom(0, 0, btn).setOrigin(0);
        btn.onclick = () => {
            // event.stopPropagation();
            if (!this.isLooping) {
                this.muted = !this.muted;
                soundOn.style.display = this.muted ? 'none' : 'block';
                soundOff.style.display = this.muted ? 'block' : 'none';

                TATracker.send(this.muted ? EVENT.VIDEO.MUTE : EVENT.VIDEO.UNMUTE);
            }
        };

        this.soundButton.x = this.frameWidth - 65;
        // this.soundButton.x = this.frameWidth - this.soundButton.displayWidth * 2.25;
        this.soundButton.y = 10 ;


        return this.add(this.soundButton);
    }

    setPlayButton(elementId) {
        const btn = document.getElementById(elementId);
        this.playButton = this.scene.add.dom(this.frameWidth / 2, this.frameHeight / 2, btn).setOrigin(0.5);
        this.playButton.setInteractive().on(Phaser.Input.Events.POINTER_DOWN, 
            () => {
                this.play()
                // TATracker.send('Video Replay')
                // TATracker.send('Video Play Click​')
            }
        );
        this.add(this.playButton);

        this.video.addEventListener('ended', () => this.showPlayButton());
        this.video.addEventListener('pause', () => this.showPlayButton());
        this.video.addEventListener('play', () => this.hidePlayButton());
    }

    showPlayButton() {
        if (this.playButton)
            this.scene.add.tween({
                targets: this.playButton,
                scale: { from: 0, to: 1 },
                angle: { from: 180, to: 0 },
                duration: 250,
                onComplete: () => this.playButton.setInteractive(),
            });
    }

    hidePlayButton() {
        if (this.playButton)
            this.scene.add.tween({
                targets: this.playButton,
                scale: { from: 1, to: 0 },
                angle: { from: 0, to: 180 },
                duration: 250,
                onStart: () => this.playButton.removeInteractive(),
            });
    }

    /**
     * Sets the display size and texture of a video frame in a Phaser scene.
     * @param {number} width The width of this Video Frame.
     * @param {number} height The height of this Video Frame.
     * @param {string | Phaser.Textures.Texture} texture The key, or instance of the Texture, stored in the Texture Manager.
     * @param {string | number} frame An optional frame.
     */
    setVideoFrame(texture, frame, mx = 0, my = 0, width, height) {
        this.videoFrame = this.scene.add.image(-mx, -my, texture).setOrigin(0);
        frame && this.videoFrame.setFrame(frame);

        width = width || this.videoFrame.width;
        height = height || this.videoFrame.height;
        this.videoFrame.setDisplaySize(width, height);

        return this.add(this.videoFrame).sendToBack(this.videoFrame);
    }

    loopAt(from = 0, to = from) {
        if (!this.isPlaying) this.video.play();

        this.loopStart = from;
        this.loopEnd = to;
        this.video.currentTime = from;
        this.isLooping = true;
    }

    breakLoop(time = this.loopEnd + 0.01) {
        if (this.isLooping) this.video.currentTime = time;
        this.isLooping = false;
    }

    ontimeupdate() {
        if (this.isLooping) {
            if (this.video.currentTime <= this.loopStart) this.video.currentTime = this.loopEnd;
            else if (this.video.currentTime >= this.loopEnd) this.video.currentTime = this.loopStart;
        }
    }
}
