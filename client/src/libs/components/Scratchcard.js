import { Calc, DOMUtils } from '../utils';

const MAX_PROGRESS = 85;
const BRUSH_SRC =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLCAYAAAA4TnrqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAr9JREFUeNrsnItxozAQhiUqIB3YFRh3QCoJ6SCp4CYVkKsArhK7A9sV2B2EDnSrZHEwBiHwC6T/n9khjnEwX3ZXK/SQ4s5SSoV0iMhisgVZyD93aU1WkO3Itvq1lLIQrokARWQp2UZdVxv+u9HUAYVkb2R7dR/t+XrhlCDNyDL1WOnrz8buSY+G1AQtHBso7f5fapzS3+ttLCG3UtPQ6mGhSRdORuxNJi9L7g0qVdNWOuS+5QBQGR0SMX3lVNS+3gQWtyorrr5dke4JPNv2BPrA2jgG6giMYC1tTgx6hJ6LoLQivr/LYXEyTITbSmySvuwqD+iQCX/0SiGZ94bFBdyGH6H4Ip3olwTs0DcMM89ACb7frFfO4r5ULPxU3NaXlC311N5Dr6qH47xefzV5Vuo5qDIcU6NncVLfC6jUvJrs6571B3zaecharvoCnzM9lbmr6lkJuDRX902epXPVDGzOdCDPmh89i8fdAKpZs3JcsgzDFzAx6qUKKwYPc1X/nbPQCtq3igG8ylqRhhWBg10oalgLcLDSIkCn2b5zrRO8Agc7BUAAWIAFWIAFWIAFBIB1M1hrYLDSWsMqwMFKhYa1Awcr7RCGPcIQT0rt9RTwAOIWLIzS806LsnRAKHaEYLXO+gceRn3zwYh0t05HpFl/waVRRy6YRWPRCp7NouFf5GBzorw6VRIz/8xqn/nHb8C7fr3qcMKnfgZmK/90moXNbGU+4cNzr/poWlZnWo6i1xbGXnaYpXxuegNrd87Dr//aHf7Au2de9d4GygiLgemW8dMTUJ+m5XPGMKyFpCuLyE1lQuficqyRvvYaaZZuIVx7SLjl+xJXhaXrDv4P5A6F3vLmG5b5umPIJcCwF01PYNjlaAA07J/VExh2ZhsYmtjzb4CnYTfJAeCc2KdUPsLjxOU74K65m3LX6VL/BRgAOPZThTXgXpsAAAAASUVORK5CYII=';

/**
 * To create a scratcher element.
 * Recommended you should create a parent container for scratchcard canvas.
 */
export default class Scratchcard {
    /**
     * @param {ScratchcardConfig} [config]
     */
    constructor(config) {
        this.config = config;
        this.canvas = document.createElement('canvas');
        this.canvas.width = config.width || 0;
        this.canvas.height = config.height || 0;
        this.canvas.style.cssText = DOMUtils.CSSStringify({
            '-webkit-user-select': 'none',
            'user-select': 'none',
            height: '100%',
        });
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx = this.canvas.getContext('2d');
        this.reveal = document.createElement('img');
        this.reveal.style.cssText = DOMUtils.CSSStringify({
            '-webkit-user-select': 'none',
            'user-select': 'none',
            height: '100%',
            'pointer-events': 'none',
        });
        this.parent =
            typeof config.parent === 'string'
                ? document.getElementById(config.parent)
                : config.parent;
        !this.parent.append && (this.parent = document.body);
        this.parent.append(this.reveal);
        this.parent.append(this.canvas);

        this.maxProgress = config.maxProgress || MAX_PROGRESS;

        this.setReveal(config.revealURL)
            .setCover(config.coverURL)
            .setBrush(config.brushURL || BRUSH_SRC)
            .setOnComplete(config.onComplete)
            .init();
    }

    /**
     * Get canvas context.
     */
    get context() {
        return this.ctx;
    }

    /**
     * Check the progress the scratching process.
     */
    get isCompleted() {
        return this.getProgress() >= this.maxProgress;
    }

    /**
     * init.
     */
    init() {
        this.lastPoint = null;
        this.isDrawing = false;

        this.on('pointerdown', this.pointerdown.bind(this));
        this.on('pointermove', this.pointermove.bind(this));
        this.on('pointerdown', this.pointermove.bind(this));
        return this;
    }

