

//==============================================================================

//-- Dependencies --------------------------------
import {
    SIZE_WIDTH_DEFAULT,
    SIZE_HEIGHT_DEFAULT,
} from '../constants.js';
import { graphicGet } from './resource_library.js';
import client from './index.js';

//-- Constants -----------------------------------
const DELAY_ITERATION = 1000/30;

//-- Module State --------------------------------
let context;
let frameLast = 0;

//------------------------------------------------
export async function setup({ idGameArea }) {
    // Create drawing context
    const container = document.getElementById(idGameArea);
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    context = canvas.getContext('2d');
    // Configure the client display area
    canvas.width = SIZE_WIDTH_DEFAULT;
    canvas.height = SIZE_HEIGHT_DEFAULT;
    // Begin animating
    animationIterate(0);
}

//------------------------------------------------
function animationIterate(timeStamp) {
    //
    const frameDelta = timeStamp - frameLast;
    //
    if(frameDelta >= DELAY_ITERATION) {
        frameLast = timeStamp;
        if(client.driverCurrent) {
            client.driverCurrent.iterate();
            client.driverCurrent.display();
        }
    }
    //
    window.requestAnimationFrame(animationIterate);
}

//------------------------------------------------
export function blank() {
    context.save();
    context.clearRect(0, 0, SIZE_WIDTH_DEFAULT, SIZE_HEIGHT_DEFAULT);
    context.restore();
}
export function fillRect(color, posX, posY, width, height) {
    context.save();
    context.fillStyle = color;
    let drawX = posX;
    let drawY = SIZE_HEIGHT_DEFAULT - (height+posY);
    context.fillRect(drawX, drawY, width, height);
    context.restore();
}
export function drawImage(idGraphic, posX, posY) {
    let drawX = posX;
    let drawY = SIZE_HEIGHT_DEFAULT - posY;
    let theGraphic = graphicGet(idGraphic);
    if(!theGraphic) { return;}
    theGraphic.draw(context, drawX, drawY);
}
