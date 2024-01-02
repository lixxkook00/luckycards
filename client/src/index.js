import Phaser from './phaser-core';
import { ENV } from './env';

import '../styles/main.css';

/**
 * When the page loads, create a new instance of the Game class.
 */
function loadRichMedia() {
    window.RichMedia = new Phaser.Game(ENV.CONFIG);
}

/**
 * Enabler initialized.
 * In App are rendered offscreen so animation should wait for the visible event.
 * These are simulated with delays in the local environment.
 * @source {@link https://www.google.com/doubleclick/studio/docs/sdk/html5/en/class_studio_Enabler.html}
 */
function enablerInitialized() {
    if (Enabler.isVisible()) enablerVisible();
    else Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, enablerVisible);
}

/**
 * Richmedia visible, start richmedia/animation.
 * @source {@link https://www.google.com/doubleclick/studio/docs/sdk/html5/en/class_studio_Enabler.html}
 */
function enablerVisible() {
    loadRichMedia();
}

//? Checking the build environment and then running the appropriate code.
if (process.env.platform === 'studio') {
    if (Enabler.isInitialized()) enablerInitialized();
    else Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialized);
} else loadRichMedia();
