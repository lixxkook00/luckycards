import { Boot, End, Play, MainMenu, Preloader, UIScene } from '../scenes';

// Open the Dev Tools
// The text in the banner will be in white on a #111E4C background.
// The colors at the start of the spectrum array define the blocks at the beginning of the banner
const title = 'TotallyAwesome Richmedia';
const text = '#FFFFFF';
const background = ['#FFE648', '#00C5BF', '#FF4E0A', '#4E77CC', '#111E4C'];
const url = 'https://totallyawesome.tv/';
const version = '2.0';
const parent = 'engagement-panel';

export default class GameConfig {
    constructor(width, height, path = '') {
        this.isPortrait = true;
        this.width = this.isPortrait ? width : height;
        this.height = this.isPortrait ? height : width;
        this.path = path;
    }

    /**
     * Phaser 3 game config, you can change this.
     * @type {Phaser.Types.Core.GameConfig}
     */
    get config() {
        return {
            type: Phaser.AUTO,
            autoFocus: true,
            batchSize: 512,
            title,
            url,
            version,
            loader: { path: this.path },
            banner: { text, background, hidePhaser: true },
            input: { activePointers: 1 },
            dom: { createContainer: true },
            scale: {
                width: this.width,
                height: this.height,
                mode: Phaser.Scale.FIT,
                autoRound: true,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                parent,
            },
            transparent: true,
            scene: [Boot, Preloader, MainMenu, Play, End, UIScene],
        };
    }
}