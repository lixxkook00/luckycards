/**
 * A timer class that can be used to track the time elapsed and time remaining of a duration.
 */
export default class Timer {
    /**
     * @param {number} duration - The duration of the timer in milliseconds.
     */
    constructor(duration = 0) {
        this.setDuration(duration);
    }

    /**
     * Returns the elapsed time.
     */
    get elapsedTime() {
        return this._elapsed;
    }

    /**
     * Returns the remain time.
     */
    get remainTime() {
        return this.duration - this._elapsed;
    }

    /**
     * Returns the percentage is 1 minus the elapsed time divided by the duration.
     */
    get percentage() {
        return 1 - this._elapsed / this.duration;
    }

    /**
     * Returns true if the timer is just finished, returns false otherwise.
     */
    get justFinished() {
        if (!this._justFinished) return false;

        this._justFinished = false;
        return true;
    }

    /**
     * Returns true if the timer is finished, returns false otherwise.
     */
    get isFinished() {
        return this._isFinished;
    }

    /**
     * Updates the timer with delta time.
     * @param delta - The time in seconds since the last update.
     */
    update(delta) {
        if (this._elapsed < this.duration) {
            this._elapsed += delta;
            if (this._elapsed >= this.duration) {
                this._elapsed = this.duration;
                this._justFinished = true;
                this._isFinished = true;
            }
        }
    }

    /**
     * Set the duration of the timer.
     * @param {number} duration - The duration of the tween in milliseconds.
     */
    setDuration(duration) {
        this._justFinished = false;
        this._isFinished = duration <= 0;
        this._elapsed = 0;
        this.duration = duration;
    }

    /**
     * Resets the timer
     */
    reset() {
        this.setDuration(this.duration);
    }
}
