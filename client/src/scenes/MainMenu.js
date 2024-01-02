import { ParticleTask, TweenTask } from '../libs/animations';
import { ENV, EVENT, TEXT_STYLES } from '../env';
import { RotateScene } from '../libs/ui';
import { FloatingTexts, MemoryCards } from '../libs/pools';
import { connectWallet } from '../services/wallets';

export default class MainMenu extends RotateScene {
    charNames = [
        { atlas: 'boot', frame: 'char-3', x: 237, y: 870 , anims : ''},
        { atlas: 'animation', frame: 'LysSolay_0', x: 416, y: 886 , anims : 'LysSolay'},
        { atlas: 'animation', frame: 'Kai Brightstar_0', x: 339, y: 845 , anims : 'Kai'},
        { atlas: 'animation', frame: 'Nubs_0', x: 484, y: 890 , anims : 'Nubs'},
        { atlas: 'boot', frame: 'char-5', x: 268, y: 947 , anims : ''},
        { atlas: 'boot', frame: 'char-6', x: 181, y: 915 , anims : ''},
    ];

    cardNames = ['card-1', 'card-2', 'card-3', 'card-4', 'card-5', 'card-6', 'card-7', 'card-8', 'card-9', 'card-10'];

    EGG = [
        { x: ENV.OFFSET + 186, y: 622, frame: 'egg-blue' },
        { x: ENV.OFFSET + 497, y: 622, frame: 'egg-pink' },
    ];

    chars = [];

    constructor() {
        super(ENV.SCENE.MAIN_MENU);
    }

    preload() {
        this.add.image(ENV.CENTER_X, ENV.CENTER_Y, 'boot', 'bgr');
        this.add.image(ENV.CENTER_X, 1006, 'boot', 'copyright');

        this.logo = this.add.image(ENV.CENTER_X, 177, 'boot', 'logo').setScale(0.8);
        this.tagline = this.add.image(ENV.OFFSET + 437, 110, 'boot', 'tagline').setScale(0);

        this.ui = this.scene.get(ENV.SCENE.UI);

        this.charNames.forEach((char, i) => {
            const texture = this.add.sprite(ENV.OFFSET + char.x, char.y, char.atlas, char.frame).setScale(0.48);
            const offsetX = texture.x < ENV.CENTER_X ? ENV.WIDTH - texture.x : -texture.x;
            char.anims !== "" && texture.play(char.anims);
            this.chars.push(texture);
        });
    }

    async handleConnectWallet() {
        const walletAddress = await connectWallet();
        await this.ui.setWalletAddress(walletAddress);
    }

    create() {
        this.handleConnectWallet()
        this.showCards()
        TweenTask.MoveTo(this.logo, ENV.OFFSET + 158, 137, { delay: 750 });
        TweenTask.ZoomIn(
            this.tagline, 
            { 
                delay: 1000 , 
                scale : 0.8 ,
                onComplete : () => {
                    
                }
            }
        );
    }

    startWithFullScreen() {
        this.input.setHitArea(this.add.rectangle(0, 0, ENV.WIDTH, ENV.HEIGHT));
        this.input.on('pointerdown', (pointer, gameObject) => {
            this.scene.start(ENV.SCENE.PLAY)
        });
    }

    setupEffect() {
        this.fractal = ParticleTask.Spark(this.add.particles(0, 0, 'fractal'), this.anims.get('vfx-fractal').frames, {
            scale: { min: 2, max: 3 },
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
    }

    setupHandAnimation(hand, card, delay) {
        TweenTask.ZoomIn(hand, {
            onComplete: () =>
            {
                this.tweens.add({
                    targets: hand,
                    angle: -5,
                    alpha: 1,
                    scale: { from: 1, to: 0.9 },
                    delay,
                    duration: 500,
                    ease: 'Back.easeOut',
                    yoyo: true,
                    repeat: -1,
                    repeatDelay: 2000,
                    onYoyo: () => {
                        TweenTask.Shaking(card, 0.8)
                        this.tweens.add({
                            targets: hand,
                            alpha: 0,
                            duration: 500,
                        });
                    },
                });
            }
        });
    }

    showCards() {
        this.setupEffect();

        this.cardFlag = 0

        this.cards = new MemoryCards(this, 52, 'update', 'card_up', 'card');
        this.popup = new FloatingTexts(this, 52, '+50', TEXT_STYLES.POPUP);

        this.card1 = this.cards
            .spawn(ENV.OFFSET + 181, 517, 100, 'card_up')
            .setDepth(ENV.LAYER.POPUP);

        this.card2 = this.cards
            .spawn(ENV.OFFSET + 502, 517, 100, 'card_up')
            .setDepth(ENV.LAYER.POPUP);

        this.cardsList = [this.card1, this.card2]

        this.title = this.add.image(ENV.CENTER_X, 282, 'update', 'Match_the_same_cards_to_start!').setScale(0)
        TweenTask.ZoomIn(this.title, { delay : 500,  duration: 200 })

        this.hand = this.add.image(ENV.OFFSET + 253 + 40, 640, 'update', 'MicrosoftTeams-image (12)').setScale(0).setDepth(100)
        this.hand2 = this.add.image(ENV.OFFSET + 565 + 40, 640, 'update', 'MicrosoftTeams-image (12)').setScale(0).setDepth(100).setAlpha(0)

        this.setupHandAnimation(this.hand, this.card1, 0)
        this.setupHandAnimation(this.hand2, this.card2, 1500)

        this.overlay = this.add.rectangle(ENV.CENTER_X, ENV.CENTER_Y + 20, ENV.WIDTH, ENV.HEIGHT/2.7, 0x000000, 0).setDepth(10000)
        
        this.overlay.setInteractive().on('pointerdown', () => {
            this.card1.removeInteractive()
            this.card2.removeInteractive()
            
            this.flipCards()
        })

    }

    flipCards() {
        this.cardsList.forEach(card => card.flip())

        TweenTask.ZoomOut(
            this.hand
        )
        TweenTask.ZoomOut(
            this.hand2
        )

        this.time.delayedCall(500, () => {
            this.popup1 = this.popup.spawn(ENV.OFFSET + 181, 370, false).setDepth(ENV.LAYER.POPUP);
            this.fractal.explode(25, this.card1.x, this.card1.y);

            this.popup2 = this.popup.spawn(ENV.OFFSET + 502, 370, false).setDepth(ENV.LAYER.POPUP);
            this.fractal.explode(25, this.card2.x, this.card2.y);
        })

        this.time.delayedCall(1000, () => {
            [this.card1, this.card2].forEach(card => {
                this.cards.release(card)
            })

            TweenTask.ZoomOut([this.popup1, this.popup2, this.title], {
                onComplete: () => {
                    this.start()
                }
            })
        })
    }

    start() {

        this.chars.forEach((char, i) => {
            const offsetX = char.x > ENV.OFFSET + 377 ? ENV.WIDTH - char.x : -char.x;
            TweenTask.MoveBy(
                char, 
                offsetX * 1.75, 
                0, 
                { 
                    delay: 100 * i ,
                }
            );
        });

        TweenTask.ZoomOut([this.logo, this.tagline], {
            hold: 500,
            onComplete: () => this.scene.start(ENV.SCENE.PLAY),
        });
    }
}
