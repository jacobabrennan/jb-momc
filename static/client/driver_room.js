

//==============================================================================

//-- Dependencies --------------------------------
import {
    SIZE_TILE,
    NORTH,
    SOUTH,
    EAST,
    WEST,
    SIZE_WIDTH_DEFAULT,
} from '../constants.js';
import { roomGet } from '../game/room.js';
import { playerGet } from '../game/index.js';
import {
    driverCreate,
    CSS_CLASS_ACTIVE,
} from  './driver.js';
import {
    blank,
    drawImage,
    drawText,
} from './graphics.js';
import { commandState } from './key_state.js';
import { spritesGet } from './playerRemote.js';
import { graphicGet } from './resource_library.js';

//------------------------------------------------
export default driverCreate({
    configure({ idGameArea }) {
        this.containerId = idGameArea;
    },
    async focused() {
        const container = document.getElementById(this.containerId);
        container.classList.add(CSS_CLASS_ACTIVE);
    },
    blurred() {
        const container = document.getElementById(this.containerId);
        container.classList.remove(CSS_CLASS_ACTIVE);
    },
    iterate() {
        //
        let deltaX = 0;
        let deltaY = 0;
        if(commandState(NORTH)) { deltaY++;}
        if(commandState(SOUTH)) { deltaY--;}
        if(commandState(EAST)) { deltaX++;}
        if(commandState(WEST)) { deltaX--;}
        if(!deltaX && !deltaY) {
            return;
        }
        //
        const player = playerGet();
        deltaX *= player.speed;
        player.move(deltaX, deltaY);
    },
    display() {
        //
        blank();
        //
        const player = playerGet();
        const roomCurrent = roomGet(player.roomId);
        if(!roomCurrent) { return;}
        //
        const roomWidthMax = roomCurrent.width * SIZE_TILE;
        const cameraBoundLow = Math.floor(SIZE_WIDTH_DEFAULT/2);
        const cameraBoundHigh = Math.floor(roomWidthMax - SIZE_WIDTH_DEFAULT/2);
        const posXPlayer = Math.min(cameraBoundHigh, Math.max(cameraBoundLow, player.x));
        const posXCamera = Math.floor(SIZE_WIDTH_DEFAULT / 2) - posXPlayer;
        // Draw Paralax Layers
        for(let graphicId of roomCurrent.layers) {
            const graphic = graphicGet(graphicId);
            const distanceTravelTotal = (roomCurrent.width*SIZE_TILE) - SIZE_WIDTH_DEFAULT;
            const distanceParalaxTotal = graphic.width - SIZE_WIDTH_DEFAULT;
            const paralaxScale = distanceTravelTotal / distanceParalaxTotal;
            const drawX = posXCamera / paralaxScale;
            const drawY = 0;
            drawImage(graphicId, drawX, drawY);
        }
        // Draw Tile Grid
        for(let posY = 0; posY < roomCurrent.height; posY++) {
            for(let posX = 0; posX < roomCurrent.width; posX++) {
                const indexCompound = posY*roomCurrent.width + posX;
                const indexTileModel = roomCurrent.tileGrid[indexCompound];
                const tileModel = roomCurrent.tileTypes[indexTileModel];
                const drawX = (posX*SIZE_TILE) + posXCamera;
                const drawY = posY*SIZE_TILE;
                drawImage(tileModel.graphic, drawX, drawY);
            }
        }
        //
        for(let indexedParticle of roomCurrent.particles) {
            drawParticle(indexedParticle, posXCamera);
        }
        const sprites = spritesGet();
        for(let sprite of sprites) {
            const drawX = Math.floor(sprite.x+posXCamera+16/2);
            drawText(sprite.playerId, drawX, sprite.y+24);
            drawImage('bird', sprite.x+posXCamera, sprite.y);
        }
    },
});

//------------------------------------------------
function drawParticle(theParticle, posXCamera) {
    const drawX = theParticle.x + posXCamera;
    const drawY = theParticle.y;
    drawImage(theParticle.graphic, drawX, drawY);
}