export default class RotateScene extends Phaser.Scene {
    /**
     * @param {string|Phaser.Types.Scenes.SettingsConfig} [config]
     */
    constructor(config) {
        super(config);

        this.orientationchange();
    }

    orientationchange(orientation) {
        if (orientation === Phaser.Scale.PORTRAIT) {
            console.log(Phaser.Scale.PORTRAIT);
        } else if (orientation === Phaser.Scale.LANDSCAPE) {
            console.log(Phaser.Scale.LANDSCAPE);
            this.cameras.main.rotation = Math.PI * 0.5;
            this.cameras.main.scrollX = (this.scale.width - this.scale.height) / 2;
            this.cameras.main.scrollY = (this.scale.height - this.scale.width) / 2;
        }
    }
}
