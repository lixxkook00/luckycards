import { DOMUtils } from '../libs/utils';
import { ENV } from '../env';

export default class Boot extends Phaser.Scene {
    constructor() {
        super(ENV.SCENE.BOOT);
    }

    init() {
        document.body.style.background = 'linear-gradient(to right,#1C355D,#F3C27D)';

        const element = document.createElement('style');
        document.head.appendChild(element);
        ENV.FONT_RULE.forEach((rule, i) => element.sheet.insertRule(`@font-face {${DOMUtils.CSSStringify(rule)}}`, i));

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('orientationchange', this.resize.bind(this));
    }

    preload() {
        this.load.atlas(ENV.LOADER.BOOT);

        // WebFont {@link https://labs.phaser.io/edit.html?src=src/game%20objects/text/custom%20webfont.js}
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        console.log(`%c Orientation ${this.scale.orientation} `, 'background: #111E4C; color: #fff');
    }

    create() {
        const getPropertyArray = (object, key) => Object.values(object).map((item) => item[key]);

        WebFont.load({
            custom: { families: getPropertyArray(ENV.FONT_RULE, 'fontFamily') },
            active: () => this.next(),
        });
    }

    next() {
        this.scene.start(ENV.SCENE.PRELOADER);
    }

    resize() {
        const container = document.getElementById(this.game.config.parent);
        switch (true) {
            default: //? window.innerWidth / window.innerHeight < ENV.RATIO:
                container.style.width = `${window.innerWidth}px`;
                container.style.height = `${window.innerWidth / ENV.RATIO}px`;
                break;
            case window.innerWidth / window.innerHeight > ENV.RATIO:
                container.style.height = `${window.innerHeight}px`;
                container.style.width = `${window.innerHeight * ENV.RATIO}px`;
                break;
        }
    }
}
