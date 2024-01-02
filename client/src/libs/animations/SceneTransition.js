const SceneTaskConfig = {
    next: '',
    duration: 250,
    onStart: () => {},
    onComplete: () => {},
};

export default class SceneTransition {
    /**
     * Fades in the scene camera.
     * @param {Phaser.Scene} scene - The scene that the transition is being applied to.
     * @param {SceneTaskConfig} config
     */
    static FadeIn(scene, config = SceneTaskConfig) {
        scene.cameras.main.fadeIn(config.duration || SceneTaskConfig.duration);
        config.onStart &&
            scene.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_IN_START,
                () => config.onStart()
            );
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_IN_COMPLETE,
            () => {
                config.next && scene.scene.start(config.next);
                config.onComplete && config.onComplete();
            }
        );
    }

    /**
     * Fades out the scene camera.
     * @param {Phaser.Scene} scene - The scene that the transition is being applied to.
     * @param {SceneTaskConfig} config
     */
    static FadeOut(scene, config = SceneTaskConfig) {
        scene.cameras.main.fadeOut(config.duration || SceneTaskConfig.duration);
        config.onStart &&
            scene.cameras.main.once(
                Phaser.Cameras.Scene2D.Events.FADE_OUT_START,
                () => config.onStart()
            );
        scene.cameras.main.once(
            Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
            () => {
                config.next && scene.scene.start(config.next);
                config.onComplete && config.onComplete();
            }
        );
    }
}
