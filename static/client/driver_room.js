

//==============================================================================

//-- Dependencies --------------------------------
import {
    SIZE_TILE,
    NORTH,
    SOUTH,
    EAST,
    WEST,
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
} from './graphics.js';
import { commandState } from './key_state.js';
import { spritesGet } from './playerRemote.js';

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
        player.move(deltaX, deltaY);
    },
    display() {
        //
        blank();
        //
        const player = playerGet();
        const roomCurrent = roomGet(player.roomId);
        //
        for(let posY = 0; posY < roomCurrent.height; posY++) {
            for(let posX = 0; posX < roomCurrent.width; posX++) {
                const indexCompound = posY*roomCurrent.width + posX;
                const indexTileModel = roomCurrent.tileGrid[indexCompound];
                const tileModel = roomCurrent.tileTypes[indexTileModel];
                drawImage(tileModel.graphic, posX*SIZE_TILE, posY*SIZE_TILE);
            }
        }
        //
        for(let indexedParticle of roomCurrent.particles) {
            drawParticle(indexedParticle);
        }
        const sprites = spritesGet();
        for(let sprite of sprites) {
            drawImage('bird', sprite.x, sprite.y);
        }
    },
});

//------------------------------------------------
function drawParticle(theParticle) {
    drawImage(theParticle.graphic, theParticle.x, theParticle.y);
}