    /**
     * Takes a stride (the number of pixels to skip) and returns the percentage of black pixels in the image
     * @param {number} stride - The number of pixels to skip. The higher the number, the faster the progress will be calculated, but the less accurate it will be. Default 32.
     */
    getProgress(stride = 32) {
        (!stride || stride < 1) && (stride = 1);

        const pixels = this.ctx.getImageData(0, 0, this.width, this.height),
            pdata = pixels.data,
            l = pdata.length,
            total = l / stride;
        let count = 0;

        // Iterate over all pixels
        for (let i = count; i < l; i += stride)
            parseInt(pdata[i]) === 0 && count++;

        return Math.round((count / total) * 100);
    }

    /**
     * Returns the x and y coordinates of a pointer event relative to a canvas element.
     * @param {PointerEvent} event The event parameter is an object that represents an event that occurred in the browser, such as a mouse click or touch event.
     * @param {HTMLCanvasElement} canvas The canvas parameter is the HTML canvas element on which the user is interacting with the mouse or touch events.
     * @returns {Phaser.Types.Math.Vector2Like} The oordinates of the pointer (mouse or touch) relative to the top-left corner of the canvas element.
     */
    getPointer(event, canvas) {
        const rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;
        return {
            x:
                ((event.clientX || event.touches[0].clientX) - rect.left) *
                scaleX,
            y:
                ((event.clientY || event.touches[0].clientY) - rect.top) *
                scaleY,
        };
    }

    /**
     * Sets the src attribute of the reveal element to the url.
     * @param {string} url - The URL of the image to be revealed.
     */
    setReveal(url) {
        url && (this.reveal.src = url);
        return this;
    }

    /**
     * Clear the canvas, draw new image on the canvas.
     * @param {string} url - The URL of the image to be used as the cover.
     */
    setCover(url) {
        if (!url) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.cover = new Image();
        this.cover.src = url;
        this.cover.onload = () =>
            this.ctx.drawImage(this.cover, 0, 0, this.width, this.height);
        return this;
    }

    /**
     * Creates a new brush and sets the source to the url.
     * @param {string} url - The URL of the brush image.
     */
    setBrush(url = BRUSH_SRC) {
        if (!url) return;
        this.brush = new Image();
        this.brush.src = url;
        return this;
    }

    /**
     * Sets the onComplete property to the callback parameter.
     * @param {function} callback - The function to call when the scratching is completed.
     */
    setOnComplete(callback) {
        callback && (this.onComplete = callback);
        return this;
    }

    /**
     * The function removes the canvas element from the DOM.
     * @param {function} callback - The function to call when the scratching is removed.
     */
    remove(callback) {
        this.canvas && this.canvas.remove();
        callback && callback();
        return this;
    }

    /**
     * Resets scratching game
     * @param {function} callback - The function to call when reset the canvas.
     */
    reset(callback) {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.drawImage(this.cover, 0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'source-atop';
        callback && callback();
        return this;
    }

    /**
     * Handles pointer down.
     * @param {PointerEvent} event
     */
    pointerdown(event) {
        this.isDrawing = true;
        this.lastPoint = this.getPointer(event, this.canvas);
    }

    /**
     * Handles pointer move.
     * @param {PointerEvent} event
     */
    pointermove(event) {
        if (!this.isDrawing) return;

        event.preventDefault();

        const currentPoint = this.getPointer(event, this.canvas),
            dist = Calc.Distance.BetweenPoints(this.lastPoint, currentPoint),
            angle = Calc.Angle.BetweenPoints(this.lastPoint, currentPoint);
        let x, y;

        for (let i = 0; i < dist; i++) {
            x = this.lastPoint.x + Math.sin(angle) * i - 25;
            y = this.lastPoint.y + Math.cos(angle) * i - 25;
            this.ctx.globalCompositeOperation = 'destination-out';
            this.ctx.drawImage(this.brush, x, y);
        }

        this.lastPoint = currentPoint;
        this.isCompleted && this.onComplete && this.onComplete();
    }

    /**
     * Handles pointer up.
     * @param {PointerEvent} event
     */
    pointerup(event) {
        this.isDrawing = false;
        event.preventDefault();
    }

    /**
     * Adds an event listener to the canvas
     * @param {string} type - The event type to listen for.
     * @param {(this: Window, ev: PointerEvent)=>{}} listener - The function that will be called when the event is fired.
     * @param {boolean|AddEventListenerOptions} options - An options object that specifies characteristics about the event listener.
     */
    on(type, listener, options = false) {
        this.canvas.addEventListener(type, listener, options);
        return this;
    }
}

/**
 * @typedef ScratchcardConfig
 * @prop {HTMLElement} parent
 * @prop {number} width
 * @prop {number} height
 * @prop {string|URL} coverURL
 * @prop {string|URL} revealURL
 * @prop {string|URL} brushURL
 * @prop {number} maxProgress
 * @prop {() => {}} onComplete
 */
