

//== Keyboard ==================================================================


//-- Dependencies --------------------------------
import {
    NORTH,
    SOUTH,
    EAST,
    WEST,
} from '../constants.js';

//-- Constants -----------------------------------
// note canonical (lowercase) representation
export const KEY_ARROW_UP = 'arrowup';
export const KEY_ARROW_DOWN = 'arrowdown';
export const KEY_ARROW_RIGHT = 'arrowright';
export const KEY_ARROW_LEFT = 'arrowleft';

//-- Keyboard Preferences ------------------------
const preferences = {
    [NORTH]: KEY_ARROW_UP,
    [SOUTH]: KEY_ARROW_DOWN,
    [EAST]: KEY_ARROW_RIGHT,
    [WEST]: KEY_ARROW_LEFT,
}
const keyMap = {};

//-- Module State --------------------------------
const keyState = {};

//-- Setup ---------------------------------------
export async function setup() {
    // Generate keyMap from preferences
    for(const command in preferences) {
        const key = preferences[command];
        keyMap[key] = command;
    }
    // Define keyboard event handlers
    function handleEventKeyDown(eventKeyDown) {
        handleKeyDown(eventKeyDown.key.toLowerCase());
    }
    function handleEventKeyUp(eventKeyUp) {
        handleKeyUp(eventKeyUp.key.toLowerCase());
    }
    // Connect event handlers to keyState system
    const container = document;
    container.addEventListener('keydown', handleEventKeyDown);
    container.addEventListener('keyup'  , handleEventKeyUp  );
}

//-- Keyboard state management -------------------
export function commandState(command) {
    const key = preferences[command];
    return keyState[key];
}
function handleKeyDown(key) {
    key = key.toLowerCase();
    keyState[key] = true;
}
function handleKeyUp(key) {
    key = key.toLowerCase();
    keyState[key] = false;
}
