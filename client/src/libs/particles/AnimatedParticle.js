export default class AnimatedParticle extends Phaser.GameObjects.Particles
    .Particle {
    constructor(emitter, frames = []) {
        super(emitter);

        this.t = 0;
        this.i = 0;
        this.frames = frames;
    }

    update(delta, step, processors) {
        let id = Math.floor(
            ((this.life - this.lifeCurrent) / this.life) * this.frames.length
        );
        id = Math.min(this.frames.length - 1, id);
        this.frame = this.frames[id].frame;

        return super.update(delta, step, processors);
    }
}
