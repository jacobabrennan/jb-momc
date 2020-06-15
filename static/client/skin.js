

//==============================================================================

//-- Dependencies --------------------------------
import { graphicGet } from './resource_library.js';
import client from './index.js';

//-- Constants -----------------------------------
const SIZE_WIDTH_DEFAULT = 256;
const SIZE_HEIGHT_DEFAULT = 144;
const DELAY_ITERATION = 1000/30;

//-- Module State --------------------------------
let context;
let frameLast = 0;

//------------------------------------------------
export async function setup({ idContainer }) {
    // Manage DOM
    const container = document.getElementById(idContainer);
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    // Create drawing context
    context = canvas.getContext('2d');
    // Configure html container for displaying the client
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.display = 'flex';
    container.style.justifyContent = 'center';
    container.style.alignItems = 'center';
    // Configure the client display area
    canvas.width = SIZE_WIDTH_DEFAULT;
    canvas.height = SIZE_HEIGHT_DEFAULT;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.objectFit = 'contain';
    canvas.style.backgroundColor = 'black';
    canvas.style.imageRendering = 'crisp-edges';
    canvas.style.imageRendering = '-moz-crisp-edges';
    canvas.style.imageRendering = '-webkit-crisp-edges';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.imageRendering = 'crisp-edges';
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
    theGraphic.draw(context, drawX, drawY);
}
